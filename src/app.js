// khoi tao
const passport = require('passport');
const path = require('path');
const express = require('express');
const session = require('express-session');
const app = express();
const port = 3000;
const port1 = 3003;
const { engine } = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require("connect-flash");


// middleware customizations
const sortMiddleware = require('./app/middlewares/sortMiddleware');
app.use(sortMiddleware);

// File tu dinh nghia
const route = require('./routes');
const db = require('./app/config/db');

// connect to database
db.connect();

// overide Method
app.use(methodOverride('_method'));

// add morgan Log
const morgan = require('morgan');
app.use(morgan('combined'));

// get paramater POST
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

// Template engine
app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        helpers: require('./helper/handlebar'),
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// config file static
app.use(express.static(path.join(__dirname, 'public')));


// login 
app.use(session({
    secret: 'SECRET',
    // saveUninitialized: true
    //
}));
app.use(passport.initialize());
app.use(passport.session());





// flash message
app.use(flash());
// init router
route(app);

//lang nghe
app.listen(port || port1, () => {
    console.log(`Web app listening on port ${port}`);
});
