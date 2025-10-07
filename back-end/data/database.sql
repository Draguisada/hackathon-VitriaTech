CREATE TABLE postos_saude (
    id_posto SERIAL NOT NULL,
    nome_posto VARCHAR NOT NULL,
    cnpj_posto CHAR(14) NOT NULL,
    endereco_posto VARCHAR NOT NULL,
    telefone_posto VARCHAR NULL,
    email_posto VARCHAR NOT NULL,
    senha_posto VARCHAR NOT NULL,
    responsavel_posto VARCHAR NOT NULL,
    tipo_usuario VARCHAR NOT NULL DEFAULT 'FARMACEUTICO',
    ativo BOOLEAN DEFAULT TRUE NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT postos_saude_unique UNIQUE (cnpj_posto, email_posto),
    CONSTRAINT postos_saude_pk PRIMARY KEY (id_posto)
);

CREATE TABLE categorias_medicamentos (
    id_categoria SERIAL NOT NULL,
    nome_categoria VARCHAR NOT NULL,
    CONSTRAINT categorias_medicamentos_pk PRIMARY KEY (id_categoria)
);

CREATE TABLE medicamentos (
    id_medicamento SERIAL NOT NULL,
    nome_medicamento VARCHAR NOT NULL,
    id_categoria INTEGER NOT NULL REFERENCES categorias_medicamentos(id_categoria),
    data_validade DATE NOT NULL,
    CONSTRAINT medicamentos_pk PRIMARY KEY (id_medicamento)
);

CREATE TABLE estoque_postos (
    id_estoque SERIAL NOT NULL,
    id_posto INTEGER NOT NULL REFERENCES postos_saude(id_posto),
    id_medicamento INTEGER NOT NULL REFERENCES medicamentos(id_medicamento),
    quantidade INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT estoque_postos_pk PRIMARY KEY (id_estoque)
);

CREATE TABLE transacoes_postos (
    id_transacao SERIAL NOT NULL,
    id_posto_fornecedor INTEGER NOT NULL REFERENCES postos_saude(id_posto),
    id_posto_receptor INTEGER NOT NULL REFERENCES postos_saude(id_posto),
    id_medicamento INTEGER NOT NULL REFERENCES medicamentos(id_medicamento),
    quantidade INTEGER NOT NULL,
    status_transacao VARCHAR NOT NULL DEFAULT 'PENDENTE',
    CONSTRAINT transacoes_postos_pk PRIMARY KEY (id_transacao)
);
