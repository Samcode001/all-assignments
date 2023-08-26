const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
require('dotenv').config();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const Schema = mongoose.Schema;

const adminSchema = new Schema({
  username: {
    type: String,
    require: true,
    unique: true
  },
  password: {
    type: String,
    require: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new Schema({
  username: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  creted: {
    type: Date,
    default: Date.now
  }
})

const courseSchema = new Schema({
  title: {
    type: String,
    require: true
  },
  description: {
    type: String,
    require: true
  },
  price: {
    type: Number,
    require: true
  },
  imageLink: {
    type: String,
    require: true
  },
  published: {
    type: Boolean,
    require: true
  }
})

// Mongoose Models
const Admin = mongoose.model('Admin', adminSchema);
const Course = mongoose.model('Course', courseSchema);
const User = mongoose.model('User', userSchema);


mongoose.connect(`mongodb+srv://himanshujaiswal869:${process.env.data_key}@week-3.s4jn87v.mongodb.net/`, { useNewUrlParser: true, useUnifiedTopology: true, dbName: "courses" }).then(() => console.log("Database Connected")).catch((err) => console.log("Error in connectiing to database "))


const secret = process.env.secret_key;

const adminTokenGenerator = (admin) => {
  const payload = { admin: admin, role: 'admin' };
  return jwt.sign(payload, secret, { expiresIn: '1h' });
}

const userTokenGenerator = (user) => {
  const payload = { user: user, role: 'user' };
  return jwt.sign(payload, secret, { expiresIn: '1h' });
}

const adminAuthentication = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, secret, (err, user) => {
      if (err)
        res.status(403).send("Unauthorized");

      next();
    })
  }
  else
    res.status(401).send("Bad request");
}

const userAuthentication = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, secret, (err, user) => {
      if (err)
        res.status(403).send("Unauthorized");
     
        req.user=user;
      next();
    })
  }
  else
    res.status(401).send("Bad Request");
}

// Admin routes
app.post('/admin/signup', async (req, res) => {
  // logic to sign up admin
  const { username, password } = { ...req.body }
  let adminExist = await Admin.findOne({ username })
  if (adminExist)
    res.status(401).send({ meassage: "User Already Exist" });

  const newUser = new Admin({ username, password });
  try {
    await newUser.save()
    res.json({ message: "Admin created succesfully", token: adminTokenGenerator(username) })
  } catch (error) {
    res.status(401).send({ meassage: "Error occuresd on saving data" })
  }

});

app.post('/admin/login', adminAuthentication, async (req, res) => {
  // logic to log in admin
  const { username, password } = { ...req.body };
  let adminExist = await Admin.findOne({ username, password })
  if (adminExist) {
    res.json({ message: "Logged in succesfully", token: adminTokenGenerator(username) })
  }
});

app.post('/admin/courses', adminAuthentication, async (req, res) => {
  // logic to create a course
  const newCourse = new Course({ ...req.body })
  await newCourse.save();
  res.send({ message: "course created successfully" });
});

app.put('/admin/courses/:courseId', adminAuthentication, async (req, res) => {
  // logic to edit a course
  //  const {username,password}={...req.body};
  try {

    let updateCourse = await Course.findByIdAndUpdate(req.params.courseId, { ...req.body }, { new: true });
    res.send({ message: "Course updated succesfully", course: updateCourse })
  } catch (error) {
    res.status(401).send("Error in updatinfg course");
    console.log(error)
  }

});

app.get('/admin/courses', adminAuthentication, async (req, res) => {
  // logic to get all courses
  let courses = await Course.find({});
  res.send({ courses })
});

// User routes
app.post('/users/signup', async (req, res) => {
  // logic to sign up user
  const { username, password } = { ...req.body };
  let userExist = await User.findOne({ username });
  if (userExist)
    res.status(401).send("user already exist");

  const newUser = new User({ username, password });
  await newUser.save();
  res.send({ message: "User creted Successfully", token: userTokenGenerator(username) })

});

app.post('/users/login', userAuthentication, async (req, res) => {
  // logic to log in user
  const { username, password } = { ...req.body };
  const user = await User.findOne({ username, password });
  if (user) {
    res.send({ message: "Logged in successfully", token: userTokenGenerator(username) })
  }
  else
    res.status(403).send("Invalid credentials");
});

app.get('/users/courses', userAuthentication, async (req, res) => {
  // logic to list all courses
  let courses = await Course.find({ published: true });
  res.send({courses})
});

app.post('/users/courses/:courseId', userAuthentication,async(req, res) => {
  // logic to purchase a course
     const course=await  Course.findById(req.params.courseId);
     let userObj=req.user;
     console.log(userObj);
      if(!userObj.published)
      userObj.published=[];

      userObj.published.push(course);
       const {user}={...userObj}
       console.log(user)
       try {
         const updatedUser=await User.findOneAndUpdate({user},{...userObj},{new:true});
         res.send({message:"Course purchased Successfully",user:updatedUser})
       } catch (error) {
          console.log(error);
       } 


      
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
