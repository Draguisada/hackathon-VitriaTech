class DB {
    #db = []
    #id = 0
    constructor() {
        this.#db = []
        this.#id = 0
    }

    listarItem() {
        return this.#db
    }

    adicionarRemedio(nome, validade) {
        this.#db.push(JSON.stringify(new Remedio(++this.#id, nome, validade)))
    }

    removerRemedio(id) {
        console.log(this.#db)
        console.log(this.#db.map(e => JSON.parse(e)).filter(e => e.id != id))
        this.#db = this.#db.map(e => JSON.parse(e)).filter(e => e.id != id).map(e => JSON.stringify(e))
        console.log(this.#db)
        
    }

    reset() {
        this.#db = []
    }

}


class Remedio {
    constructor(id, nome, validade) {
        this.id = id;
        this.nome = nome;
        this.validade = validade;
    }
}

// esperado 
/*
[
    { remedio obj
    infos...
    }

]




*/
module.exports = new DB();