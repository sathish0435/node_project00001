const { Client } = require('pg');



class Database {
  constructor() {
    this.client = new Client({
      connectionString: 'postgresql://first_x63s_user:2cQUtFBS1A0ZyFLzcy9UPgRyraOoYnoL@dpg-cpv9v35umphs73c8qsp0-a.oregon-postgres.render.com/first_x63s',
      ssl: {
        rejectUnauthorized: false
      }
    });

  }

  async connect() {
    try {
      await this.client.connect();
      console.log('Connected to PostgreSQL database');
    } catch (err) {
      console.error('Error connecting to PostgreSQL:', err);
    }
  }

  async disconnect() {
    try {
      await this.client.end();
      console.log('Disconnected from PostgreSQL');
    } catch (err) {
      console.error('Error closing PostgreSQL connection:', err);
    }
  }

  async insertData(data) {
    try {
      const query = 'INSERT INTO student (name,age,mail,id) VALUES ($1, $2, $3, $4)';
      const values = [data.name, data.age,data.mail,data.id]; // Replace column1, column2, ... with your actual column names
      await this.client.query(query, values);
      console.log('Data inserted successfully:', data);
      console.log('Data inserted successfully');
    } catch (err) {
      console.error('Error inserting data:', err);
    }
  }
  async ensureAuthenticated(req, res, next) {
    try {
      if (req.session.user) {
        next();
      } else {
        res.redirect('/login');
      }
    } catch (err) {
      console.error('Error checking authentication:', err);
      res.status(500).send('Internal Server Error');
    }
  }

  async getAllStudents() {
    try {
      const query = 'SELECT * FROM student';
      const result = await this.client.query(query);
      const students = result.rows;
      console.log('All students:', students); // Print all students to console
      return students;
    } catch (err) {
      console.error('Error retrieving students:', err);
      throw err;
    }
  }


  async getAllbooks() {
    try {
      const query = 'SELECT * FROM book';
      const result = await this.client.query(query);
      const Books = result.rows;
      console.log('All book:', Books); // Print all students to console
      return Books;
    } catch (err) {
      console.error('Error retrieving students:', err);
      throw err;
    }
  }

  async getUserByNameAndAge(name, age) {
    try {
      const query = 'SELECT * FROM student WHERE name = $1 AND age = $2';
      const values = [name, age];
      const result = await this.client.query(query, values);
      if (result.rows.length > 0) {
        return result.rows[0]; // Return the first user found
      } else {
        return null; // No user found
      }
    } catch (err) {
      console.error('Error fetching user:', err.message);
      throw err;
    }
  }

  
 
  async insertBook(studentId, bookTitle, bookAuthor ,image_link,genre) {
    try {
      const query = 'INSERT INTO book (student_id, book_name, author,image_link,genre) VALUES ($1, $2, $3 ,$4,$5)';
      const values = [studentId, bookTitle, bookAuthor,image_link,genre];
      await this.client.query(query, values);
      console.log('Book inserted successfully');
    } catch (err) {
      console.error('Error inserting book:', err);
    }
  }

  async getBooksByStudentId(studentId) {
    try {
      
        const query = `
          SELECT book.book_name, book.author,book.image_link,book.genre, student.name, student.age, student.mail
          FROM book
          INNER JOIN student ON book.student_id = student.id
          WHERE book.student_id = $1
        `;
      const values = [studentId];
      const result = await this.client.query(query, values);
     
      const books = result.rows;

      console.log('Books:', books);
      return books;
    } catch (err) {
      console.error('Error retrieving books:', err);
      throw err;
    }
  }
  async getStudentById(studentId) {
    try {
      const query = 'SELECT name, age, mail , id FROM student WHERE id = $1 ';
      const values = [studentId];
      const result = await this.client.query(query, values);
      const studentDetails = result.rows[0]; // Assuming there is only one student for a given ID
      console.log('Student Details:', studentDetails);
      return studentDetails;
    } catch (err) {
      console.error('Error retrieving student details:', err);
      throw err;
    }
  }
  
  async  deleteBookById(bookId) {
    try {
      // Assuming you have a database connection initialized as 'dbConnection'
      // Initialize your database connection
      const query ='DELETE FROM book WHERE book_name = $1';
      const values = [bookId];
      const result = await this.client.query(query, values);

      const delete_Details = result.rows[0]; // Assuming there is only one student for a given ID
      console.log(`Book with ID ${bookId} deleted successfully.`);
      return delete_Details;
      // Close the database connection
    } catch (error) {
      console.error(`Error deleting book with ID ${bookId}: ${error.message}`);
      throw error;
    }
  }
  async deletestudentById(studentname) {
    try {
      const query = 'DELETE FROM student WHERE name = $1';
      const values = [studentname];
      const result = await this.client.query(query, values);
  
      console.log(`Student with ID ${studentname} deleted successfully.`);
      return result.rows[0];
    } catch (error) {
      console.error(`Error deleting student with ID ${studentname}: ${error.message}`);
      throw error;
    }
  }
  

}




module.exports = Database;
