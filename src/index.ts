import axios from 'axios';
import ajsAttach from './lib/ajs.js';

const ajs = ajsAttach(axios.create());

export { ajs as default, ajsAttach };
