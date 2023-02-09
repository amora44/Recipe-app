const express = require("express");
const mongoose = require("mongoose");
const app = express();


require('dotenv').config();
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;
const methodOverride = require("method-override");

mongoose.set('strictQuery', false);
mongoose.connect(DATABASE_URL);

const db = mongoose.connection;

db.on('connected', () => {
    console.log('Connected to MongoDB');
});

db.on('error', (err) => {
    console.log('An error occurred with MongoDB: ' + err.message);
});
const Recipe = require("./models/recipes");

app.use(express.static('public'));



//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(methodOverride("_method"));   

app.post("/recipes", (req, res) => {
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
  
app.put("/recipes/:id", (req, res) => {
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


// Get all recipes
app.get("/", (req, res) => {
    Recipe.find({}, (err, recipes) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.render('index', { recipes: recipes });
    });
  });

// Get a single recipe 
app.get("/recipes/:id", (req, res) => {
    Recipe.findById(req.params.id, (err, recipe) => {
      if (err) return res.send(err);
      res.render("show", { recipe });
    });
  });

// Create a new recipe
app.get("/new", (req, res) => {
    res.render("new");
});


// Update Recipe
app.get("/recipes/:id/edit", (req, res) => {
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
 
    // Delete a recipe
app.delete("/recipes/:id", (req, res) => {
    Recipe.findByIdAndDelete(req.params.id, (err, deletedRecipe) => {
        res.redirect("/");
      });
  });



// listen
app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});