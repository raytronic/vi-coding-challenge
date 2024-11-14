import { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import './my-element';

export default {
  title: 'PokemonGrid',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onOpen: { action: 'onClick' },
    headerTitle: { control: 'text' },
  },
  render: (args) => html`
    <my-element .headerTitle=${args.headerTitle} @click=${args.onOpen}></my-element>
  `,
} as Meta;

export const Default: StoryObj = {
  name: 'Default',
  args: {
    headerTitle: 'Pokemon Grid', // Editable header title in Storybook
  },
};
