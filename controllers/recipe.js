const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipes');

//index
router.get("/", (req, res) => {
    Recipe.find({}, (err, recipes) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.render('index', { recipes: recipes });
    });
  });

 // new
router.get("/new", (req, res) => {
    res.render("new");
}); 

// show 
router.get("/recipes/:id", (req, res) => {
    Recipe.findById(req.params.id, (err, recipe) => {
      if (err) return res.send(err);
      res.render("show", { recipe });
    });
  });

  //edit
router.get("/recipes/:id/edit", (req, res) => {
    Recipe.findById(req.params.id, (err, foundRecipe) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!foundRecipe) {
            return res.status(404).json({ error: "Recipe not found" });
        }
        res.render("edit", { recipe: foundRecipe });
    });
 });

//update
router.put("/recipes/:id", (req, res) => {
        Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedRecipe) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          if (!updatedRecipe) {
            return res.status(404).json({ error: "Recipe not found" });
          }
          res.redirect("/recipes/" + updatedRecipe.id);
        });
      });

//create
router.post("/recipes", (req, res) => {
    const { title, time, difficulty, ingredients, instructions, completed } = req.body.recipe;
    if (!title || !time || !difficulty || !ingredients || !instructions) {
        return res.status(400).json({ error: "missing required fields" });
    }

    const newRecipe = new Recipe({
        title,
        time,
        difficulty,
        ingredients,
        instructions,
        completed
    });

    newRecipe.save((err, savedRecipe) => {
        if (err) return res.send(err);
        res.redirect("/recipes/" + savedRecipe.id);
    });
});
   
// Delete a recipe
router.delete("/recipes/:id", (req, res) => {
    Recipe.findByIdAndDelete(req.params.id, (err, deletedRecipe) => {
        res.redirect("/");
      });
  });

  module.exports = router;