require('dotenv').config();
const { readdirSync } = require('fs');
const express = require('express');
const path = require('path');

const app = express();
const guis = readdirSync(path.resolve('src'), { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
const response = `<ul>
${guis.map(name => `<li><a href="${name}">${name}</a></li>`).join('')}
</ul>`;

app.use(express.static('src'));

app.get('/', (req, res) => {
    res.send(response);
});

app.listen(process.env.PORT, () => console.log(`app listening at port ${process.env.PORT}`));