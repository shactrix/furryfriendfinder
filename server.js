// DEPENDCIES
 require('dotenv').config()
const express = require('express')
const app = express();
 const mongoose = require('mongoose')
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

app.get('/', (req, res) => {
    res.redirect('/furryFriendFinder')
})

// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.set('strictQuery', true)

// MONGODB ATLAS CONNECTION
// May or may not need these depending on your Mongoose version
mongoose.connect(MONGODB_URI , { 
    // useNewUrlParser: false, -- deprecated
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false
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




// ABOUT




// INDEX
app.get('/furryFriend', (req, res) => {
    furryFriend.find({}, (error, allFurryFriends)=>{
        res.render('index.ejs', {
            furryFriends: allFurryFriends
})
    })
        })
    

// NEW
app.get('/furryFriend/new', (req, res) => {
    res.render('new.ejs')
})


// POST
app.post('/furryFriend', (req, res) => {
    req.body.name = req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1);
    furryFriend.push(req.body)
    res.redirect('/furryFriend')
    // const furryFriendId = furryfriend.length - 1;
    // res.redirect(`/furryFriend/${furryFriendId}`)
})


// SHOW
app.get('/furryFriend/:id', (req, res) => {
    res.render('show.ejs', {
        furryFriend: furryFriend[req.params.id]
    })
})



// EDIT
app.get('/furryFriend/:id/edit', (req, res) => {
    res.render(
        'edit.ejs',
        {
            furryFriend: furryFriend[req.params.id],
            id: req.params.id
        }
    )
})



// PUT
app.put('/furryFriend/:id', (req,res) => { 
    furryFriend[req.params.id] = req.body
    res.redirect('/furryFriend')
})



// DELETE
app.delete('/furryFriend/:id', (req,res) => {
    furryFriend.splice(req.params.id, 1)
    res.redirect('/furryFriend')
})






app.listen(3000, () => {
    console.log('Server is listening');
});