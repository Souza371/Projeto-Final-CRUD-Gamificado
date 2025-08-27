const express = require('express');
const app = express();
const PORT = 3000;

// Servir arquivos estáticos
app.use(express.static('.'));

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/hero_academy_frontend.html');
});

app.listen(PORT, () => {
    console.log('?? Servidor rodando: http://localhost:' + PORT);
});
