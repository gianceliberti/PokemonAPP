import fetch from 'node-fetch';

const express = require('express');
const fetch = require('node-fetch').default;
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/wikidex/:name', async (req, res) => {
    try {
        const { name } = req.params;

        // Importación dinámica de fetch
        const fetch = (await import('node-fetch')).default;

        const response = await fetch(`https://www.wikidex.net/wiki/${name}`);
      
        if (!response.ok) {
            throw new Error(`No se pudo obtener información detallada para ${name}`);
        }

        const html = await response.text();
        res.send(html);
    } catch (error) {
        console.error('Error al obtener detalles del Pokémon:', error.message);
        res.status(500).json({ error: 'Error al obtener detalles del Pokémon' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

