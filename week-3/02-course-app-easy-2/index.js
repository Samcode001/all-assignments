const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();  // Putting this beacuse using the env varible 

app.use(bodyParser.json())
app.use(express.json());

const secret = process.env.secret_key;

let ADMINS = [];
let USERS = [];
let COURSES = [];

const adminAuthentication = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, secret, (err, data) => {
      if (err)
        res.status(403).send("Invalid credentials")
      next();
    })
  }
  else
    res.status(401).send("UnAuthorised")
}

const userAuthentication = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, secret, (err, data) => {
      if (err)
        res.status(403).send("Unauthorized");

      req.user = data;
      next();
    })
  }
  else
    res.status(401).send("Bad request");
}

const adminTokenGenerate = (user) => {

  let payload = { user: user.username };
  let token = jwt.sign(payload, secret, { expiresIn: '1h' })
  return token;
}

const userTokenGenerate = (user) => {

  let payload = { user: user.username };
  let token = jwt.sign(payload, secret, { expiresIn: '1h' })
  return token;
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin

  const admin = { ...req.body };
  let adminExist = ADMINS.find(elem => elem.username === admin.username);
  if (adminExist)
    res.status(401).send("Admin already exist");

  ADMINS.push(admin);
  const token = adminTokenGenerate(admin);
  res.json({ " admin creted succesfully": token });
});

app.post('/admin/login', adminAuthentication, (req, res) => {
  // logic to log in admin
  // console.log(req.admin)
  const { username, password } = req.body;
  let admin = ADMINS.find(elem => elem.username === username && elem.password === password);
  if (admin)
    res.send({ "Logged in successfullt": adminTokenGenerate(admin) })
  else
    res.status(403).send("error in route");

});

app.post('/admin/courses', adminAuthentication, (req, res) => {
  // logic to create a course

  let courseExist = COURSES.find(c => c.title === req.body.title);
  if (courseExist)
    res.status(401).send("Course already exist");
  let course = { courseId: Math.floor(Math.random() * 1000), ...req.body };
  COURSES.push(course);
  console.log(COURSES);
  res.send({ message: "Course created succesfully", courseId: course.courseId });
});

app.put('/admin/courses/:courseId', adminAuthentication, (req, res) => {
  // logic to edit a course
  const courseId = parseInt(req.params.courseId)
  let courseExist = COURSES.findIndex(elem => elem.courseId === courseId)
  if (courseExist !== -1) {
    COURSES[courseExist] = { courseId: courseId, ...req.body };
    console.log(COURSES)
    res.send({ meassage: "Course updated successfully", updatedCourse: COURSES[courseExist] })
  }
  else
    res.status(404).send({ message: "Course doesn't exist" });
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
  res.send({ course: COURSES })
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  let user={...req.body};
  const userExist=USERS.find(elem=>elem.username===user.username);
  if(userExist)
  res.status(401).send("User already exist");
  
  user={userId:Math.floor(Math.random()*10000),...user};
  USERS.push(user);
  res.send({message:"User created sucessfully",token:userTokenGenerate(user)})
   
});

app.post('/users/login', userAuthentication,(req, res) => {
  // logic to log in user
  let user={...req.body}
  const userExist=USERS.find(elem=>elem.username===user.username && elem.password===user.password);
  if(userExist){
    res.send({message:"Logged in successfully",token:userTokenGenerate(user)})
  }
  else
  res.status(403).send("Invalid Credentilas");
});

app.get('/users/courses', userAuthentication,(req, res) => {
  // logic to list all courses
  res.send({courses:COURSES.filter(c=>c.published)})
});

app.post('/users/courses/:courseId',userAuthentication ,(req, res) => {
  // logic to purchase a course
  const courseId=parseInt(req.params.courseId);
  const courseExist=COURSES.find(elem=>elem.courseId===courseId)
  if(courseExist){
    let user=req.user.user
    console.log(user);
    user=USERS.find(elem=>elem.username===user);
    user.purchasedCourse.push(courseExist)
    res.send({message:"Course purchased successfully"})
  }
  else
  res.status(404).send("Course doesn't exist");
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
