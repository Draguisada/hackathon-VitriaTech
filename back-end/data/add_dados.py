import os
import psycopg2 as psql
from dotenv import load_dotenv
import hashlib

load_dotenv()

connect = psql.connect(
    host=os.getenv("DB_HOST"),
    database="vitria_db",
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    port=os.getenv("DB_PORT")
)

cursor = connect.cursor()

# Função para hash da senha
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# ========== POSTOS DE SAÚDE ==========
postos_saude = [
    ("Posto Central", "12345678000195", "Rua das Flores, 123", "(11) 99999-9999", "joao@postocentral.com", "123456", "João Silva", "FARMACEUTICO"),
    ("UBS Vila Nova", "98765432000123", "Av. Principal, 456", "(11) 88888-8888", "maria@ubsnovavila.com", "123456", "Maria Santos", "FARMACEUTICO"),
    ("Posto São José", "11111111000111", "Rua da Saúde, 789", "(11) 77777-7777", "pedro@postosaojose.com", "123456", "Pedro Costa", "FARMACEUTICO"),
    ("UBS Centro", "22222222000222", "Praça Central, 321", "(11) 66666-6666", "ana@ubscentro.com", "123456", "Ana Lima", "FARMACEUTICO"),
    ("Posto Esperança", "33333333000333", "Rua da Esperança, 654", "(11) 55555-5555", "carlos@postoesperanca.com", "123456", "Carlos Oliveira", "FARMACEUTICO"),
    ("Admin Sistema", "44444444000444", "Rua Admin, 999", "(11) 44444-4444", "admin@sistema.com", "admin123", "Admin Sistema", "ADMIN"),
]

for posto in postos_saude:
    senha_hash = hash_password(posto[5])
    cursor.execute("""
        INSERT INTO postos_saude (nome_posto, cnpj_posto, endereco_posto, telefone_posto, email_posto, senha_posto, responsavel_posto, tipo_usuario)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (cnpj_posto, email_posto) DO NOTHING;
    """, (posto[0], posto[1], posto[2], posto[3], posto[4], senha_hash, posto[6], posto[7]))

# ========== CATEGORIAS DE MEDICAMENTOS ==========
categorias_medicamentos = [
    "Analgésicos",
    "Antibióticos", 
    "Anti-inflamatórios",
    "Antitérmicos",
    "Antialérgicos",
    "Vitaminas",
    "Medicamentos para Pressão",
    "Medicamentos para Diabetes"
]

for categoria in categorias_medicamentos:
    cursor.execute("""
        INSERT INTO categorias_medicamentos (nome_categoria)
        VALUES (%s)
        ON CONFLICT DO NOTHING;
    """, (categoria,))

# ========== MEDICAMENTOS ==========
from datetime import datetime, timedelta

medicamentos = [
    # Analgésicos
    ("Paracetamol 500mg", 1, "2025-12-31"),
    ("Dipirona 500mg", 1, "2025-06-30"),
    ("Tramadol 50mg", 1, "2025-09-15"),
    
    # Antibióticos
    ("Amoxicilina 500mg", 2, "2025-03-20"),
    ("Azitromicina 500mg", 2, "2025-08-10"),
    ("Ciprofloxacino 500mg", 2, "2025-11-25"),
    
    # Anti-inflamatórios
    ("Ibuprofeno 600mg", 3, "2025-07-18"),
    ("Diclofenaco 50mg", 3, "2025-05-12"),
    ("Nimesulida 100mg", 3, "2025-10-08"),
    
    # Antitérmicos
    ("Paracetamol 750mg", 4, "2025-12-31"),
    ("Dipirona 1g", 4, "2025-06-30"),
    
    # Antialérgicos
    ("Loratadina 10mg", 5, "2025-04-15"),
    ("Cetirizina 10mg", 5, "2025-09-22"),
    ("Fexofenadina 120mg", 5, "2025-11-30"),
    
    # Vitaminas
    ("Vitamina D3 2000UI", 6, "2025-12-31"),
    ("Vitamina C 1g", 6, "2025-08-15"),
    ("Complexo B", 6, "2025-10-20"),
    
    # Medicamentos para Pressão
    ("Losartana 50mg", 7, "2025-07-05"),
    ("Enalapril 10mg", 7, "2025-09-18"),
    ("Amlodipina 5mg", 7, "2025-11-12"),
    
    # Medicamentos para Diabetes
    ("Metformina 850mg", 8, "2025-06-25"),
    ("Gliclazida 80mg", 8, "2025-08-30"),
    ("Insulina NPH", 8, "2025-05-10"),
]

for medicamento in medicamentos:
    cursor.execute("""
        INSERT INTO medicamentos (nome_medicamento, id_categoria, data_validade)
        VALUES (%s, %s, %s)
        ON CONFLICT DO NOTHING;
    """, medicamento)

# ========== ESTOQUE NOS POSTOS ==========
estoque_postos = [
    # Posto Central (id=1)
    (1, 1, 100),   # Paracetamol 500mg
    (1, 2, 80),    # Dipirona 500mg
    (1, 4, 50),    # Amoxicilina 500mg
    (1, 7, 60),    # Ibuprofeno 600mg
    (1, 11, 30),   # Loratadina 10mg
    (1, 14, 40),   # Vitamina D3
    (1, 17, 25),   # Losartana 50mg
    (1, 20, 35),   # Metformina 850mg
    
    # UBS Vila Nova (id=2)
    (2, 1, 20),    # Paracetamol 500mg (pouco estoque)
    (2, 3, 45),    # Tramadol 50mg
    (2, 5, 30),    # Azitromicina 500mg
    (2, 8, 55),    # Diclofenaco 50mg
    (2, 12, 25),   # Cetirizina 10mg
    (2, 15, 60),   # Vitamina C 1g
    (2, 18, 40),   # Enalapril 10mg
    (2, 21, 20),   # Gliclazida 80mg
    
    # Posto São José (id=3)
    (3, 2, 70),    # Dipirona 500mg
    (3, 6, 25),    # Ciprofloxacino 500mg
    (3, 9, 40),    # Nimesulida 100mg
    (3, 10, 35),   # Paracetamol 750mg
    (3, 13, 50),   # Fexofenadina 120mg
    (3, 16, 30),   # Complexo B
    (3, 19, 45),   # Amlodipina 5mg
    (3, 22, 15),   # Insulina NPH
    
    # UBS Centro (id=4)
    (4, 1, 5),     # Paracetamol 500mg (estoque crítico)
    (4, 4, 15),    # Amoxicilina 500mg (estoque baixo)
    (4, 7, 8),     # Ibuprofeno 600mg (estoque baixo)
    (4, 11, 20),   # Loratadina 10mg
    (4, 14, 25),   # Vitamina D3
    (4, 17, 10),   # Losartana 50mg (estoque baixo)
    (4, 20, 12),   # Metformina 850mg (estoque baixo)
    
    # Posto Esperança (id=5)
    (5, 2, 90),    # Dipirona 500mg (sobra)
    (5, 5, 80),    # Azitromicina 500mg (sobra)
    (5, 8, 70),    # Diclofenaco 50mg (sobra)
    (5, 12, 60),   # Cetirizina 10mg (sobra)
    (5, 15, 85),   # Vitamina C 1g (sobra)
    (5, 18, 75),   # Enalapril 10mg (sobra)
]

for estoque in estoque_postos:
    cursor.execute("""
        INSERT INTO estoque_postos (id_posto, id_medicamento, quantidade)
        VALUES (%s, %s, %s)
        ON CONFLICT DO NOTHING;
    """, estoque)

# ========== TRANSAÇÕES ENTRE POSTOS ==========
transacoes_postos = [
    # Posto Esperança (sobra) -> UBS Centro (falta)
    (5, 4, 1, 20, "PENDENTE"),   # Paracetamol 500mg
    (5, 4, 4, 15, "PENDENTE"),   # Amoxicilina 500mg
    (5, 4, 7, 10, "PENDENTE"),   # Ibuprofeno 600mg
    
    # Posto Central (sobra) -> UBS Vila Nova (falta)
    (1, 2, 1, 30, "APROVADA"),   # Paracetamol 500mg
    
    # Posto São José -> UBS Centro
    (3, 4, 2, 25, "CONCLUIDA"),  # Dipirona 500mg
    (3, 4, 9, 20, "CONCLUIDA"),  # Nimesulida 100mg
]

for transacao in transacoes_postos:
    cursor.execute("""
        INSERT INTO transacoes_postos (id_posto_fornecedor, id_posto_receptor, id_medicamento, quantidade, status_transacao)
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT DO NOTHING;
    """, transacao)


connect.commit()
cursor.close()
connect.close()

print("✅ Dados de exemplo adicionados com sucesso!")
print("📋 Postos de saúde: 6")
print("💊 Categorias: 8")
print("💉 Medicamentos: 22")
print("📦 Estoque: 30 registros")
print("🔄 Transações: 6")
print("\n🎯 Cenário criado:")
print("- Posto Central: Estoque normal")
print("- UBS Vila Nova: Estoque baixo em alguns medicamentos")
print("- Posto São José: Estoque normal")
print("- UBS Centro: Estoque crítico (precisa de ajuda)")
print("- Posto Esperança: Estoque com sobra (pode ajudar outros)")
print("- Admin Sistema: Conta administrativa")
print("\n🔐 Postos de teste:")
print("- joao@postocentral.com / 123456")
print("- maria@ubsnovavila.com / 123456")
print("- admin@sistema.com / admin123")