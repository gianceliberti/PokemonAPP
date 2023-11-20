// eventListeners.js
// Event listener para el botón de búsqueda por nombre
document.getElementById('searchByName').addEventListener('click', async () => {
    const inputElement = document.getElementById('pokemonName');
    const pokemonName = inputElement.value.trim();

    if (pokemonName) {
        // Llamar a la función para obtener información por nombre
        await getPokemonByName(pokemonName);
    }
});

// Event listener para la tecla "Enter" en el campo de entrada
document.getElementById('pokemonName').addEventListener('keyup', async (event) => {
    if (event.key === 'Enter') {
        const inputElement = document.getElementById('pokemonName');
        const pokemonName = inputElement.value.trim();

        if (pokemonName) {
            // Llamar a la función para obtener información por nombre
            await getPokemonByName(pokemonName);
        }
    }
});

