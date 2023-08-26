const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const pasth = require('path');
const path = require('path');
app.use(express.json());
app.use(bodyParser.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const adminPath = path.join(__dirname, '../admins.json')
const coursePath = path.join(__dirname, '../courses.json')
const userPath = path.join(__dirname, '../users.json');

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  let newAdmin = {
    id: Math.floor(Math.random() * 10),
    username: req.body.username,
    password: req.body.password
  }

  fs.readFile(adminPath, 'utf-8', (err, data) => {
    if (err)
      res.status(501).send("Can't Read file");
    else {

      let ADMINS = JSON.parse(data);
      let userExist = ADMINS.findIndex(elem => elem.username === req.body.username);

      if (userExist !== -1)
        res.status(401).send("User Already Exists");
      else {
        ADMINS.push(newAdmin)
        ADMINS = JSON.stringify(ADMINS);
        fs.writeFile(adminPath, ADMINS, (err) => {
          if (err)
            res.status(501).send("Error in Writing File");
          else {
            res.status(200).json({
              "message": "Admin Created successfully",
              "Content": `${fs.readFileSync(adminPath, 'utf-8')}`
            });
          }
        });
      }
    }

  });
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin

  fs.readFile(adminPath, 'utf-8', (err, data) => {
    if (err)
      res.status(401).send("Error in reading File");
    else {
      ADMINS = JSON.parse(data);
      let userExist = ADMINS.findIndex(elem => elem.username === req.body.username)
      if (userExist === -1)
        res.status(401).send("User not Exist")
      else {
        ADMINS[userExist].password === req.body.password ? res.status(200).json({ "message": "Logged in succesfully" }) : res.status(401).send("Enter Valid credentials")
      }
    }
  })
});

app.post('/admin/courses', (req, res) => {
  // logic to create a course

  let newCourse = {
    courseId: Math.floor(Math.random() * 1000),
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    imageLink: req.body.imageLink,
    published: req.body.published
  }

  fs.readFile(coursePath, 'utf-8', (err, data) => {
    if (err)
      res.status(401).send("Error in reading FIle");
    else {
      COURSES = JSON.parse(data);
      COURSES.push(newCourse);

      fs.writeFile(coursePath, JSON.stringify(COURSES), (err) => {
        if (err)
          res.status(401).send("Error In writing file");
        else {
          res.status(200).json({
            "message": "Course screated successfully",
            "courseId": `${newCourse.courseId}`
          })
        }
      })
    }
  })

});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course

  fs.readFile(coursePath, 'utf-8', (err, data) => {
    if (err)
      res.status(401).send("Error in reading file.");
    else {

      COURSES = JSON.parse(data);
      let courseIndex = COURSES.findIndex(elem => elem.courseId === parseInt(req.params.courseId))
      if (courseIndex === -1)
        res.status(401).send("No Course Found");
      else {
        COURSES[courseIndex].title = req.body.title;
        COURSES[courseIndex].description = req.body.description;
        COURSES[courseIndex].price = req.body.price;
        COURSES[courseIndex].imageLink = req.body.imageLink;
        COURSES[courseIndex].published = req.body.published;
      }
      fs.writeFile(coursePath, JSON.stringify(COURSES), (err) => {
        if (err)
          res.status(401).send("Eroor happen in writing file");
        else {
          res.status(201).json({ "message": "Course updated successfully" })
        }
      })
    }
  })
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
  fs.readFile(coursePath, 'utf-8', (err, data) => {
    if (err)
      res.status(401).send("Error in writing File");
    else {
      res.send(data);
    }
  })
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  fs.readFile(userPath, 'utf-8', (err, data) => {
    if (err)
      res.status(401).send("Error in reading file.");
    else {
      USERS = JSON.parse(data);
      let userIndex = USERS.findIndex(elem => elem.username === req.body.username);
      if (userIndex !== -1)
        res.status(401).send("User Already Exist")
      else {
        let newUser = {
          id: Math.floor(Math.random() * 100000),
          username: req.body.username,
          password: req.body.password
        }
        USERS.push(newUser);
        fs.writeFile(userPath, JSON.stringify(USERS), (err) => {
          if (err)
            res.status(401).send("Error on writing file");
          else {
            res.json({ "message": "User created successfully" })
          }
        })
      }

    }
  })
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  fs.readFile(userPath, 'utf-8', (err, data) => {
    if (err)
      res.status(401).send("Error in reading file");
    else {
      USERS = JSON.parse(data);
      let userIndex = USERS.findIndex(elem => elem.username === req.body.username);
      if (userIndex === -1)
        res.status(401).send("User Invalid")
      else {
        USERS[userIndex].password === req.body.password ? res.json({ "message": "Logged in successfully" }) : res.status(401).send("Invalid Credentials");
      }
    }
  })
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
  fs.readFile(coursePath, 'utf-8', (err, data) => {
    if (err)
      res.status(400).send("Error in reading file.");
    else {
      res.send(JSON.parse(data));
    }
  })
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
  
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
  
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
