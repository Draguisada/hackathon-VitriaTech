import psycopg2
from datetime import datetime, date, timedelta
import random
import bcrypt

# Configurações de conexão com o banco de dados
DB_CONFIG = {
    'host': 'localhost',
    'database': 'vitria_db',  # Ajuste conforme seu banco
    'user': 'postgres',  # Ajuste conforme seu usuário
    'password': 'garfo'  # Ajuste conforme sua senha
}

def conectar_banco():
    """Conecta ao banco de dados PostgreSQL"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except psycopg2.Error as e:
        print(f"Erro ao conectar ao banco: {e}")
        return None

def criar_tabelas():
    """Cria as tabelas do banco de dados executando o script SQL"""
    conn = conectar_banco()
    if not conn:
        return False
    
    try:
        cursor = conn.cursor()
        
        # Verifica se as tabelas já existem
        cursor.execute("""
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('postos_saude', 'medicamentos', 'transacoes_postos')
        """)
        tabelas_existentes = [row[0] for row in cursor.fetchall()]
        
        if len(tabelas_existentes) == 3:
            print("Tabelas já existem, pulando criação...")
            return True
        
        # Lê o arquivo SQL
        with open('data/database.sql', 'r', encoding='utf-8') as file:
            sql_script = file.read()
        
        # Executa o script SQL
        cursor.execute(sql_script)
        conn.commit()
        print("Tabelas criadas com sucesso!")
        return True
        
    except psycopg2.Error as e:
        if "já existe" in str(e) or "already exists" in str(e):
            print("Tabelas já existem, continuando...")
            return True
        print(f"Erro ao criar tabelas: {e}")
        conn.rollback()
        return False
    except FileNotFoundError:
        print("Arquivo database.sql não encontrado!")
        return False
    finally:
        cursor.close()
        conn.close()

def inserir_postos_saude():
    """Insere dados fictícios na tabela postos_saude"""
    postos = [
        {
            'nome_posto': 'Posto de Saúde Central',
            'cnpj_posto': '12345678000195',
            'endereco_posto': 'Rua das Flores, 123 - Centro',
            'telefone_posto': '(11) 99999-1111',
            'email_posto': 'central@postosaude.com',
            'senha_posto': 'senha123',
            'responsavel_posto': 'Dr. João Silva',
            'tipo_usuario': 'FARMACEUTICO'
        },
        {
            'nome_posto': 'UBS Vila Nova',
            'cnpj_posto': '98765432000123',
            'endereco_posto': 'Av. Principal, 456 - Vila Nova',
            'telefone_posto': '(11) 99999-2222',
            'email_posto': 'vilanova@postosaude.com',
            'senha_posto': 'senha456',
            'responsavel_posto': 'Dra. Maria Santos',
            'tipo_usuario': 'FARMACEUTICO'
        },
        {
            'nome_posto': 'Posto Saúde Jardim',
            'cnpj_posto': '11111111000111',
            'endereco_posto': 'Rua do Jardim, 789 - Jardim das Flores',
            'telefone_posto': '(11) 99999-3333',
            'email_posto': 'jardim@postosaude.com',
            'senha_posto': 'senha789',
            'responsavel_posto': 'Dr. Pedro Costa',
            'tipo_usuario': 'FARMACEUTICO'
        },
        {
            'nome_posto': 'UBS Bairro Alto',
            'cnpj_posto': '22222222000222',
            'endereco_posto': 'Rua Alta, 321 - Bairro Alto',
            'telefone_posto': '(11) 99999-4444',
            'email_posto': 'bairroalto@postosaude.com',
            'senha_posto': 'senha321',
            'responsavel_posto': 'Dra. Ana Oliveira',
            'tipo_usuario': 'FARMACEUTICO'
        },
        {
            'nome_posto': 'Posto Saúde Popular',
            'cnpj_posto': '33333333000333',
            'endereco_posto': 'Av. Popular, 654 - Centro Popular',
            'telefone_posto': '(11) 99999-5555',
            'email_posto': 'popular@postosaude.com',
            'senha_posto': 'senha654',
            'responsavel_posto': 'Dr. Carlos Mendes',
            'tipo_usuario': 'FARMACEUTICO'
        }
    ]
    
    conn = conectar_banco()
    if not conn:
        return
    
    try:
        cursor = conn.cursor()
        
        for posto in postos:
            # Hash da senha
            senha_hash = bcrypt.hashpw(posto['senha_posto'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            
            cursor.execute("""
                INSERT INTO postos_saude 
                (nome_posto, cnpj_posto, endereco_posto, telefone_posto, 
                 email_posto, senha_posto, responsavel_posto, tipo_usuario)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                posto['nome_posto'],
                posto['cnpj_posto'],
                posto['endereco_posto'],
                posto['telefone_posto'],
                posto['email_posto'],
                senha_hash,
                posto['responsavel_posto'],
                posto['tipo_usuario']
            ))
        
        conn.commit()
        print(f"Inseridos {len(postos)} postos de saúde com sucesso!")
        
    except psycopg2.Error as e:
        print(f"Erro ao inserir postos de saúde: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

def inserir_medicamentos():
    """Insere dados fictícios na tabela medicamentos"""
    medicamentos = [
        # Medicamentos para o Posto 1 (Posto de Saúde Central)
        {'nome_medicamento': 'Paracetamol 500mg', 'data_validade': date(2025, 6, 15), 'falta': False, 'quantidade': 150, 'id_posto': 1},
        {'nome_medicamento': 'Ibuprofeno 400mg', 'data_validade': date(2025, 8, 20), 'falta': False, 'quantidade': 80, 'id_posto': 1},
        {'nome_medicamento': 'Dipirona 500mg', 'data_validade': date(2025, 4, 10), 'falta': True, 'quantidade': 0, 'id_posto': 1},
        {'nome_medicamento': 'Omeprazol 20mg', 'data_validade': date(2025, 12, 5), 'falta': False, 'quantidade': 200, 'id_posto': 1},
        
        # Medicamentos para o Posto 2 (UBS Vila Nova)
        {'nome_medicamento': 'Paracetamol 500mg', 'data_validade': date(2025, 7, 18), 'falta': False, 'quantidade': 120, 'id_posto': 2},
        {'nome_medicamento': 'Losartana 50mg', 'data_validade': date(2025, 9, 25), 'falta': False, 'quantidade': 90, 'id_posto': 2},
        {'nome_medicamento': 'Metformina 850mg', 'data_validade': date(2025, 5, 12), 'falta': True, 'quantidade': 0, 'id_posto': 2},
        {'nome_medicamento': 'Atenolol 50mg', 'data_validade': date(2025, 11, 8), 'falta': False, 'quantidade': 75, 'id_posto': 2},
        
        # Medicamentos para o Posto 3 (Posto Saúde Jardim)
        {'nome_medicamento': 'Ibuprofeno 400mg', 'data_validade': date(2025, 6, 30), 'falta': False, 'quantidade': 100, 'id_posto': 3},
        {'nome_medicamento': 'Dipirona 500mg', 'data_validade': date(2025, 8, 15), 'falta': False, 'quantidade': 180, 'id_posto': 3},
        {'nome_medicamento': 'Sinvastatina 20mg', 'data_validade': date(2025, 3, 22), 'falta': True, 'quantidade': 0, 'id_posto': 3},
        {'nome_medicamento': 'Captopril 25mg', 'data_validade': date(2025, 10, 14), 'falta': False, 'quantidade': 110, 'id_posto': 3},
        
        # Medicamentos para o Posto 4 (UBS Bairro Alto)
        {'nome_medicamento': 'Omeprazol 20mg', 'data_validade': date(2025, 7, 28), 'falta': False, 'quantidade': 160, 'id_posto': 4},
        {'nome_medicamento': 'Losartana 50mg', 'data_validade': date(2025, 9, 10), 'falta': False, 'quantidade': 95, 'id_posto': 4},
        {'nome_medicamento': 'Paracetamol 500mg', 'data_validade': date(2025, 4, 5), 'falta': True, 'quantidade': 0, 'id_posto': 4},
        {'nome_medicamento': 'Hidroclorotiazida 25mg', 'data_validade': date(2025, 12, 18), 'falta': False, 'quantidade': 85, 'id_posto': 4},
        
        # Medicamentos para o Posto 5 (Posto Saúde Popular)
        {'nome_medicamento': 'Metformina 850mg', 'data_validade': date(2025, 8, 12), 'falta': False, 'quantidade': 140, 'id_posto': 5},
        {'nome_medicamento': 'Atenolol 50mg', 'data_validade': date(2025, 6, 25), 'falta': False, 'quantidade': 70, 'id_posto': 5},
        {'nome_medicamento': 'Ibuprofeno 400mg', 'data_validade': date(2025, 5, 8), 'falta': True, 'quantidade': 0, 'id_posto': 5},
        {'nome_medicamento': 'Enalapril 10mg', 'data_validade': date(2025, 11, 30), 'falta': False, 'quantidade': 125, 'id_posto': 5}
    ]
    
    conn = conectar_banco()
    if not conn:
        return
    
    try:
        cursor = conn.cursor()
        
        for medicamento in medicamentos:
            cursor.execute("""
                INSERT INTO medicamentos 
                (nome_medicamento, data_validade, falta, quantidade, id_posto)
                VALUES (%s, %s, %s, %s, %s)
            """, (
                medicamento['nome_medicamento'],
                medicamento['data_validade'],
                medicamento['falta'],
                medicamento['quantidade'],
                medicamento['id_posto']
            ))
        
        conn.commit()
        print(f"Inseridos {len(medicamentos)} medicamentos com sucesso!")
        
    except psycopg2.Error as e:
        print(f"Erro ao inserir medicamentos: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

def inserir_transacoes():
    """Insere dados fictícios na tabela transacoes_postos"""
    transacoes = [
        # Transações pendentes
        {'id_posto_fornecedor': 1, 'id_posto_receptor': 2, 'id_medicamento': 1, 'quantidade': 20, 'status_transacao': 'PENDENTE'},
        {'id_posto_fornecedor': 3, 'id_posto_receptor': 1, 'id_medicamento': 9, 'quantidade': 15, 'status_transacao': 'PENDENTE'},
        {'id_posto_fornecedor': 2, 'id_posto_receptor': 4, 'id_medicamento': 5, 'quantidade': 25, 'status_transacao': 'PENDENTE'},
        {'id_posto_fornecedor': 4, 'id_posto_receptor': 5, 'id_medicamento': 13, 'quantidade': 30, 'status_transacao': 'PENDENTE'},
        {'id_posto_fornecedor': 5, 'id_posto_receptor': 3, 'id_medicamento': 17, 'quantidade': 18, 'status_transacao': 'PENDENTE'},
        
        # Transações aprovadas
        {'id_posto_fornecedor': 1, 'id_posto_receptor': 3, 'id_medicamento': 2, 'quantidade': 12, 'status_transacao': 'APROVADA'},
        {'id_posto_fornecedor': 2, 'id_posto_receptor': 1, 'id_medicamento': 6, 'quantidade': 8, 'status_transacao': 'APROVADA'},
        {'id_posto_fornecedor': 3, 'id_posto_receptor': 4, 'id_medicamento': 10, 'quantidade': 22, 'status_transacao': 'APROVADA'},
        
        # Transações rejeitadas
        {'id_posto_fornecedor': 4, 'id_posto_receptor': 2, 'id_medicamento': 14, 'quantidade': 35, 'status_transacao': 'REJEITADA'},
        {'id_posto_fornecedor': 5, 'id_posto_receptor': 1, 'id_medicamento': 18, 'quantidade': 40, 'status_transacao': 'REJEITADA'},
        
        # Transações concluídas
        {'id_posto_fornecedor': 1, 'id_posto_receptor': 5, 'id_medicamento': 4, 'quantidade': 16, 'status_transacao': 'CONCLUIDA'},
        {'id_posto_fornecedor': 2, 'id_posto_receptor': 3, 'id_medicamento': 7, 'quantidade': 14, 'status_transacao': 'CONCLUIDA'},
        {'id_posto_fornecedor': 3, 'id_posto_receptor': 2, 'id_medicamento': 11, 'quantidade': 20, 'status_transacao': 'CONCLUIDA'}
    ]
    
    conn = conectar_banco()
    if not conn:
        return
    
    try:
        cursor = conn.cursor()
        
        for transacao in transacoes:
            cursor.execute("""
                INSERT INTO transacoes_postos 
                (id_posto_fornecedor, id_posto_receptor, id_medicamento, quantidade, status_transacao)
                VALUES (%s, %s, %s, %s, %s)
            """, (
                transacao['id_posto_fornecedor'],
                transacao['id_posto_receptor'],
                transacao['id_medicamento'],
                transacao['quantidade'],
                transacao['status_transacao']
            ))
        
        conn.commit()
        print(f"Inseridas {len(transacoes)} transações com sucesso!")
        
    except psycopg2.Error as e:
        print(f"Erro ao inserir transações: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

def limpar_dados():
    """Remove todos os dados das tabelas (para testes)"""
    conn = conectar_banco()
    if not conn:
        return
    
    try:
        cursor = conn.cursor()
        
        # Verifica se as tabelas existem antes de tentar deletar
        cursor.execute("""
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('transacoes_postos', 'medicamentos', 'postos_saude')
        """)
        tabelas_existentes = [row[0] for row in cursor.fetchall()]
        
        if not tabelas_existentes:
            print("Nenhuma tabela encontrada para limpar.")
            return
        
        # Remove em ordem para respeitar as foreign keys
        if 'transacoes_postos' in tabelas_existentes:
            cursor.execute("DELETE FROM transacoes_postos")
        if 'medicamentos' in tabelas_existentes:
            cursor.execute("DELETE FROM medicamentos")
        if 'postos_saude' in tabelas_existentes:
            cursor.execute("DELETE FROM postos_saude")
        
        # Reinicia as sequências
        cursor.execute("ALTER SEQUENCE postos_saude_id_posto_seq RESTART WITH 1")
        cursor.execute("ALTER SEQUENCE medicamentos_id_medicamento_seq RESTART WITH 1")
        cursor.execute("ALTER SEQUENCE transacoes_postos_id_transacao_seq RESTART WITH 1")
        
        conn.commit()
        print("Dados removidos com sucesso!")
        
    except psycopg2.Error as e:
        print(f"Erro ao limpar dados: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

def popular_banco():
    """Função principal para popular o banco com dados de teste"""
    print("Iniciando população do banco de dados...")
    
    # Primeiro cria as tabelas se não existirem
    print("Criando tabelas...")
    if not criar_tabelas():
        print("Erro ao criar tabelas. Verifique se o arquivo database.sql existe.")
        return
    
    # Limpa dados existentes
    limpar_dados()
    
    # Insere dados nas tabelas
    inserir_postos_saude()
    inserir_medicamentos()
    inserir_transacoes()
    
    print("Banco de dados populado com sucesso!")

if __name__ == "__main__":
    # Para executar o script diretamente
    popular_banco()
