import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js'


@customElement('my-element')
export default class PokemonGRid extends LitElement {
    @property({ type: Array }) pokemonList = [];

    static styles = [
        css`
            :host {
                display: block;
            }

            .container {
                display: flex;
                height: 100vh;
                flex-wrap: wrap;
                background-color: blue;
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
        
            for (let i = 1 ; i < 151; i++){
                const res = await fetch(apiUrl + i)
                const mydata = await res.json();
                this.pokemonList.push(mydata);
                
                
            }
            this.requestUpdate();
           
            
        } catch (err) {
            console.error('Failed to fetch data:', err);
        }
    }
    

    render() {
        console.log(this.pokemonList)

        return html`
        <div class='container'>
        ${ this.pokemonList.map((pokemon)=> html 
            `<div>
            <img src="${pokemon.sprites.front_default}" alt="${'image not available'}">
            ${pokemon.name}
            
            </div>`)}
        </div>
        `;
    }
}
