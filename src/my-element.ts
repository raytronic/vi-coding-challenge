import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('my-element')
export default class PokemonGrid extends LitElement {
    @property({ type: Array }) pokemonList = [];
    @property({ type: Array }) filteredPokemonList = [];
    @property({ type: Array }) selectedTypes = [];

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
    }

    async fetchPokemon() {
        const apiUrl = 'https://pokeapi.co/api/v2/pokemon/';
        try {
            for (let i = 1; i < 151; i++) {
                const res = await fetch(apiUrl + i);
                const mydata = await res.json();
                this.pokemonList.push(mydata);
            }
            this.filteredPokemonList = [...this.pokemonList];
            this.requestUpdate();
        } catch (err) {
            console.error('Failed to fetch data:', err);
        }
    }

    filterByType(type: string) {
        if (this.selectedTypes.includes(type)) {
            
            this.selectedTypes = this.selectedTypes.filter(t => t !== type);
        } else {
            
            this.selectedTypes = [...this.selectedTypes, type];
        }

        this.filteredPokemonList = this.selectedTypes.length
            ? this.pokemonList.filter(pokemon =>
                  pokemon.types.some(t => this.selectedTypes.includes(t.type.name))
              )
            : [...this.pokemonList];
        this.requestUpdate();
    }

    render() {
        return html`
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
}
