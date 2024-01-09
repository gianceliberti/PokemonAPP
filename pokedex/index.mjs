// index.mjs
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/pokemon/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
      
        if (!response.ok) {
            throw new Error(`El Pokémon con el nombre "${name}" no existe`);
        }

        const pokemon = await response.json();
        const imageUrl = pokemon.sprites?.front_default || pokemon.sprites?.other?.['official-artwork']?.front_default;

        // Obtener características base desde la Wikidex usando el servidor
        const wikidexDetails = await fetch(`http://localhost:3000/wikidex/${name}`);
        const html = await wikidexDetails.text();

        clearPokemonInfo();
        displayPokemonInfo(pokemon, imageUrl, html);
    } catch (error) {
        console.error('Error al obtener información del Pokémon:', error.message);
        if (error.message.includes('no existe')) {
            clearPokemonInfo();
            displayErrorMessage(error.message);
        }
    }
});

app.get('/wikidex-proxy/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const wikidexResponse = await fetch(`https://www.wikidex.net/wiki/${name}`);
        
        if (!wikidexResponse.ok) {
            throw new Error(`No se pudo obtener información detallada para ${name}`);
        }

        const html = await wikidexResponse.text();
        res.send(html);
    } catch (error) {
        console.error('Error al obtener detalles del Pokémon desde Wikidex:', error.message);
        res.status(500).json({ error: 'Error al obtener detalles del Pokémon desde Wikidex' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
