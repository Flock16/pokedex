const searchBar = document.querySelector('.searchBar');
const searchContainer = document.querySelector('.searchContainer');
const searchButton = document.querySelector('.searchButton');
const offButton = document.querySelector('.top_section_mainButton');

const display = document.querySelector('.display')
display.classList.remove('display');

let prevSearch = '';

const pokemonAPI = 'https://pokeapi.co/api/v2/pokemon/'

searchBar.addEventListener('keyup', debounce(possiblePokemon, 300));
searchButton.addEventListener('click', searchPokemon)
offButton.addEventListener('click', screenOff);

function debounce(mainFunction, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);

        timer = setTimeout(() => {
            mainFunction(...args);
        }, delay);
    };
};

function possiblePokemon() {
    if (searchBar.value.length === 0) clearSearchList();
    else if (prevSearch !== searchBar.value.toLowerCase()) {
        const pokemon = gen1And2And3Pokemon.filter(filterPokemon).slice(0, 5);
        // console.log(pokemon);
        createSearchList(pokemon);
        prevSearch = searchBar.value.toLowerCase();
    }
}

function filterPokemon(p) {
    let pokemon = searchBar.value.toLowerCase()
    let letters = searchBar.value.length;
    let query = p.slice(0, letters);

    if (pokemon === query) return true;
}

function createSearchList(pokemon) {

    clearSearchList();

    for (let p of pokemon) {
        const newDiv = document.createElement('div');
        newDiv.classList.add("searchOption")
        newDiv.innerText = p;

        newDiv.addEventListener('click', () => {
            searchBar.value = ''
            searchBar.value = p
            searchPokemon();
        })

        searchContainer.append(newDiv);
    }

}

function clearSearchList() {
    while (searchContainer.firstChild) {
        searchContainer.removeChild(searchContainer.firstChild);
    }
}

async function searchPokemon() {
    // Add proper error handling for invalid searches
    if (gen1And2And3Pokemon.includes(searchBar.value)) {
        let reponse = await fetch(pokemonAPI + searchBar.value);
        pokemonData = await reponse.json()
        // console.log(pokemonData);
        clearSearchList();
        searchBar.value = '';

        populateDisplay(pokemonData);
    }
}

function populateDisplay(pokemonData) {

    clearDisplay();

    if (!display.classList.contains('display')) {
        display.classList.add('display');
    }

    const titleDiv = document.createElement('div')
    const title = document.createElement('p');
    const number = document.createElement('p');

    titleDiv.classList.add('displayTitle')
    title.innerText = pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);
    number.innerHTML = '#' + pokemonData.id;

    titleDiv.append(title, number);
    display.append(titleDiv)

    // Images
    const imgDiv = document.createElement('div')
    const frontImage = document.createElement('img');
    const backImage = document.createElement('img');

    imgDiv.classList.add('pokemonImages')
    frontImage.src = pokemonData.sprites.front_default;
    backImage.src = pokemonData.sprites.back_default;

    imgDiv.append(frontImage, backImage);
    display.append(imgDiv);

    // Details
    const pokemonDetails = document.createElement('div')

    const detailsDiv = document.createElement('div');
    const detailsh3 = document.createElement('h3');

    detailsh3.innerText = "Type"
    detailsDiv.append(detailsh3);
    // console.log(pokemonData.types[0].type.name)
    for (let t of pokemonData.types) {
        const type = document.createElement('p');
        type.innerText = t.type.name;
        detailsDiv.append(type);
    }
    detailsDiv.classList.add('pokemonType');


    const pokemonDesDiv = document.createElement('div')
    const height = document.createElement('p');
    const weight = document.createElement('p');

    height.innerText = 'Height: ' + pokemonData.height
    weight.innerText = 'Weight: ' + pokemonData.weight
    pokemonDesDiv.append(height, weight);
    pokemonDesDiv.classList.add('pokemonDes');

    pokemonDetails.append(detailsDiv, pokemonDesDiv);
    pokemonDetails.classList.add('pokemonDetails');
    display.append(pokemonDetails);
}

function clearDisplay() {
    while (display.firstChild) {
        display.removeChild(display.firstChild);
    }
}

function screenOff() {
    clearDisplay();
    display.classList.remove('display');
}
