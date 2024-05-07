import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import axios from 'axios';

function TaskItem({ task,fetchTasks }) {

    const [subTasks, setSubTasks] = useState(task.subTasks);
    const [taskCompleted, setTaskCompleted] = useState(false);

    /**
     * Handles the change of a subtask's completion status.
     * @param {Number} index - The index of the subtask in the subTasks array.
     */
    const handleSubTaskChange = (index) => {
        const updatedSubTasks = [...subTasks];
        updatedSubTasks[index].completed = !updatedSubTasks[index].completed;
        setSubTasks(updatedSubTasks);
    };

    /**
     * UseEffect hook to monitor the completion status of all subtasks.
     * If all subtasks are completed, the task is considered completed.
     *
     * @param {Array} subTasks - An array of subtask objects.
     */
    useEffect(() => {
        const allCompleted = subTasks.every(subTask => subTask.completed);
        setTaskCompleted(allCompleted);
        console.log("Task completed:", allCompleted);
    }, [subTasks]);

    /**
     * Handles the completion of the task.
     * Deletes the task from the server and updates the tasks list.
     */
    const handleCompleteTask = async() => {
        setTaskCompleted(true);
        console.log(task._id)   
        await axios.delete(`http://localhost:8080/tasks`, {data: { taskId: task._id }, withCredentials:true})
        .then(response => {
            console.log('Task deleted successfully.');
            fetchTasks();
        })
        .catch(error => {
            console.error('Error deleting task:', error);
        });
    };  
    return (
        <div className="accordion-item">
        <h2 className="accordion-header" id={`heading${task.id}`}>
            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${task.id}`} aria-expanded="true" aria-controls={`collapse${task.id}`}>
                {task.title}
            </button>
        </h2>
        <div id={`collapse${task.id}`} className="accordion-collapse collapse" aria-labelledby={`heading${task.id}`}>
            <div className="accordion-body">
                <p><strong>Description:</strong> {task.description}</p>
                {task.dueDate ? 
                (<p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>) : 
                (<p><strong>Due Date:</strong> No due date</p>)}
                <ul className="list-group">
                    {subTasks.map((subTask,index) => (
                        <li className="list-group-item d-flex justify-content-between align-items-center" key={subTask._id}>
                            <div>
                                <input 
                                    type="checkbox" 
                                    checked={subTask.completed} 
                                    onChange={() => handleSubTaskChange(index)} 
                                />
                                <span className={subTask.completed ? 'text-decoration-line-through ms-2' : 'ms-2'}>{subTask.title}</span>
                            </div>
                        </li>
                    ))}
                </ul>
                <button 
                    className="btn btn-success btn-sm mt-2 ms-2"
                    onClick={handleCompleteTask} 
                    disabled={!taskCompleted}
                >
                    Complete Task
                </button>
            </div>
        </div>
    </div>
    );
}

export default TaskItem;