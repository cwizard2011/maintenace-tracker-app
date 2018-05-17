const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT || PORT

const app = express();
app.get('/', (req, res) => res.send('Welcome to maintenance app'))

app.listen(port, () => console.log('Example app listening on port 3000!'))