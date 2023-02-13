//dependencies
const express = require('express');
const mongoose = require('mongoose');
const recipesRouter = require('./controllers/recipe');
const methodOverride = require('method-override');

//initialize
const app = express();

//configure
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;

//connect to mongodb
mongoose.set('strictQuery', false);
mongoose.connect(DATABASE_URL);

const db = mongoose.connection;

db.on('connected', () => {
    console.log('Connected to MongoDB');
});

db.on('error', (err) => {
    console.log('An error occurred with MongoDB: ' + err.message);
});

//mount middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));   
app.use(express.static('public'));

app.use(recipesRouter);

// listen
app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});