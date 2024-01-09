// Función para obtener información de un Pokémon por nombre
async function getPokemonByName(name) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
        if (!response.ok) {
            throw new Error(`El Pokémon con el nombre "${name}" no existe`);
        }

        const pokemon = await response.json();
        const imageUrl = pokemon.sprites?.front_default || pokemon.sprites?.other?.['official-artwork']?.front_default;

        // Obtener características base desde la Wikidex
        const baseStats = await getPokemonDetailsFromWikidex(name);

        clearPokemonInfo();
        displayPokemonInfo(pokemon, imageUrl, baseStats);
    } catch (error) {
        console.error('Error al obtener información del Pokémon:', error.message);
        if (error.message.includes('no existe')) {
            clearPokemonInfo();
            displayErrorMessage(error.message);
        }
    }
}
// Nueva función para obtener características base desde la Wikidex
async function getPokemonDetailsFromWikidex(name) {
    try {
        const response = await fetch(`http://localhost:3000/wikidex-proxy/${name}`);
        if (!response.ok) {
            throw new Error(`No se pudo obtener información detallada para ${name}`);
        }

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Obtener características base y puntos totales
        const baseStats = {
            hp: extractStat(doc, 'PS'),
            ataque: extractStat(doc, 'Ataque'),
            defensa: extractStat(doc, 'Defensa'),
            ataqueEspecial: extractStat(doc, 'Ataque Especial'),
            defensaEspecial: extractStat(doc, 'Defensa Especial'),
            velocidad: extractStat(doc, 'Velocidad'),
            puntosTotales: extractStat(doc, 'Total'),
        };

        return baseStats;
    } catch (error) {
        console.error('Error al obtener detalles del Pokémon:', error.message);
        throw error;
    }
}

// Función auxiliar para extraer estadísticas del documento HTML
function extractStat(doc, statName) {
    const statElements = doc.querySelectorAll('.caractertabla tr td:nth-child(1)');

    for (const element of statElements) {
        if (element.textContent.includes(statName)) {
            // Buscar el elemento hermano (td:nth-child(2)) para obtener el valor de la estadística
            const statValueElement = element.parentElement.querySelector('td:nth-child(2)');
            return statValueElement ? parseInt(statValueElement.textContent, 10) : null;
        }
    }

    return null;
}


// Función para mostrar la información del Pokémon en el HTML
function displayPokemonInfo(pokemon, imageUrl, baseStats) {
    clearErrorMessage();

    const pokemonInfo = document.getElementById('pokemonInfo');
    pokemonInfo.innerHTML = `
        <p>Name: ${pokemon.name}</p>
        <p>Types: ${pokemon.types.map(type => type.type.name).join(', ')}</p>
        <p>Base Stats:</p>
        <ul>
            <li>HP: ${baseStats.hp}</li>
            <li>Attack: ${baseStats.ataque}</li>
            <li>Defense: ${baseStats.defensa}</li>
            <li>Special Attack: ${baseStats.ataqueEspecial}</li>
            <li>Special Defense: ${baseStats.defensaEspecial}</li>
            <li>Speed: ${baseStats.velocidad}</li>
            <li>Total: ${baseStats.puntosTotales}</li>
        </ul>
        <img src="${imageUrl}" alt="${pokemon.name}" />
    `;
}



// Función para limpiar el contenido HTML actual
function clearPokemonInfo() {
    const pokemonInfo = document.getElementById('pokemonInfo');
    pokemonInfo.innerHTML = '';
}


// Función para mostrar mensajes de error en el HTML
function displayErrorMessage(message) {
    const errorElement = document.getElementById('errorMessage');
    errorElement.textContent = message;
}

// Función para limpiar mensajes de error en el HTML
function clearErrorMessage() {
    const errorElement = document.getElementById('errorMessage');
    errorElement.textContent = '';
}

