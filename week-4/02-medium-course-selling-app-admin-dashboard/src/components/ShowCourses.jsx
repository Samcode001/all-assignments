import axios from "axios";
import React, { useEffect, useState } from "react";


const GetCourses = async () => {
    try {
        const response = await axios('http://localhost:3000/admin/courses', {
            headers: { 'authorization': `Bearer ${JSON.parse(localStorage.getItem('auth'))}` }
        })
        return response.data.courses
        console.log("Showing course", response.data.courses);
    } catch (error) {
        console.log(error)
    }
}
function ShowCourses() {
    const [courses, setCourses] = useState([]);

    // Add code to fetch courses from the server
    // and set it in the courses state variable.



    useEffect(() => {
        GetCourses().then(data => [
            setCourses(data)
        ])
    }, [])


    return <div>
        <h1>Create Course Page</h1>
        {courses.length === 0 ? <p>No corses yet</p> : courses.map(c => <Course title={c.title} description={c.description} />)}
    </div>
}

function Course(props) {
    return <div>
        <h1>{props.title}</h1>
        <span>{props.description}</span>
    </div>
}

export default ShowCourses;