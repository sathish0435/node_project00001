const express = require('express');
const router = express.Router();
const Database = require('..//model/book');

const db = new Database();
db.connect().catch(err => console.error(err));


// Middleware to check if user is authenticated
const authenticateUser = (req, res, next) => {
  if (req.session && req.session.user) {
    // User is authenticated
    next();
  } else {
    res.redirect('/login'); // Redirect to login page if not authenticated
  }
};

// Login route
router.get('/login', (req, res) => {
  res.render('pages/login',{ layout: 'login-layout' });
});
router.get('/', (req, res) => {
  res.render('index',{ layout: 'login-layout' });
});
router.get('/products', (req, res) => {
  res.render('pages/products');
});

router.post('/products', async (req, res) => {
  const { student_id, book_name, author,image_link,genre } = req.body;
  try {
    await db.insertBook(student_id, book_name, author,image_link,genre);
    console.log('Book inserted successfully');
    res.redirect(`/products/${student_id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});
// router.get('/products/:studentId', async (req, res) => {
//   const { studentId } = req.params;
//   try {
//     const books = await db.getBooksByStudentId(studentId);
//     res.render('pages/my_books', { books: books, studentId: studentId });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Internal Server Error');
//   }
// });
  router.get('/my_books' , async (req, res) => {
    const studentId = req.session.user.id;
    try {
      // Fetch both student details and book details by studentId
      if(studentId)
        {
          console.log("it was render");
          const [studentDetails, books] = await Promise.all([

            db.getStudentById(studentId),
            db.getBooksByStudentId(studentId)
            
            
          ]);
           // Render the HTML template with both student and book details
      res.render('pages/my_books', { studentId: studentId, ...studentDetails, books: books });
        }

      
     
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });




  router.post('/products/:book_name', async (req, res) => {
    const { book_name } = req.params;
    try {
      // Call a function to delete the book from the database
      await db.deleteBookById(book_name);
      res.redirect('/products'); // Redirect to homepage or wherever appropriate
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });



  router.post('/search/:name', async (req, res) => {
    const { name } = req.params;
    try {
      // Call a function to delete the student from the database
      await db.deletestudentById(name);
      return res.redirect('/search'); // Redirect to the search page
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error : getting your error');
    }
  });
  














router.get('/search', async (req, res) => {
  try {
    const students = await db.getAllStudents();
    res.render('pages/search', { students: students });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/all_books', async (req, res) => {
  try {
    const Books = await db.getAllbooks();
    res.render('pages/all_books', { Books: Books });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});
router.post('/search', async (req, res) => {
  const { name, age } = req.body; // Assuming the form fields are named 'name' and 'age'
  try {
    // Fetch user from database based on username (name) and password (age)
    const user = await db.getUserByNameAndAge(name, age);
    const students = await db.getAllStudents();
  
    if (user) {
      // User authenticated
      req.session.user = user
      console.log('User stored in session:', req.session.user); // Debug log
      res.render('pages/search',{ students: students,  user: user });
    } else {
      res.redirect('pages/login', { error: 'Invalid username or password' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});


router.use((req, res, next) => {
  console.log('Session data:', req.session);
  next();
});


module.exports = router;
