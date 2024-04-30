import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../node_modules/bootstrap/dist/js/bootstrap.min.js';

function TaskItem({ task }) {

    const [subTasks, setSubTasks] = useState(task.subTasks);
    const [taskCompleted, setTaskCompleted] = useState(false);

    const handleSubTaskChange = (index) => {
        const updatedSubTasks = [...subTasks];
        updatedSubTasks[index].completed = !updatedSubTasks[index].completed;
        setSubTasks(updatedSubTasks);

        const allCompleted = updatedSubTasks.every(subTask => subTask.completed);
        setTaskCompleted(allCompleted);
    };

    const handleCompleteTask = () => {
        // Logic to mark task as completed
        setTaskCompleted(true);
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
                <p><strong>Due Date:</strong> {task.dueDate}</p>
                <ul className="list-group">
                    {subTasks.map((subTask, index) => (
                        <li className="list-group-item d-flex justify-content-between align-items-center" key={subTask.id}>
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
                <button className="btn btn-primary btn-sm mt-2">Edit</button>
                {taskCompleted && (
                    <button className="btn btn-success btn-sm mt-2 ms-2" onClick={handleCompleteTask}>Complete Task</button>
                )}
            </div>
        </div>
    </div>
    );
}

export default TaskItem;