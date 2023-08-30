import React from 'react'
import { Link } from 'react-router-dom'

const Course = (props) => {
    return (
        <>
            <h4>{props.title}</h4>
            <span>{props.description}</span>
        </>
    )
}

export default Course