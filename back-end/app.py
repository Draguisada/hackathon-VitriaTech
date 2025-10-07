from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2 as psql
from psycopg2.extras import RealDictCursor
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import os
from dotenv import load_dotenv
import hashlib
import jwt
from datetime import datetime, timedelta
from functools import wraps

load_dotenv()

connect = psql.connect(
    host=os.getenv("DB_HOST"),
    database=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    port=os.getenv("DB_PORT")
)

connect.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)

with connect.cursor() as cursor:
    cursor.execute("SELECT 1 FROM pg_database WHERE datname = %s", ('vitria_db',))
    dbExiste = cursor.fetchone()
    print(dbExiste)

if dbExiste:
    print(f"Banco de dados 'vitria_db' já existe. Aguarde enquanto o mesmo é configurado.")
    connect.close()

else:
    with connect.cursor() as cursor:
        cursor.execute("CREATE DATABASE vitria_db;")
        connect.commit()
        connect.close()
        print(f"Banco de dados 'vitria_db' criado com sucesso. Aguarde enquanto o mesmo é configurado.")
    connect.close()


    connect = psql.connect(
        host=os.getenv("DB_HOST"),
        database="vitria_db",
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        port=os.getenv("DB_PORT")
    )

    with open("./data/database.sql", "r", encoding="utf-8") as cmd:
        sql = cmd.read().split(';')

    with connect.cursor() as cursor:
        for command in sql:
            if command.strip():
                cursor.execute(command)
    connect.commit()


dadosExemplo = input("Deseja pré-preencher o banco de dados com dados de exemplo? (s/n): ").strip().lower()
if dadosExemplo == 'n':
    print("Banco de dados não foi pré-preenchido com dados de exemplo.")
else: 
    with open("./data/add_dados.py", "r", encoding="utf-8") as cmd:
        os.system(f"python {cmd.name}")


app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'sua_chave_secreta_aqui'  # Em produção, use uma chave mais segura

# Função para conectar ao banco
def get_db_connection():
    return psql.connect(
        host=os.getenv("DB_HOST"),
        database="vitria_db",
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        port=os.getenv("DB_PORT"),
        cursor_factory=RealDictCursor
    )

# Função para hash da senha
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# Função para gerar JWT token
def generate_token(posto_id, posto_email, posto_nome):
    payload = {
        'posto_id': posto_id,
        'posto_email': posto_email,
        'posto_nome': posto_nome,
        'exp': datetime.utcnow() + timedelta(hours=24)
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

# Decorator para verificar autenticação
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token não fornecido'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_posto = {
                'posto_id': data['posto_id'],
                'posto_email': data['posto_email'],
                'posto_nome': data['posto_nome']
            }
        except:
            return jsonify({'error': 'Token inválido'}), 401
        
        return f(current_posto, *args, **kwargs)
    return decorated

# ========== ROTAS DE AUTENTICAÇÃO ==========

@app.route("/api/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        
        # Verificar se o email ou CNPJ já existe
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id_posto FROM postos_saude WHERE email_posto = %s OR cnpj_posto = %s", 
                      (data['email_posto'], data['cnpj_posto']))
        if cursor.fetchone():
            conn.close()
            return jsonify({"error": "Email ou CNPJ já cadastrado"}), 400
        
        # Hash da senha
        senha_hash = hash_password(data['senha_posto'])
        
        # Inserir posto
        cursor.execute("""
            INSERT INTO postos_saude (nome_posto, cnpj_posto, endereco_posto, telefone_posto, email_posto, senha_posto, responsavel_posto, tipo_usuario)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id_posto, nome_posto, email_posto, responsavel_posto, tipo_usuario
        """, (data['nome_posto'], data['cnpj_posto'], data['endereco_posto'], data.get('telefone_posto'), 
              data['email_posto'], senha_hash, data['responsavel_posto'], data.get('tipo_usuario', 'FARMACEUTICO')))
        
        posto = cursor.fetchone()
        conn.commit()
        conn.close()
        
        # Gerar token
        token = generate_token(posto['id_posto'], posto['email_posto'], posto['nome_posto'])
        
        return jsonify({
            "message": "Posto cadastrado com sucesso",
            "token": token,
            "posto": dict(posto)
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Buscar posto
        cursor.execute("""
            SELECT * FROM postos_saude 
            WHERE email_posto = %s AND ativo = TRUE
        """, (data['email_posto'],))
        
        posto = cursor.fetchone()
        conn.close()
        
        if not posto:
            return jsonify({"error": "Posto não encontrado"}), 401
        
        # Verificar senha
        senha_hash = hash_password(data['senha_posto'])
        if posto['senha_posto'] != senha_hash:
            return jsonify({"error": "Senha incorreta"}), 401
        
        # Gerar token
        token = generate_token(posto['id_posto'], posto['email_posto'], posto['nome_posto'])
        
        return jsonify({
            "message": "Login realizado com sucesso",
            "token": token,
            "posto": {
                "id_posto": posto['id_posto'],
                "nome_posto": posto['nome_posto'],
                "email_posto": posto['email_posto'],
                "responsavel_posto": posto['responsavel_posto'],
                "tipo_usuario": posto['tipo_usuario']
            }
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/me", methods=["GET"])
@token_required
def get_current_posto(current_posto):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT * FROM postos_saude 
            WHERE id_posto = %s
        """, (current_posto['posto_id'],))
        
        posto = cursor.fetchone()
        conn.close()
        
        if not posto:
            return jsonify({"error": "Posto não encontrado"}), 404
        
        return jsonify({
            "id_posto": posto['id_posto'],
            "nome_posto": posto['nome_posto'],
            "email_posto": posto['email_posto'],
            "responsavel_posto": posto['responsavel_posto'],
            "tipo_usuario": posto['tipo_usuario']
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ========== ROTAS PARA POSTOS DE SAÚDE ==========

@app.route("/api/postos", methods=["GET"])
def get_postos():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM postos_saude ORDER BY id_posto")
        postos = cursor.fetchall()
        conn.close()
        return jsonify([dict(posto) for posto in postos])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Rota de criação de postos removida - postos são criados automaticamente no registro

# ========== ROTAS PARA CATEGORIAS ==========

@app.route("/api/categorias", methods=["GET"])
def get_categorias():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM categorias_medicamentos ORDER BY id_categoria")
        categorias = cursor.fetchall()
        conn.close()
        return jsonify([dict(categoria) for categoria in categorias])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/categorias", methods=["POST"])
def create_categoria():
    try:
        data = request.get_json()
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO categorias_medicamentos (nome_categoria) VALUES (%s) RETURNING *",
            (data['nome_categoria'],)
        )
        categoria = cursor.fetchone()
        conn.commit()
        conn.close()
        return jsonify(dict(categoria)), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ========== ROTAS PARA MEDICAMENTOS ==========

@app.route("/api/medicamentos", methods=["GET"])
def get_medicamentos():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT m.*, c.nome_categoria 
            FROM medicamentos m 
            JOIN categorias_medicamentos c ON m.id_categoria = c.id_categoria 
            ORDER BY m.id_medicamento
        """)
        medicamentos = cursor.fetchall()
        conn.close()
        return jsonify([dict(medicamento) for medicamento in medicamentos])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/medicamentos", methods=["POST"])
def create_medicamento():
    try:
        data = request.get_json()
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO medicamentos (nome_medicamento, id_categoria, data_validade) VALUES (%s, %s, %s) RETURNING *",
            (data['nome_medicamento'], data['id_categoria'], data['data_validade'])
        )
        medicamento = cursor.fetchone()
        conn.commit()
        conn.close()
        return jsonify(dict(medicamento)), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ========== ROTAS PARA ESTOQUE ==========

@app.route("/api/estoque", methods=["GET"])
def get_estoque():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT e.*, p.nome_posto, m.nome_medicamento, c.nome_categoria
            FROM estoque_postos e
            JOIN postos_saude p ON e.id_posto = p.id_posto
            JOIN medicamentos m ON e.id_medicamento = m.id_medicamento
            JOIN categorias_medicamentos c ON m.id_categoria = c.id_categoria
            ORDER BY p.nome_posto, m.nome_medicamento
        """)
        estoque = cursor.fetchall()
        conn.close()
        return jsonify([dict(item) for item in estoque])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/estoque", methods=["POST"])
@token_required
def create_estoque(current_posto):
    try:
        data = request.get_json()
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO estoque_postos (id_posto, id_medicamento, quantidade) VALUES (%s, %s, %s) RETURNING *",
            (current_posto['posto_id'], data['id_medicamento'], data['quantidade'])
        )
        estoque = cursor.fetchone()
        conn.commit()
        conn.close()
        return jsonify(dict(estoque)), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/estoque/<int:id_estoque>", methods=["PUT"])
def update_estoque(id_estoque):
    try:
        data = request.get_json()
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE estoque_postos SET quantidade = %s WHERE id_estoque = %s RETURNING *",
            (data['quantidade'], id_estoque)
        )
        estoque = cursor.fetchone()
        conn.commit()
        conn.close()
        return jsonify(dict(estoque))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ========== ROTAS PARA TRANSAÇÕES ==========

@app.route("/api/transacoes", methods=["GET"])
def get_transacoes():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT t.*, 
                   pf.nome_posto as nome_posto_fornecedor,
                   pr.nome_posto as nome_posto_receptor,
                   m.nome_medicamento
            FROM transacoes_postos t
            JOIN postos_saude pf ON t.id_posto_fornecedor = pf.id_posto
            JOIN postos_saude pr ON t.id_posto_receptor = pr.id_posto
            JOIN medicamentos m ON t.id_medicamento = m.id_medicamento
            ORDER BY t.id_transacao DESC
        """)
        transacoes = cursor.fetchall()
        conn.close()
        return jsonify([dict(transacao) for transacao in transacoes])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/transacoes", methods=["POST"])
@token_required
def create_transacao(current_posto):
    try:
        data = request.get_json()
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO transacoes_postos (id_posto_fornecedor, id_posto_receptor, id_medicamento, quantidade, status_transacao) VALUES (%s, %s, %s, %s, %s) RETURNING *",
            (current_posto['posto_id'], data['id_posto_receptor'], data['id_medicamento'], data['quantidade'], data.get('status_transacao', 'PENDENTE'))
        )
        transacao = cursor.fetchone()
        conn.commit()
        conn.close()
        return jsonify(dict(transacao)), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ========== ROTA DE TESTE ==========

@app.route("/api/hello")
def hello():
    return jsonify({"message": "Hello from Flask!"})

if __name__ == "__main__":
    app.run(debug=True)
