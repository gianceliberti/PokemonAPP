// Función para mostrar la información del Pokémon en el HTML
function displayPokemonInfo(pokemon, imageUrl, baseStats) {
    clearErrorMessage();

    const pokemonInfo = document.getElementById('pokemonInfo');

    // Muestra la imagen principal del Pokémon si está disponible
    const mainImage = imageUrl ? `<img src="${imageUrl}" alt="${pokemon.name}" class="main-image" />` : '';

    // Filtra las imágenes válidas del Pokémon (sin devolver un código de estado 404)
    const validSprites = pokemon.sprites ? Object.values(pokemon.sprites).filter(sprite => sprite && sprite !== '404.png') : [];
    
    // Muestra 4 imagenes mas, versiones macho y hembra con shiny, en este caso permanece comentada, solo mostraremos una imagen unica.
    //const otherImages = validSprites.slice(0, 4).map(sprite => `<img src="${sprite}" alt="${pokemon.name}" class="extra-image" />`).join('');

    // Formatea los tipos del Pokémon
    const formattedTypes = pokemon.types.map(type => type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)).join(', ');

    // Aplica colores a cada tipo
    const typeColors = {
        normal: '#A8A77A',
        fire: '#EE8130',
        water: '#6390F0',
        electric: '#F7D02C',
        grass: '#7AC74C',
        ice: '#96D9D6',
        fighting: '#C22E28',
        poison: '#A33EA1',
        ground: '#E2BF65',
        flying: '#A98FF3',
        psychic: '#F95587',
        bug: '#A6B91A',
        rock: '#B6A136',
        ghost: '#735797',
        dragon: '#6F35FC',
        dark: '#705746',
        steel: '#B7B7CE',
        fairy: '#D685AD',
    };
    // Muestra los tipos del Pokémon con colores
    const typesList = pokemon.types.map(type => `<span style="background-color: ${typeColors[type.type.name.toLowerCase()]}; color: white; padding: 5px; border-radius: 5px; margin: 0 5px;">${capitalizeFirstLetter(type.type.name)}</span>`).join('');

   
    // Muestra las estadísticas base del Pokémon
    const statsList = Object.entries(baseStats).map(([statName, statValue]) => `<li>${formatStatName(statName)}: ${statValue}</li>`).join('');

    // Construye la estructura HTML
    const pokemonDetailsHTML = `
        <p id="pokemonName">Name: ${capitalizeFirstLetter(pokemon.name)}</p>
        <p id="pokemonTypes">Types: ${typesList}</p>
        ${mainImage}
       
        <p id="totalStats">Total Stats:</p>
        <ul>
            ${statsList}
            <li>Total: ${calculateTotal(baseStats)}</li>
        </ul>
    `;

    // Aplica la estructura HTML al contenedor
    pokemonInfo.innerHTML = pokemonDetailsHTML;
}

// Función para capitalizar la primera letra de cada palabra
function capitalizeFirstLetter(str) {
    return str.replace(/\b\w/g, match => match.toUpperCase());
}

function formatStatName(statName) {
    // Separa las palabras y las capitaliza
    const words = statName.split(/(?=[A-Z])/);
    const formattedName = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return formattedName;
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

 // Función para actualizar la fecha en el footer
 function updateCurrentDate() {
    const currentDateSpan = document.getElementById('current-date');
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    currentDateSpan.textContent = formattedDate;
}

// Llama a la función para actualizar la fecha
updateCurrentDate();

