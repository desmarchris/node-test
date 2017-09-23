const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;
var app = express();

// partials allow us to create a template for our views to inherit from
hbs.registerPartials(__dirname + '/views/partials');
// set handlebars as the view engine to render data in html
app.set('view engine', 'hbs');

// writing our own middleware
app.use((req, rs, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;

  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log.');
    }
  });
  next();
});

// maintenance middleware
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

//serve up html
app.use(express.static(__dirname + '/public'));

// helper runs a function that you can use in templates
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
})

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home page 2',
    welcomeMessage: 'Hello! Welcome to my site'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About page'
  });
});

app.get('/projects', (req, res) => {
  res.render('projects.hbs');
});

// bad - send back json errorMessage
app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
