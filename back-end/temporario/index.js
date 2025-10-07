const express = require('express');
const cors = require('cors'); // Habilita a comunicação entre domínios
// Importa suas rotas de autenticação e rotas privadas
const rotas = require('./rotas.js');

const app = express();
const PORT = 5000; // Define a porta, com 5000 como fallback
// Middlewares
app.use(cors());
app.use(express.json()); // Permite que a API leia JSON
// Rotas públicas (como login e registro)

app.use('/', rotas)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});