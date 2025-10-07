// backend/src/routes/auth.routes.js
const router = require('express').Router();
const db = require('./memoryDB.js');

// Rota de login
router.post('/', async (req, res) => {

    const {nome, validade} = req.body;

    if (!nome) return res.status(401).json({ message: 'Sem nenhum dado enviado' });

    db.adicionarRemedio(nome, validade)

    res.json({message: 'Adicionado'});
});

router.delete('/:id', async (req, res) => {

    
    console.log(req.params);
    const id = req.params['id'];

    // if (!id) return res.status(401).json({ message: 'Sem nenhum dado enviado' });

    db.removerRemedio(`${id}`)

    res.json({message: 'Deletado com sucesso'});
});

router.get('/', async (req, res) => {
    // console.log(db.listarItem())
    res.json({ ...db.listarItem() });
});

router.get('/resetar', async (req, res) => {
    db.reset();
    res.json({ message: "Banco de dados na memória limpo" });
});
module.exports = router;