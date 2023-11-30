// DEPENDCIES
require('dotenv').config()
const express = require('express')
const app = express();
const path = require('path')

// const PORT = process.env.PORT
const furryFriend = require('./models/pet')
const seed = require('./models/seed')

// MIDDLEWARE
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))
app.use((req,res, next) =>{
    console.log("i run for all routes")
    next()
})

// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI;
const mongoose = require('mongoose')
mongoose.set('strictQuery', true)

// MONGODB ATLAS CONNECTION
// May or may not need these depending on your Mongoose version
mongoose.connect(MONGODB_URI , { 
    // useNewUrlParser: false, -- deprecated
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

// POST
app.post('/new', (req, res) => {
    req.body.name = req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1);
    furryFriend.push(req.body)
    res.redirect('/index')
    // const furryFriendId = furryfriend.length - 1;
    // res.redirect(`/furryFriend/${furryFriendId}`)
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
// app.get('/:id', (req, res) => {
//     const furryFriendId = req.params.id;

//     try {
//         const foundFurryFriend = furryFriend.findById(furryFriendId);
//         if (!foundFurryFriend) {
//             return res.status(404).send('Furry Friend not found.');
//         }
//         res.render('show.ejs', {
//             furryFriend: foundFurryFriend,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal Server Error');
//     }
// });


// EDIT
app.get('/:id/edit', (req, res) => {
    res.render(
        'edit.ejs',
        {
            furryFriend: furryFriend[req.params.id],
            id: req.params.id
        }
    )
})

// PUT
app.put('/:id', (req,res) => { 
    furryFriend[req.params.id] = req.body
    res.redirect('/index')
})

// DELETE
app.delete('/:id', (req,res) => {
    furryFriend.splice(req.params.id, 1)
    res.redirect('/index')
})




app.listen(3000, () => {
    console.log('Server is listening');
});