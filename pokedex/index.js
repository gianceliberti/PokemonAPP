const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

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
            throw new Error(`No se pudo obtener información para ${name}`);
        }

        const pokemonData = await response.json();
        const baseStats = {
            hp: getPokemonStat(pokemonData, 'hp'),
            ataque: getPokemonStat(pokemonData, 'attack'),
            defensa: getPokemonStat(pokemonData, 'defense'),
            ataqueEspecial: getPokemonStat(pokemonData, 'special-attack'),
            defensaEspecial: getPokemonStat(pokemonData, 'special-defense'),
            velocidad: getPokemonStat(pokemonData, 'speed'),
            puntosTotales: getPokemonStat(pokemonData, 'total'),  // Asumiendo que 'total' es la suma de las estadísticas base
        };

        res.json({ pokemon: pokemonData, baseStats });
    } catch (error) {
        console.error('Error al obtener detalles del Pokémon:', error.message);
        res.status(500).json({ error: 'Error al obtener detalles del Pokémon' });
    }
});

function getPokemonStat(pokemonData, statName) {
    const stat = pokemonData.stats.find(stat => stat.stat.name === statName);
    return stat ? stat.base_stat : null;
}

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
