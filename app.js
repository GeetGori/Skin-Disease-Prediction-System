// npm run dev  -> to start the website on localhost:3000

const express =  require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

//Static Files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))

app.get('',(req,res)=>{
  res.sendFile(__dirname + '/views/index.html')
})
//Passport Config
require('./config/passport')(passport);

//DB Config
const db = require('./config/keys').mongoURI;

//connect to Mongo
mongoose.connect(db,{useNewUrlParser: true , useUnifiedTopology: true })
.then(() => console.log('MongoDB Connected...'))
.catch(err=>console.log(err));


//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs')


//Bodyparser
app.use(express.urlencoded({extended:false}));


// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );


//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


//Connect Flash
app.use(flash());


//Global Vars
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})



//Routes
app.use('/',require('./routes/index'))
app.use('/users',require('./routes/users'))

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`server started on port ${PORT} `));