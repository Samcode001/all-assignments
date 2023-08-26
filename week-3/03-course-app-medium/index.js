const express = require('express');
const app = express();
const fs = require('fs')
const bodyParser = require('body-parser');
const path = require('path')

app.use(express.json());
app.use(bodyParser.json())

let ADMINS = [];
let USERS = [];
let COURSES = [];

const adminPath = path.join(__dirname, '../admins.json')
const coursePath = path.join(__dirname, '../courses.json')
const userPath = path.join(__dirname, '../users.json');

const adminAuthentication = (req, res, next) => {
  fs.readFile(adminPath, 'utf-8', (err, data) => {
    if (err)
      res.status(401).send("Error in Reading file");

    let admins = JSON.parse(data);
    let searchAdmin = admins.find(elem => elem.username === req.headers.username && elem.password === req.headers.password
    )
    if (searchAdmin)
      next();
    else
      res.status(403).send("Invalid credentials");
  })
}

const userAuthentication = (req, res, next) => {
  fs.readFile(userPath, 'utf-8', (err, data) => {
    if (err)
      res.status(401).send('Error in reading File');
    USERS = JSON.parse(data);
    let userExist = USERS.find(elem => elem.username === req.headers.username && elem.password === req.headers.password);
    if (userExist)
      next();
    else
      res.status(403).send("Invalid Credentials");
  })
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  let newAdmin = {
    id: Math.floor(Math.random() * 100),
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

app.post('/admin/login', adminAuthentication, (req, res) => {
  // logic to log in admin
  res.json({ "message": "Logged in successfully" })
});

app.post('/admin/courses', adminAuthentication, (req, res) => {
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

app.put('/admin/courses/:courseId', adminAuthentication, (req, res) => {
  // logic to edit a course
  fs.readFile(coursePath, 'utf-8', (err, data) => {
    if (err)
      res.status(401).send("Error in reading file.");
    else {

      COURSES = JSON.parse(data);
      let courseIndex = COURSES.findIndex(elem => elem.courseId === parseInt(req.params.courseId))
      if (courseIndex === -1)
        res.status(401).send("No Course Found");

      COURSES[courseIndex].title = req.body.title;
      COURSES[courseIndex].description = req.body.description;
      COURSES[courseIndex].price = req.body.price;
      COURSES[courseIndex].imageLink = req.body.imageLink;
      COURSES[courseIndex].published = req.body.published;

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

app.get('/admin/courses', adminAuthentication, (req, res) => {
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

  })
});

app.post('/users/login', userAuthentication, (req, res) => {
  // logic to log in user
  res.json({ "message": "Logged in successfully" })
});

app.get('/users/courses', userAuthentication, (req, res) => {
  // logic to list all courses
  fs.readFile(coursePath, 'utf-8', (err, data) => {
    if (err)
      res.status(400).send("Error in reading file.");
    else {
      res.send(JSON.parse(data));
    }
  })
});

app.post('/users/courses/:courseId', userAuthentication,(req, res) => {
  // logic to purchase a course
  fs.readFile(coursePath, 'utf-8', (err, data) => {
    if (err)
      res.status(401).send("Error in reading file");

    COURSES = JSON.parse(data);
    let courseExist = COURSES.find(elem => elem.courseId === parseInt(req.params.courseId));
    if (courseExist) {
      fs.readFile(userPath,'utf-8',(err,data)=>{
          if(err)
          res.status(401).send("Error in reading file");
          USERS=JSON.parse(data);
        let userExist = USERS.find(elem => elem.username === req.headers.username)
        console.log(req.headers.username)
      if (userExist) {
        if (!userExist.purchasedCourse) {
          // let purchasedCourse = [];
          // Object.assign(userExist, purchasedCourse)
          userExist.purchasedCourse=[];
        }
        
        userExist.purchasedCourse.push(courseExist);
        fs.writeFileSync(userPath,JSON.stringify(USERS))
        res.json({"message":"Course Purchased Succesfully"})
      }
      else
      res.status(404).send("User not Found");
    })
    }
    else
      res.status(404).send("Course Not found");
  })
});

app.get('/users/purchasedCourses', userAuthentication,(req, res) => {
  // logic to view purchased courses
     fs.readFile(userPath,'utf-8',(err,data)=>{
      if(err)
      res.status(401).send("error in reading users");

      USERS=JSON.parse(data);
      let userExist=USERS.find(elem=>elem.username===req.headers.username);
      if(userExist){
        // const purchasedCourse=;
        res.json({purchasedCourses:userExist.purchasedCourse})
        // res.send("Hello");
      }
      else
      res.status(404).send("User not found");
     })
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
