const path = require('path');

const express = require('express');
const hbs = require('hbs');
const chalk = require('chalk');
const dotenv = require('dotenv');

const { weather } = require('./routes');

// Load .env file and add it to process.env
dotenv.config({ path: path.join(__dirname, '../config.env') });

const app = express();
const PORT = process.env.PORT || 4000;

// Define paths for Express Config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Serve static directory
app.use(express.static(publicDirectoryPath));

// Serve weather API
app.use('/weather', weather);

// Serve dynamic templates
app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather API | Dynamic Page Rendering with Handlebars',
    heading: 'Ultimate Weather API'
  });
});

app.get('/api-docs', (req, res) => {
  res.render('api-docs', {
    title: 'API Docs',
    heading: 'Learn how to use our API'
  });
});

app.get('*', (req, res) => {
  res.render('404', {
    message: 'Go back to home'
  });
});


app.listen(PORT, () => {
  console.log(chalk.bold.keyword('royalblue')(`--- Server is running on port ${PORT} ---`))
});
