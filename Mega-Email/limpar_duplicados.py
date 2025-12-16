"""
Script para limpar jogos duplicados do histórico.
Mantém apenas o jogo mais recente de cada concurso não conferido.
"""

import json
from pathlib import Path
from datetime import datetime

HISTORICO_FILE = Path(__file__).parent / "historico_jogos.json"


def limpar_duplicados():
    """Remove jogos duplicados, mantendo apenas o mais recente de cada concurso não conferido."""
    if not HISTORICO_FILE.exists():
        print("❌ Arquivo de histórico não encontrado.")
        return
    
    # Carregar histórico
    with open(HISTORICO_FILE, 'r', encoding='utf-8') as f:
        historico = json.load(f)
    
    # Separar jogos conferidos e não conferidos
    jogos_conferidos = []
    jogos_nao_conferidos = {}
    
    for jogo in historico:
        if jogo.get("conferido", False):
            # Manter todos os jogos conferidos
            jogos_conferidos.append(jogo)
        else:
            # Para jogos não conferidos, manter apenas o mais recente por concurso
            numero_concurso = jogo.get("numero_concurso")
            data_sorteio = jogo.get("data_sorteio")
            
            # Usar número de concurso como chave (mais preciso)
            chave = f"concurso_{numero_concurso}" if numero_concurso else f"data_{data_sorteio}"
            
            if chave not in jogos_nao_conferidos:
                jogos_nao_conferidos[chave] = jogo
            else:
                # Comparar datas de envio para manter o mais recente
                data_atual = jogo.get("data_envio", "")
                data_existente = jogos_nao_conferidos[chave].get("data_envio", "")
                
                if data_atual > data_existente:
                    jogos_nao_conferidos[chave] = jogo
    
    # Combinar jogos conferidos e não conferidos únicos
    historico_limpo = jogos_conferidos + list(jogos_nao_conferidos.values())
    
    # Ordenar por data de envio (mais recente primeiro)
    historico_limpo.sort(key=lambda x: x.get("data_envio", ""), reverse=True)
    
    # Salvar histórico limpo
    with open(HISTORICO_FILE, 'w', encoding='utf-8') as f:
        json.dump(historico_limpo, f, indent=2, ensure_ascii=False)
    
    removidos = len(historico) - len(historico_limpo)
    print(f"✅ Limpeza concluída!")
    print(f"   Jogos antes: {len(historico)}")
    print(f"   Jogos depois: {len(historico_limpo)}")
    print(f"   Removidos: {removidos} duplicado(s)")


if __name__ == "__main__":
    print("🧹 Limpando jogos duplicados do histórico...")
    limpar_duplicados()

