// Función para mostrar la información del Pokémon en el HTML
function displayPokemonInfo(pokemon, imageUrl, baseStats) {
    clearErrorMessage();

    const pokemonInfo = document.getElementById('pokemonInfo');

    // Muestra la imagen principal del Pokémon si está disponible
    const mainImage = imageUrl ? `<img src="${imageUrl}" alt="${pokemon.name}" class="main-image" />` : '';

    // Filtra las imágenes válidas del Pokémon (sin devolver un código de estado 404)
    const validSprites = pokemon.sprites ? Object.values(pokemon.sprites).filter(sprite => sprite && sprite !== '404.png') : [];
    
    // Muestra solo las primeras 5 imágenes válidas
    const otherImages = validSprites.slice(0, 4).map(sprite => `<img src="${sprite}" alt="${pokemon.name}" class="extra-image" />`).join('');

    // Muestra las estadísticas base del Pokémon
    const statsList = Object.entries(baseStats).map(([statName, statValue]) => `<li>${statName}: ${statValue}</li>`).join('');

    // Construye la estructura HTML
    const pokemonDetailsHTML = `
        <p id="pokemonName">Name: ${pokemon.name}</p>
        <p id="pokemonTypes">Types: ${pokemon.types.map(type => type.type.name).join(', ')}</p>
        ${mainImage}
        ${otherImages}
        <p id="totalStats">Total Stats:</p>
        <ul>
            ${statsList}
            <li>Total: ${calculateTotal(baseStats)}</li>
        </ul>
    `;

    // Aplica la estructura HTML al contenedor
    pokemonInfo.innerHTML = pokemonDetailsHTML;
}

// Función para calcular el total de los puntos base
function calculateTotal(baseStats) {
    // Sumar todos los puntos base
    return Object.values(baseStats).reduce((total, stat) => total + (stat || 0), 0);
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

// Nueva función para obtener características base desde la API de Pokémon
async function getPokemonDetailsFromAPI(name) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
        if (!response.ok) {
            throw new Error(`No se pudo obtener información detallada para ${name}`);
        }

        const pokemonData = await response.json();

        // Obtener características base desde la API
        const baseStats = {
            hp: getPokemonStat(pokemonData, 'hp'),
            ataque: getPokemonStat(pokemonData, 'attack'),
            defensa: getPokemonStat(pokemonData, 'defense'),
            ataqueEspecial: getPokemonStat(pokemonData, 'special-attack'),
            defensaEspecial: getPokemonStat(pokemonData, 'special-defense'),
            velocidad: getPokemonStat(pokemonData, 'speed'),
        };

        return baseStats;
    } catch (error) {
        console.error('Error al obtener detalles del Pokémon:', error.message);
        throw error;
    }
}

// Función auxiliar para extraer estadísticas del objeto de Pokémon
function getPokemonStat(pokemonData, statName) {
    const stat = pokemonData.stats.find(stat => stat.stat.name === statName);
    return stat ? stat.base_stat : null;
}

// Actualizamos la llamada en getPokemonByName para utilizar la nueva función
async function getPokemonByName(name) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
        if (!response.ok) {
            throw new Error(`El Pokémon con el nombre "${name}" no existe`);
        }

        const pokemon = await response.json();
        const imageUrl = pokemon.sprites?.front_default || pokemon.sprites?.other?.['official-artwork']?.front_default;

        // Obtener características base desde la API de Pokémon
        const baseStats = await getPokemonDetailsFromAPI(name);

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
