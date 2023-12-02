// DEPENDCIES
require('dotenv').config()
const express = require('express')
const app = express();
const path = require('path')
const methodOverride = require('method-override')

// const PORT = process.env.PORT
const furryFriend = require('./models/pet')
const seed = require('./models/seed')

// MIDDLEWARE
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use((req,res, next) =>{
    console.log("i run for all routes")
    next()
})

// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI;
const mongoose = require('mongoose');
const { error } = require('console');
mongoose.set('strictQuery', true)

// MONGODB ATLAS CONNECTION
// May or may not need these depending on your Mongoose version
mongoose.connect(MONGODB_URI , { 
    // useNewUrlParser: true,
    useUnifiedTopology: true,
});
// Database Connection Error/Success
const db = mongoose.connection
db.on('error', (err) => console.log(err.message + ' is MONGO not running?'));
db.on('connected', () => console.log('MONGO is connected'));
db.on('disconnected', () => console.log('MONGO is disconnected'));


//SEED
// furryFriend.create(seed, (err, data) => {
//   if (err) console.log(err.message)
//   console.log('added seed data')
// })

// furryFriend.collection.drop();

// HOME
app.get('/', (req, res) => {
    res.render('home.ejs')
})

// ABOUT
app.get('/about', (req, res) => {
    res.render('about.ejs')
})

// INDEX
app.get('/index', (req, res) => {
    furryFriend.find({}, (error, allFurryFriends)=>{
        res.render('index.ejs', {
            furryFriends: allFurryFriends
        })
    })
})
    
// NEW
app.get('/new', (req, res) => {
    res.render('new.ejs')
})

app.post('/index', (req, res) => {
    if(req.body.dogs === 'on'){
        req.body.dogs = true
    } else {
        req.body.dogs = false
    }
    if(req.body.cats === 'on'){
        req.body.cats = true
    } else {
        req.body.cats = false
    }
    if(req.body.kids === 'on'){
        req.body.kids = true
    } else {
        req.body.kids = false
    }
    furryFriend.create(req.body, (err, createdFurryFriends) => {
        if(err) {console.log(err.message)}
        console.log(createdFurryFriends)
        res.redirect('/index')
    })
})

// SHOW
app.get('/:id', (req, res) => {
    furryFriend.findById(req.params.id, (err, foundFurryFriends) => {
        if(err){console.log(err.message)}
        res.render('show.ejs', {
            furryFriend: foundFurryFriends
        })
    })
})


// EDIT
app.get('/:id/edit', (req, res) => {
    furryFriend.findById(req.params.id, (err, foundFurryFriend) => {
        if (err) {
            console.log(err.message);
            // Handle the error, maybe render an error page or redirect
            res.status(404).send('Not Found');
        } else {
            console.log('Furry friend found:', foundFurryFriend);
            res.render('edit.ejs', {
                furryFriend: foundFurryFriend,
                id: req.params.id
            });
        }
    });
});


// PUT
// app.put('/:id', (req,res) => { 
//    furryFriend.findByIdAndUpdate(req.params.id, req.body, {new: true}, (error, updatedFurryFriend) => {
//         res.redirect('/index')
//         })
// })
app.put('/:id', (req, res) => {
    if(req.body.dogs === 'on'){
        req.body.dogs = true
    } else {
        req.body.dogs = false
    }
    if(req.body.cats === 'on'){
        req.body.cats = true
    } else {
        req.body.cats = false
    }
    if(req.body.kids === 'on'){
        req.body.kids = true
    } else {
        req.body.kids = false
    }
    furryFriend.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updatedFurryFriend) => {
        if(err) {console.log(err.message)}
        console.log(updatedFurryFriend)
        res.redirect('/index')
    })
})


// DELETE
app.delete('/:id', (req,res) => {
    furryFriend.findByIdAndRemove(req.params.id, (error, data) => {
        res.redirect('/index') 
    })
})




app.listen(3000, () => {
    console.log('Server is listening');
});