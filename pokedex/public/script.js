// Función para obtener información de un Pokémon por nombre
async function getPokemonByName(name) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
        if (!response.ok) {
            throw new Error(`El Pokémon con el nombre "${name}" no existe`);
        }

        const pokemon = await response.json();

        // Obtener la URL de la imagen del Pokémon (manejar casos donde 'sprites' puede estar en diferentes lugares)
        const imageUrl = pokemon.sprites?.front_default || pokemon.sprites?.other?.['official-artwork']?.front_default;

        // Limpiar el contenido HTML actual antes de mostrar nueva información
        clearPokemonInfo();

        displayPokemonInfo(pokemon, imageUrl);
    } catch (error) {
        console.error('Error al obtener información del Pokémon:', error.message);
        if (error.message.includes('no existe')) {
            // Limpiar el contenido HTML actual antes de mostrar el mensaje de error
            clearPokemonInfo();

            // Mostrar mensaje de error en el HTML
            displayErrorMessage(error.message);
        }
    }
}

// Función para mostrar la información del Pokémon en el HTML
function displayPokemonInfo(pokemon, imageUrl) {
    // Limpiar mensajes de error previos
    clearErrorMessage();

    const pokemonInfo = document.getElementById('pokemonInfo');
    pokemonInfo.innerHTML = `
        <p>Name: ${pokemon.name}</p>
        <p>Types: ${pokemon.types.map(type => type.type.name).join(', ')}</p>
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

