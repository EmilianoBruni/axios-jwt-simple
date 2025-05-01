import axios from 'axios';
import ajsAttach from './lib/ajs.js';

// export from types
export * from './types.js';

const ajs = ajsAttach(axios.create());

export { ajs as default, ajsAttach };
