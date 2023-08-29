import React from "react";
import { useState } from "react";
import axios from 'axios'
/// You need to add input boxes to take input for users to create a course.
/// I've added one input so you understand the api to do it.
function CreateCourse() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("")

    const setCourse = async () => {
        try {
            const response = await axios.post('http://localhost:3000/admin/courses', {
                title: title,
                description: description
            },{
               headers: {'authorization':`bearer ${JSON.parse(localStorage.getItem('auth'))}`}
            })
            if (response.status === 200) {
                console.log("Course added");
                setTitle("")
                setDescription("")
                
            }
        } catch (error) {
            console.log(error);
        }
    }

    return <div>
        <h1>Create Course Page</h1>
        Title - <input type={"text"} onChange={e => setTitle(e.target.value)} />
        Description - <input type={"text"} onChange={e => setDescription(e.target.value)} />
        <button onClick={setCourse}>Create Course</button>
    </div>
}
export default CreateCourse;