import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('my-element')
export default class PokemonGrid extends LitElement {
    @property({ type: Array }) pokemonList = [];
    @property({ type: Array }) filteredPokemonList = [];
    @property({ type: Array }) selectedTypes = [];
    @property({ type: String }) headerTitle = 'Pokemon Grid';

    static styles = [
        css`
            :host {
                display: block;
            }
            .container {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }
            .port {
                background-color: #eee;
                border-radius: 3px;
                display: flex;
                flex-direction: column;
                align-items: center;
                box-shadow: 1px 1px 3px;
                width: 150px;
                position: relative;
                transition-duration: 200ms;
            }
            .port:hover {
                opacity: 80%;
            }
            .pokename {
                text-transform: capitalize;
            }
            .pokeid {
                position: absolute;
                right: 10px;
                font-weight: bold;
            }
            .sidebar {
                background-color: #eee;
                box-shadow: 1px 1px 3px;
                
                min-width: 180px;
                max-width: 180px;
                border-radius: 3px;
            }
            .main {
                display: flex;
            }
            
            .filter{
            
            }

            .sidecont{
            margin-left: 1em;
            }
        `
    ];

    connectedCallback() {
        super.connectedCallback();
        this.fetchPokemon();
        this.typeToPokemonMap = new Map(); // Precompute mapping
    }
    
    async fetchPokemon() {
        const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=151';
        try {
            const res = await fetch(apiUrl);
            const data = await res.json();
    
            const pokemonDetails = await Promise.all(
                data.results.map(async pokemon => {
                    const res = await fetch(pokemon.url);
                    return res.json();
                })
            );
    
            this.pokemonList = pokemonDetails;
            this.filteredPokemonList = [...this.pokemonList];
    
            // Precompute type-to-pokemon mapping
            pokemonDetails.forEach(pokemon => {
                pokemon.types.forEach(typeObj => {
                    const type = typeObj.type.name;
                    if (!this.typeToPokemonMap.has(type)) {
                        this.typeToPokemonMap.set(type, []);
                    }
                    this.typeToPokemonMap.get(type).push(pokemon);
                });
            });
    
            this.requestUpdate();
        } catch (err) {
            console.error(err);
        }
    }
    
    filterByType(type: string) {
        if (this.selectedTypes.includes(type)) {
            this.selectedTypes = this.selectedTypes.filter(t => t !== type);
        } else {
            this.selectedTypes = [...this.selectedTypes, type];
        }
    
        if (this.selectedTypes.length === 0) {
            this.filteredPokemonList = [...this.pokemonList];
        } else {
            const combinedSet = new Set();
            this.selectedTypes.forEach(selectedType => {
                const pokemons = this.typeToPokemonMap.get(selectedType) || [];
                pokemons.forEach(pokemon => combinedSet.add(pokemon));
            });
            this.filteredPokemonList = [...combinedSet];
        }
    
        this.requestUpdate();
    }

    render() {
        return html`
            <h1 contenteditable="true" @input="${this.handleHeaderInput}">${this.headerTitle}</h1>
            <div class="main">
                <div class="sidebar">
                <div class="sidecont">
                
                    <h3>Pokemon List</h3>
                    <p>Filter by type</p>
                    <div class="filter">
                        ${['grass', 'poison', 'fire', 'flying', 'water', 'bug', 'normal', 'electric', 'fairy', 'ground', 'fighting', 'psychic', 'rock', 'ghost', 'dragon', 'ice'].map(
                            type => html`
                                <p>
                                <label>
                                    <input
                                        type="checkbox"
                                        @click="${() => this.filterByType(type)}"
                                        ?checked="${this.selectedTypes.includes(type)}"
                                    />
                                    ${type.charAt(0).toUpperCase() + type.slice(1)}
                                </label>

                                </p>
                            `
                        )}
                    </div>
                </div>
                </div>
                <div class="container">
                    ${this.filteredPokemonList.map(
                        pokemon => html`
                            <div class="port">
                                <img
                                    src="${pokemon.sprites.front_default}"
                                    alt="Image not available"
                                />
                                <p class="pokename">${pokemon.name}</p>
                                <p>Type: ${pokemon.types[0].type.name}${pokemon.types[1] ? ' / ' + pokemon.types[1].type.name : ''}</p>
                                <p class="pokeid">#${pokemon.id}</p>
                            </div>
                        `
                    )}
                </div>
            </div>
        `;
    }
    handleHeaderInput(event) {
        this.headerTitle = event.target.innerText;
    }
}
