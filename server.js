const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql')
var session = require('express-session')

const routes = require('./routes');

const app = express();
const log = console.log;
const PORT = process.env.PORT || 8080;

app.use(session({ 
    secret: 'secret', 
    resave: false, 
    saveUninitialized: true
   })
)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routes);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static( 'client/build' ));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html')); // relative path
    });
}

app.listen(PORT, () => {
    log(`Server is starting at PORT: ${PORT}`);
});