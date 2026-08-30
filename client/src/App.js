import logo from './strCat.svg';
import './App.css';
import { useState, useEffect, useLayoutEffect } from 'react';

function App() {
  //task is empty array & setTasks is the function that allows task to change
  const [tasks, setTasks]= useState([]) // never do task=[...]
  // set task is like a updater what you do on the screen 
  const[newTask, setNewTask]= useState('');

  useEffect(()=>{
    fetch('http://localhost:5001/api/tasks')
      .then(res=>res.json())
      .then(data=> setTasks(data));

  }, []);
  
const handleAdd=()=>{
  fetch('http://localhost:5001/api/tasks', {
    method:'POST',
    headers:{'Content-Type': 'application/json'},
    body: JSON.stringify({title:newTask})
  })
  .then(res=>res.json())
  .then(newTaskFromServer=>{
    setTasks([...tasks, newTaskFromServer]);
    setNewTask('');
  });
};
//use `` here 
const handleDelete=(id)=>{
fetch(`http://localhost:5001/api/tasks/${id}`,{
  method:'DELETE'
})
.then(res=>res.json())
.then(()=>{
setTasks(tasks.filter(t=>t.id !==id))
});


};

const handleToggle = (id) => {
  const task = tasks.find(t => t.id === id);
  fetch(`http://localhost:5001/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ done: !task.done })
  })
    .then(res => res.json())
    .then(() => {
      const updatedTasks = tasks.map(t =>
        t.id === id ? { ...t, done: !t.done } : t
      );
      setTasks(updatedTasks);
    });
};

  return (
    <>
    <div className='max-w-md mx-auto my-8 flex flex-col items-center gap-3 bg-[#8FBE55] p-4 rounded-lg shadow-2xl max-h-200 overflow-y-auto '>
      <div className='flex flex-row justify-between items-center w-full'>
      <h1 className='text-4xl m-10 p-3 font-bold text-[#ffff]  '>To do list</h1>
      <img src={logo}/>
      </div>
{/*group the add button near the text-*/}
      <div className='flex flex-row justify-between  w-full '>
    <input className='w-full max-w-xs px-4 py-2 text-lg border rounded focus:outline-none shadow-sm' type="text"
           value={newTask}
           onChange={(e)=>setNewTask(e.target.value)}>
    </input>
 <button className="self-start bg-[#F47B4E] hover:bg-[#D9663B]-800 text-white font-bold py-2 px-4 rounded-full" onClick={handleAdd}>Add</button>
</div>

  <div className='p-10 flex flex-col gap-3 justify-start bg-[#FFFDF8] '>
  {tasks.map(task => (
    <li className="list-none flex items-center justify-between gap-10" key={task.id}>
      <input className='w-5 h-5 rounded-full accent-[#F47B4E]'type="checkbox" checked={task.done} onChange={() => handleToggle(task.id)} />
      
      <span className='ml-2 text-[#8F6659]' style={{ textDecoration: task.done ? 'line-through' : 'none' }}>
  {task.title}
</span>
 <button className="bg-[#F47B4E] hover:bg-[#D9663B] text-white font-bold py-1 px-3 rounded-full" onClick={() => handleDelete(task.id)}> X
  </button>
    </li>
  ))}
</div>
  </div>
  </>
    );
}

export default App;
