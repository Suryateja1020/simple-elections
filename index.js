const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');
const path = require('path');

const app = express();
const port = 3000;

const db = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'world',
  password: 'postgre@123',
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static("public"));

app.get('/', (req, res) => {
  db.query('SELECT * FROM election1', (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error retrieving data from the database.');
    }
    const parties = result.rows[0]; // Only one row
    res.render('index', { parties });
  });
});

app.post('/vote', (req, res) => {
  const partyName = req.body.partyName;
  db.query(`UPDATE election1 SET ${partyName} = ${partyName} + 1, total_votes = total_votes + 1`, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error updating vote count.');
    }
    res.redirect('/');
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

