"""
Servidor HTTP simples para "subir" a UI HTML e persistir jogos.

Este projeto estava com a interface pronta, mas faltava o backend esperado pelos HTML:
- GET  /api/proximo-concurso
- POST /salvar_jogo_personalizado
- POST /salvar_jogos.py   (usado pela tela de gerenciamento)
- GET  /historico_jogos.json

Sem dependências externas (usa apenas stdlib).
"""

from __future__ import annotations

import json
import mimetypes
import os
import re
import sys
import urllib.request
from datetime import datetime, timedelta
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any

BASE_DIR = Path(__file__).resolve().parent
HISTORICO_FILE = BASE_DIR / "historico_jogos.json"

API_URL_OFICIAL = "https://servicebus2.caixa.gov.br/portaldeloterias/api/megasena/"


def _json_response(handler: BaseHTTPRequestHandler, status: int, payload: Any) -> None:
    data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(data)))
    handler.end_headers()
    handler.wfile.write(data)


def _read_json_body(handler: BaseHTTPRequestHandler) -> Any:
    length = int(handler.headers.get("Content-Length", "0") or "0")
    raw = handler.rfile.read(length) if length > 0 else b""
    if not raw:
        return None
    try:
        return json.loads(raw.decode("utf-8"))
    except Exception as e:
        raise ValueError(f"JSON inválido: {e}") from e


def _load_historico() -> list[dict[str, Any]]:
    if not HISTORICO_FILE.exists():
        return []
    try:
        with HISTORICO_FILE.open("r", encoding="utf-8") as f:
            data = json.load(f)
        return data if isinstance(data, list) else []
    except Exception:
        # Se o arquivo estiver corrompido, não derruba o servidor.
        return []


def _save_historico(historico: list[dict[str, Any]]) -> None:
    with HISTORICO_FILE.open("w", encoding="utf-8") as f:
        json.dump(historico, f, indent=2, ensure_ascii=False)


def _jogo_duplicado(historico: list[dict[str, Any]], novo: dict[str, Any]) -> bool:
    """
    Evita duplicar jogo não conferido para o mesmo concurso (ou mesma data se concurso não existir).
    """
    numero_concurso = novo.get("numero_concurso")
    data_sorteio = novo.get("data_sorteio")

    for registro in historico:
        if registro.get("conferido", False):
            continue
        if numero_concurso and registro.get("numero_concurso") == numero_concurso:
            return True
        if not numero_concurso and data_sorteio and registro.get("data_sorteio") == data_sorteio:
            return True
    return False


def _ddmmyyyy_to_iso(date_str: str) -> str | None:
    m = re.match(r"^\s*(\d{2})/(\d{2})/(\d{4})\s*$", date_str or "")
    if not m:
        return None
    dd, mm, yyyy = m.groups()
    try:
        return datetime(int(yyyy), int(mm), int(dd)).strftime("%Y-%m-%d")
    except ValueError:
        return None


def _calcular_proximo_sorteio_manual() -> dict[str, Any]:
    """
    Mega-Sena: Terça(1), Quinta(3), Sábado(5). Considera "próximo" se ainda não passou 19h.
    Retorna payload já no formato esperado pelo frontend:
      - numero_concurso (pode ser None)
      - data_sorteio_iso (YYYY-MM-DD)
    """
    now = datetime.now()
    weekday = now.weekday()  # 0=Seg ... 6=Dom
    dias_sorteio = {1, 3, 5}

    if weekday in dias_sorteio and now.hour < 19:
        return {"numero_concurso": None, "data_sorteio_iso": now.strftime("%Y-%m-%d")}

    for i in range(1, 8):
        wd = (weekday + i) % 7
        if wd in dias_sorteio:
            dt = now + timedelta(days=i)
            return {"numero_concurso": None, "data_sorteio_iso": dt.strftime("%Y-%m-%d")}

    # Fallback (não deveria acontecer)
    return {"numero_concurso": None, "data_sorteio_iso": now.strftime("%Y-%m-%d")}


def _buscar_proximo_concurso() -> dict[str, Any]:
    """
    Consulta a API oficial e devolve o que o HTML espera.
    """
    req = urllib.request.Request(
        API_URL_OFICIAL,
        headers={
            "Accept": "application/json",
            # Alguns endpoints da Caixa exigem User-Agent
            "User-Agent": "Mozilla/5.0 (compatible; MegaEmailServer/1.0)",
        },
        method="GET",
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            raw = resp.read()
        data = json.loads(raw.decode("utf-8"))

        numero = data.get("numeroConcursoProximo")
        data_proximo = data.get("dataProximoConcurso")  # "dd/mm/aaaa"

        try:
            numero_int = int(numero) if numero is not None else None
        except (TypeError, ValueError):
            numero_int = None

        iso = _ddmmyyyy_to_iso(str(data_proximo or "")) if data_proximo else None
        if iso:
            return {"numero_concurso": numero_int, "data_sorteio_iso": iso}
    except Exception:
        pass

    return _calcular_proximo_sorteio_manual()


class Handler(BaseHTTPRequestHandler):
    server_version = "MegaEmailServer/1.0"

    def log_message(self, fmt: str, *args: Any) -> None:
        # Log simples no stdout
        sys.stdout.write("%s - - [%s] %s\n" % (self.client_address[0], self.log_date_time_string(), fmt % args))

    def do_GET(self) -> None:  # noqa: N802
        if self.path in ("/", ""):
            self.send_response(302)
            self.send_header("Location", "/admin_jogos.html")
            self.end_headers()
            return

        if self.path == "/api/proximo-concurso":
            _json_response(self, 200, _buscar_proximo_concurso())
            return

        if self.path == "/historico_jogos.json":
            _json_response(self, 200, _load_historico())
            return

        # Arquivos estáticos no diretório
        rel = self.path.lstrip("/")
        file_path = (BASE_DIR / rel).resolve()
        if not str(file_path).startswith(str(BASE_DIR)) or not file_path.exists() or not file_path.is_file():
            _json_response(self, 404, {"error": "Not found"})
            return

        ctype, _ = mimetypes.guess_type(str(file_path))
        if not ctype:
            ctype = "application/octet-stream"
        data = file_path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_POST(self) -> None:  # noqa: N802
        if self.path == "/salvar_jogo_personalizado":
            try:
                payload = _read_json_body(self)
                if not isinstance(payload, dict):
                    raise ValueError("Payload deve ser um objeto JSON.")

                historico = _load_historico()
                if _jogo_duplicado(historico, payload):
                    _json_response(
                        self,
                        409,
                        {"success": False, "error": "Já existe um jogo não conferido para este concurso/data."},
                    )
                    return

                historico.append(payload)
                _save_historico(historico)
                _json_response(self, 200, {"success": True})
            except ValueError as e:
                _json_response(self, 400, {"success": False, "error": str(e)})
            except Exception as e:
                _json_response(self, 500, {"success": False, "error": f"Erro interno: {e}"})
            return

        # A tela de gerenciamento tenta "POST em salvar_jogos.py"
        if self.path == "/salvar_jogos.py":
            try:
                payload = _read_json_body(self)
                if not isinstance(payload, list):
                    raise ValueError("Payload deve ser uma lista JSON (histórico completo).")
                _save_historico(payload)
                _json_response(self, 200, {"success": True})
            except ValueError as e:
                _json_response(self, 400, {"success": False, "error": str(e)})
            except Exception as e:
                _json_response(self, 500, {"success": False, "error": f"Erro interno: {e}"})
            return

        _json_response(self, 404, {"success": False, "error": "Not found"})


def main() -> None:
    port = int(os.getenv("PORT", "8000"))
    host = os.getenv("HOST", "0.0.0.0")
    httpd = ThreadingHTTPServer((host, port), Handler)
    print(f"✅ Servindo Mega-Email em http://{host}:{port} (pasta: {BASE_DIR})")
    print("   Abra /admin_jogos.html (ou /gerenciar_jogos.html).")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()

