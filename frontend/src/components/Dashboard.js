import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import "../styles/Register.css"
import {useSignOut} from "react-auth-kit";
import { useNavigate } from'react-router-dom';
import TaskItem from './TaskItem';

function Dashboard(){
    const signOut = useSignOut();
    const navigate = useNavigate();
    const handleLogout = () => {
        signOut();
        navigate('/login');
    };

    const tasks = [
        {
            id: 1,
            title: 'Task 1',
            description: 'Description for Task 1',
            dueDate: '2024-10-10',
            priority: 'High',
            status: 'In Progress',
            subTasks: [
                { id: 1, title: 'Subtask 1', completed: false },
                { id: 2, title: 'Subtask 2', completed: false },
                { id: 3, title: 'Subtask 3', completed: false }
            ]
        },
        {
            id: 2,
            title: 'Task 2',
            description: 'Description for Task 2',
            dueDate: '2024-10-10',
            priority: 'High',
            status: 'In Progress',
            subTasks: [
                { id: 1, title: 'Subtask 1', completed: false },
                { id: 2, title: 'Subtask 2', completed: false }
            ]
        }
    ];
    
    return (
        <div className="container mt-5">
            <h2>Dashboard</h2>

            {/* Buttons */}
            <div className="d-flex justify-content-between mb-3">
                <button className="btn btn-success">Add Task</button>
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </div>

            {/* Task Container */}
            <div className="accordion mt-4" id="taskAccordion">
                {tasks.map(task => (
                    <TaskItem key={task.id} task={task} />
                ))}
            </div>
        </div>
    )
}
export default Dashboard;