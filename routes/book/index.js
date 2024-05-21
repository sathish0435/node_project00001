


var express = require('express');
var router = express.Router();
const exhbs = require('express-handlebars');
const bodyParser = require('body-parser');
const rbooks = require('../..//model/book');


router.get('/add_book', (req, res) => {
  res.render('form/add_book');
});

router.get('/products', (req, res) => {
  res.render('pages/products');
});

router.get('/my_books', function(req, res, next) {
  res.render('pages/my_books');
});
 router.get('/search', function(req, res, next) {
   res.render('pages/search');
 });


// Create a new instance of the Database class
const db = new rbooks();

router.use(bodyParser.json());

// Handle POST request to insert data
// Handle POST request to insert data
router.post('/add_book', async (req, res) => {
  const data = req.body;
  
  try {
    await db.connect(); // Connect to the database
    await db.insertData(data); // Insert the received data into the database
    //await db.disconnect(); // Disconnect from the database
    
    console.log('Data inserted successfully:', data);
    res.sendStatus(200);
  } catch (error) {
    console.error('Failed to insert data:', error);
    res.status(500).send('Failed to insert data');
  }
});

  







module.exports = router;
