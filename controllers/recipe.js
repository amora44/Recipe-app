const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipes');

//index
router.get('/', function (req, res) {
    res.redirect('/recipes');
});
router.get('/recipes', (req, res) => {
    Recipe.find({}) 
        .sort({ title: -1 })
        .exec((err, recipes) => {
      res.render('index.ejs', { recipes }
      );
    });
});

 // new
router.get('/recipes/new', (req, res) => {
    res.render('new.ejs', { recipe: {} });
}); 

// show 
router.get('/recipes/:id', (req, res) => {
    Recipe.findById(req.params.id, (err, Recipe) => {
      res.render('show.ejs', { recipe: Recipe });
    });
});

//edit
router.get('/recipes/:id/edit', (req, res) => {
    Recipe.findById(req.params.id, (err, editRecipe) => {
        res.render('edit.ejs', { recipe: editRecipe });
    });
});

//update
router.put('/recipes/:id', (req, res) => {
    Recipe.findByIdAndUpdate(req.params.id, req.body, (err, updatedRecipe) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect(`/recipes/${updatedRecipe._id}`);
        }
    });
});

//create
router.post('/recipes', (req, res) => {
    const newRecipe = new Recipe(req.body);
    Recipe.create(newRecipe, (err, createdRecipe) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect(`/recipes/${createdRecipe._id}`);
        }
    });
});   
// Delete a recipe
router.delete('/recipes/:id', (req, res) => {
    Recipe.findByIdAndDelete(req.params.id, (err, deletedRecipe) => {
        res.redirect('/');
    });
});

  module.exports = router;