import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'





function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  // fetch all todos from server

  const addTodo = async () => {
    if(title==="" || desc===""){
      alert("Please fill the foem first");
      return
    }
    let response = await fetch('http://localhost:3001/todos', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: title,
        description: desc
      })
    })

    if (response.status === 201) {
      setTitle("");
      setDesc("");
      console.log("Added");
      fetchTodos()
    }
    else
      console.log("Error Occured");
  }


  const deleteTodo=async(id)=>{
    let response=await fetch(`http://localhost:3001/todos/${id}`,{
      method:"DELETE",
      headers:{
        'Content-Type':'application/json'
      }
    })
    if(response.status===200){
      console.log("Deleted")
      fetchTodos();
    }
    else{
      console.log("Error in deleting")
    }
  }

  const fetchTodos = async () => {
    let response = await fetch('http://localhost:3001/todos')

    let data = await response.json();
    setTodos(data);
  }


  useEffect(() => {

    fetchTodos()
  }, [])


  return (
    <>
      <div>
        <h1>Easy Todo App</h1>

        <div>
          <h1>Title</h1>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          <h1>Desciption</h1>
          <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} />
          <button onClick={addTodo}>Add Todo</button>
        </div>
        <h1>List of Todo</h1>
        <div>
          {todos.length === 0 ? <h4>No todos Added</h4> : todos.map(elem => {
            return <div key={elem.id} >
              <div>{elem.title}</div>
              <div>{elem.description}</div>
              <div><button onClick={()=>deleteTodo(elem.id)}>Delete</button><button id={elem.id}>Edit</button></div>
              <br />
            </div>
          })}
        </div>
      </div>
    </>
  )
}

function Todo(props) {
  // Add a delete button here so user can delete a TODO.
  return <div>
    {props.title}
  </div>
}

export default App
