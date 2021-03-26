const path = require('path');

module.exports = {
    entry: './scripts/start.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    }
};