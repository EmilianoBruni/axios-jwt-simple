import axios from 'axios';
import ajsAttach from './lib/ajs.js';

const ajs = ajsAttach(axios);

export { ajs as default, ajsAttach };
