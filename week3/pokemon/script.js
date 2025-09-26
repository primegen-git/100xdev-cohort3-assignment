const cardHTML = (imgUrl, name, desc) => `
    <div class="col-12 col-sm-6 col-md-4 mb-4">
        <div class="card h-100"> 
            <img class="card-img-top" src="${imgUrl}" alt="Image of ${name}">
            <div class="card-body d-flex flex-column mt-auto">
                <h4 class="card-title">${name}</h4>
                <p class="card-text">${desc}</p>
            </div>
        </div>
    </div>
`;
document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("searchForm");
    const pokemonsContainer = document.querySelector("#pokemons-container");
    searchForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        pokemonsContainer.innerHTML = "";
        const type = document.querySelector("#type").value.trim().toLowerCase() || "electric";
        const qty = parseInt(document.querySelector("#quantity").value) || 30;

        const typeUrl = `https://pokeapi.co/api/v2/type/${type}`
        let typeRes = await axios.get(typeUrl);

        const pokemons = typeRes.data.pokemon;

        const pokeQty = Math.min(pokemons.length, qty)

        for (let i = 0; i < pokeQty; i++) {
            const pokeUrl = pokemons[i].pokemon.url;
            const name = pokemons[i].pokemon.name;
            const pokeRes = await axios.get(pokeUrl);

            const imgUrl = pokeRes.data.sprites.other.dream_world.front_default;

            const type = pokeRes.data.types[0].type.name;

            const speciesUrl = pokeRes.data.species.url;

            const speciesRes = await axios.get(speciesUrl);

            const flavor_text_entries = speciesRes.data.flavor_text_entries;

            let description = "";

            flavor_text_entries.forEach((val) => {
                if (val.language.name === "en") {
                    description = val.flavor_text;
                    return;
                }
            });

            if (description === "") {
                description = flavor_text_entries[0].flavor_text;
            }
            const desc = `${name} is a ${type} type. ${description}`;
            pokemonsContainer.innerHTML += cardHTML(imgUrl, name, desc);
        }

    })
})



