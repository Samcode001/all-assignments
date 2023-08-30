import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Course from "./Course";



function ShowCourses() {
    const [courses, setCourses] = useState([]);

    // Add code to fetch courses from the server
    // and set it in the courses state variable.


    const GetCourses = async () => {
        try {
            const response = await axios.get('http://localhost:3000/admin/courses', {
                headers: { 'authorization': `Bearer ${JSON.parse(localStorage.getItem('auth'))}` }
            })
            setCourses(response.data.courses);
            console.log("Showing course", response.data.courses);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        GetCourses()
    }, [])


    return <div>
        <h1>Create Course Page</h1>{console.log(courses)}
        {courses.length === 0 ? <p>No corses yet</p> : courses.map(c => {
            return <>
                <Link to="/course"><Course title={c.title} description={c.description} /></Link>
            </>
        })}
    </div>
}



export default ShowCourses;