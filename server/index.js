const app = require('./app.js')
const { PORT } = process.env;

app.listen(PORT || 3000, () => console.log('listening on port 3000'));
