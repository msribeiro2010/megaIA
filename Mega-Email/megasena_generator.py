"""
Gerador de Números da Mega-Sena com envio por e-mail.
Executa antes dos sorteios (Terça, Quinta e Sábado às 21h).
Gera jogos um dia antes ou no mesmo dia até 19h.
"""

import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
import os
import json
from pathlib import Path
import requests
from dotenv import load_dotenv

load_dotenv()

# Arquivo para armazenar histórico de jogos
HISTORICO_FILE = Path(__file__).parent / "historico_jogos.json"

# API da Mega-Sena
API_URL_OFICIAL = "https://servicebus2.caixa.gov.br/portaldeloterias/api/megasena/"
API_URL = "https://loteriascaixa-api.herokuapp.com/api/megasena/latest"


def gerar_numeros_megasena():
    """Gera 6 números únicos de 1 a 60 para a Mega-Sena."""
    numeros = random.sample(range(1, 61), 6)
    return sorted(numeros)


def gerar_cartoes(quantidade=3):
    """Gera múltiplos cartões da Mega-Sena."""
    return [gerar_numeros_megasena() for _ in range(quantidade)]


def formatar_numeros(numeros):
    """Formata os números para exibição."""
    return " - ".join(f"{n:02d}" for n in numeros)


def calcular_proximo_sorteio():
    """Calcula data e número do próximo sorteio baseado na API."""
    try:
        response = requests.get(API_URL_OFICIAL, timeout=10)
        response.raise_for_status()
        resultado = response.json()

        proximo_concurso = resultado.get("numeroConcursoProximo")
        data_proximo = resultado.get("dataProximoConcurso")
        ultimo_concurso = resultado.get("numero")

        try:
            proximo_concurso = int(proximo_concurso) if proximo_concurso is not None else None
        except (TypeError, ValueError):
            proximo_concurso = None

        try:
            ultimo_concurso = int(ultimo_concurso) if ultimo_concurso is not None else None
        except (TypeError, ValueError):
            ultimo_concurso = None

        if data_proximo:
            return {
                "numero": proximo_concurso,
                "data": data_proximo,
                "ultimo_concurso": ultimo_concurso
            }
    except Exception as e:
        print(f"⚠️ Não foi possível buscar próximo concurso na API oficial: {e}")

    try:
        response = requests.get(API_URL, timeout=10)
        response.raise_for_status()
        resultado = response.json()

        # Dados do último sorteio
        ultimo_concurso = resultado.get("concurso")
        proximo_concurso = resultado.get("proximoConcurso")
        data_proximo = resultado.get("dataProximoConcurso")

        return {
            "numero": proximo_concurso,
            "data": data_proximo,
            "ultimo_concurso": ultimo_concurso
        }
    except Exception as e:
        print(f"⚠️ Não foi possível buscar próximo concurso: {e}")
        # Fallback: calcular manualmente
        return calcular_proximo_sorteio_manual()


def calcular_proximo_sorteio_manual():
    """Calcula próximo sorteio manualmente (Terça=1, Quinta=3, Sábado=5)."""
    hoje = datetime.now()
    dia_semana = hoje.weekday()  # 0=Segunda, 1=Terça, 2=Quarta, 3=Quinta, 4=Sexta, 5=Sábado, 6=Domingo

    # Dias de sorteio: Terça(1), Quinta(3), Sábado(5)
    dias_sorteio = [1, 3, 5]

    # Se ainda não passou das 19h do dia de sorteio, é para hoje
    if dia_semana in dias_sorteio and hoje.hour < 19:
        return {
            "numero": None,
            "data": hoje.strftime("%d/%m/%Y"),
            "ultimo_concurso": None
        }

    # Calcular próximo dia de sorteio
    for i in range(1, 8):
        proximo_dia = (dia_semana + i) % 7
        if proximo_dia in dias_sorteio:
            data_sorteio = hoje + timedelta(days=i)
            return {
                "numero": None,
                "data": data_sorteio.strftime("%d/%m/%Y"),
                "ultimo_concurso": None
            }

    return None


def verificar_jogo_existente(info_sorteio):
    """Verifica se já existe um jogo não conferido para o mesmo concurso."""
    if not HISTORICO_FILE.exists():
        return False
    
    try:
        with open(HISTORICO_FILE, 'r', encoding='utf-8') as f:
            historico = json.load(f)
        
        # Verificar se já existe jogo não conferido para o mesmo concurso
        numero_concurso = info_sorteio.get("numero")
        data_sorteio = info_sorteio.get("data")
        
        for registro in historico:
            # Verificar por número de concurso (mais preciso)
            if numero_concurso and registro.get("numero_concurso") == numero_concurso:
                if not registro.get("conferido", False):
                    return True
            
            # Verificar por data de sorteio (fallback se não tiver número)
            if not numero_concurso and registro.get("data_sorteio") == data_sorteio:
                if not registro.get("conferido", False):
                    return True
        
        return False
    except Exception as e:
        print(f"⚠️ Erro ao verificar histórico: {e}")
        return False


def salvar_jogos(cartoes, info_sorteio):
    """Salva os jogos no histórico para conferência posterior."""
    data_hoje = datetime.now().strftime('%Y-%m-%d')

    # Carregar histórico existente
    historico = []
    if HISTORICO_FILE.exists():
        with open(HISTORICO_FILE, 'r', encoding='utf-8') as f:
            historico = json.load(f)

    # Adicionar novos jogos
    novo_registro = {
        "data_envio": data_hoje,
        "data_envio_formatada": datetime.now().strftime('%d/%m/%Y'),
        "data_sorteio": info_sorteio["data"],
        "numero_concurso": info_sorteio["numero"],
        "cartoes": cartoes,
        "conferido": False
    }

    historico.append(novo_registro)

    # Salvar histórico atualizado
    with open(HISTORICO_FILE, 'w', encoding='utf-8') as f:
        json.dump(historico, f, indent=2, ensure_ascii=False)

    print(f"💾 Jogos salvos no histórico: {HISTORICO_FILE}")
    if info_sorteio["numero"]:
        print(f"   Para o concurso {info_sorteio['numero']} - {info_sorteio['data']}")


def enviar_email(cartoes, info_sorteio):
    """Envia os cartões gerados por e-mail."""

    # Configurações do e-mail (via variáveis de ambiente)
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    email_remetente = os.getenv("EMAIL_REMETENTE")
    email_senha = os.getenv("EMAIL_SENHA")
    email_destinatario = os.getenv("EMAIL_DESTINATARIO")

    if not all([email_remetente, email_senha, email_destinatario]):
        raise ValueError("Configure as variáveis de ambiente no arquivo .env")

    # Gerar HTML dos cartões
    cartoes_html = ""
    for i, numeros in enumerate(cartoes, 1):
        cartoes_html += f"""
        <div style="background-color: #209869; color: white; padding: 15px; border-radius: 10px; text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 10px;">
            <span style="font-size: 14px; display: block; margin-bottom: 5px;">Cartão {i}</span>
            {formatar_numeros(numeros)}
        </div>
        """

    # Informação do sorteio
    info_sorteio_html = ""
    if info_sorteio["numero"]:
        info_sorteio_html = f"""
        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
            <h3 style="color: #209869; margin: 0 0 10px 0;">🎰 Concurso {info_sorteio['numero']}</h3>
            <p style="margin: 0; color: #666;">Sorteio em: <strong>{info_sorteio['data']} às 21h</strong></p>
        </div>
        """
    else:
        info_sorteio_html = f"""
        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
            <p style="margin: 0; color: #666;">Próximo sorteio: <strong>{info_sorteio['data']} às 21h</strong></p>
        </div>
        """

    # Criar mensagem
    msg = MIMEMultipart()
    msg["From"] = email_remetente
    msg["To"] = email_destinatario

    if info_sorteio["numero"]:
        msg["Subject"] = f"🍀 Mega-Sena {info_sorteio['numero']} - Seus Jogos ({info_sorteio['data']})"
    else:
        msg["Subject"] = f"🍀 Seus 3 Cartões da Mega-Sena - Sorteio {info_sorteio['data']}"
    
    corpo = f"""
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #209869;">🍀 Mega-Sena - Números da Sorte</h2>
        <p>Olá!</p>

        {info_sorteio_html}

        <p>Aqui estão seus <strong>3 cartões</strong> da Mega-Sena:</p>
        {cartoes_html}

        <div style="background-color: #fff3cd; padding: 12px; border-radius: 6px; margin-top: 20px; border-left: 4px solid #ffc107;">
            <p style="margin: 0; font-size: 13px; color: #856404;">
                ⏰ <strong>Lembre-se:</strong> Apostas podem ser feitas até as 19h do dia do sorteio!
            </p>
        </div>

        <p style="margin-top: 20px;">Boa sorte! 🤞</p>
        <hr>
        <p style="font-size: 12px; color: #666;">
            Gerado automaticamente em {datetime.now().strftime('%d/%m/%Y às %H:%M')}
        </p>
    </body>
    </html>
    """
    
    msg.attach(MIMEText(corpo, "html"))
    
    # Enviar e-mail
    try:
        with smtplib.SMTP(smtp_server, smtp_port, timeout=30) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(email_remetente, email_senha)
            server.send_message(msg)
    except smtplib.SMTPServerDisconnected:
        # Tentar com SSL direto (porta 465)
        with smtplib.SMTP_SSL(smtp_server, 465, timeout=30) as server:
            server.login(email_remetente, email_senha)
            server.send_message(msg)
    
    print(f"✅ E-mail enviado com sucesso!")
    for i, numeros in enumerate(cartoes, 1):
        print(f"   Cartão {i}: {formatar_numeros(numeros)}")


def main():
    """Função principal."""
    print("🎰 Verificando próximo sorteio da Mega-Sena...")
    info_sorteio = calcular_proximo_sorteio()

    if not info_sorteio:
        print("❌ Não foi possível determinar o próximo sorteio.")
        return

    print(f"\n📅 Próximo sorteio: {info_sorteio['data']}")
    if info_sorteio["numero"]:
        print(f"   Concurso: {info_sorteio['numero']}")

    # Verificar se já existe jogo para este concurso
    if verificar_jogo_existente(info_sorteio):
        numero_info = f"concurso {info_sorteio['numero']}" if info_sorteio.get("numero") else f"sorteio {info_sorteio['data']}"
        print(f"\n⏭️  Já existe um jogo gerado para o {numero_info}.")
        print("   Não será gerado um novo jogo para evitar duplicatas.")
        return

    print("\n🎲 Gerando cartões...")
    cartoes = gerar_cartoes(3)
    print("\nCartões gerados:")
    for i, numeros in enumerate(cartoes, 1):
        print(f"   Cartão {i}: {formatar_numeros(numeros)}")

    salvar_jogos(cartoes, info_sorteio)
    enviar_email(cartoes, info_sorteio)


if __name__ == "__main__":
    main()
