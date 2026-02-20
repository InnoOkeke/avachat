import 'react-native-get-random-values';
import { Buffer } from 'buffer';
import process from 'process';

global.Buffer = global.Buffer || Buffer;
global.process = global.process || process;

if (!global.process.env) {
    global.process.env = {
        NODE_ENV: __DEV__ ? 'development' : 'production',
    };
} else if (!global.process.env.NODE_ENV) {
    global.process.env.NODE_ENV = __DEV__ ? 'development' : 'production';
}

// polyfill crypto for jose
if (typeof global.crypto === 'undefined') {
    global.crypto = {};
}

// Ensure crypto is also available as a top-level global if possible
// In RN, global.X makes X available globally
if (typeof crypto === 'undefined') {
    global.crypto = global.crypto;
}
