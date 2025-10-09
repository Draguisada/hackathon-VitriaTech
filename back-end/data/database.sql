    CREATE TABLE postos_saude (
        id_posto SERIAL NOT NULL,
        nome_posto VARCHAR NOT NULL,
        cnpj_posto CHAR(14) NOT NULL,
        endereco_posto VARCHAR NOT NULL,
        cep VARCHAR(8) NOT NULL,
        
        telefone_posto VARCHAR NULL,
        email_posto VARCHAR NOT NULL,
        senha_posto VARCHAR NOT NULL,
        responsavel_posto VARCHAR NOT NULL,
        tipo_usuario VARCHAR NOT NULL DEFAULT 'FARMACEUTICO',
        ativo BOOLEAN DEFAULT TRUE NOT NULL,
        data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        miligramas VARCHAR(8) DEFAULT '0' NULL,
        aceita_genericos BOOLEAN DEFAULT TRUE NULL,
        
        CONSTRAINT postos_saude_unique UNIQUE (cnpj_posto, email_posto),
        CONSTRAINT postos_saude_pk PRIMARY KEY (id_posto)
    );

    CREATE TABLE medicamentos (
        id_medicamento SERIAL NOT NULL,
        nome_medicamento VARCHAR NOT NULL,
        data_validade DATE NOT NULL,
        falta BOOLEAN DEFAULT FALSE NULL,
        quantidade INT NULL DEFAULT 0,
        id_posto INTEGER NOT NULL REFERENCES postos_saude(id_posto),
        CONSTRAINT medicamentos_pk PRIMARY KEY (id_medicamento)
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
    ALTER TABLE transacoes_postos DROP CONSTRAINT transacoes_postos_id_medicamento_fkey,
        ADD CONSTRAINT transacoes_postos_id_medicamento_fkey FOREIGN KEY (id_medicamento) REFERENCES medicamentos(id_medicamento) ON DELETE CASCADE;