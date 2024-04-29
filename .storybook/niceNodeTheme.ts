import { create } from '@storybook/theming/create';
import { processes } from 'systeminformation';

let brandUrl = 'https://nndesign.netlify.app/'
if(process.env.NODE_ENV === 'development') {
  brandUrl = 'http://localhost:6006/'
}

export default create({
  base: 'dark',
  brandTitle: 'NiceNode UI Components',
  brandUrl,
  brandImage: 'https://www.nicenode.xyz/favicon.png',
  brandTarget: '_self',
});
