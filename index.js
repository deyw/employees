const path = require('path');

const express = require('express');
const mongoClient = require('mongodb').MongoClient;
const ObjectID  = require('mongodb').ObjectID;
const bodyParser = require('body-parser');

// MongoDB config
const dbURL = 'mongodb://localhost:27017/employees';
mongoClient.connect(dbURL)
  .then((db) => {
    console.log('MongoDB connected successfuly');

    db.listCollections({
      name: 'data'
    }).next((err, collection) => {
      if (err) {
        console.error(err.message);
      }
      if (!collection) {
        console.log('collection not exist');
        
        // create collection
        db.createCollection('data');

        // initial demo data
        const employees = [{
          firstName: 'John',
          lastName: 'Doe',
          employmentDate: new Date(),
          rate: 10,
          jobTitle: 'SEO'
        },
        {
          firstName: 'Bill',
          lastName: 'Klarkson',
          employmentDate: new Date(),
          rate: 20,
          jobTitle: 'Developer'
        }
        ];

        db.collection('data').insertMany(employees)
          .then(message => console.log(message))
          .catch(err => console.error(err));
      }
      db.close();
    });
  })
  .catch((err) => {
    console.error(`Error: ${err.message}`);
  });

// Express config and middlewares
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join() + '/public'));




// display main page
app.get('/', (req, res) => {

  mongoClient.connect(dbURL)
    .then(db => {
      db.collection('data').find({}).toArray()
        .then(users => {
          res.render('index', { users });
        });
    })
    .catch(err => console.log(err));

});

// display create employee page
app.get('/add-employee', (req, res) => {
  res.render('add-employee', {
    message: false
  });
});

// Добавляем сотрудника
app.post('/add-employee', (req, res) => {
  let employee = req.body;
  mongoClient.connect(dbURL).then(db => {
    db.collection('data').insertOne(employee)
      .then(() => {
        if (req.xhr) {
          return res.status(200).json({ success: true });
        }
      })
      .catch(err => {
        if (req.xhr) {
          res.status(400).json(err);
        }
      });
  });
});

// Delete Employee
app.delete('/employee/:id', (req, res) => {

  const user_id = req.params.id;
  mongoClient.connect(dbURL).then(db => {
    db.collection('data').deleteOne({_id: ObjectID(user_id)})
      .then(() => {
        res.status(200).json({message: 'User deleted!'});
      })
      .catch(err => res.json({ message: err.message }));
    db.close();
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server listen on port: ${PORT}`));