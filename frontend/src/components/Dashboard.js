import axios from 'axios';
import React, { useState, useEffect } from 'react';
import '../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.css';
import "../styles/Register.css"
import { useSignOut, useAuthUser}  from "react-auth-kit";
import { useNavigate } from'react-router-dom';
import TaskItem from './TaskItem';
import AlertBox from './AlertBox';

function Dashboard(){

    // -- Hooks -- //
    const { authState } = useAuthUser();
    const signOut = useSignOut();
    const navigate = useNavigate();

    const [postSuccess, setPostSuccess] = useState(null);
    const clearAlert = () => setPostSuccess(null);

    const [tasks, setTasks] = useState([]);
    const [error,setError] = useState('');

    const [taskData, setTaskData] = useState({
        title:'',
        description:'',
        dueDate: {},
        subTasks:[]
    });

    // -- Handlers -- //
    const handleLogout = () => {
        signOut();
        navigate('/login');
    };

    const handleChange = (e) => {
        setTaskData({
        ...taskData,
        [e.target.name]: e.target.value
        });
    };

    const handleAddSubtask = () => {
        const newSubtask = {
            _id: Date.now(), // Using timestamp as a temporary unique key for the list item
            title: '',
            completed: false
        };
    
        setTaskData({
            ...taskData,
            subTasks: [...taskData.subTasks, newSubtask]
        });
    };

    const handleSubtaskChange = (index, e) => {
        const updatedSubTasks = [...taskData.subTasks];
        updatedSubTasks[index] = {
            ...updatedSubTasks[index],
            title: e.target.value
        };
        setTaskData({
            ...taskData,
            subTasks: updatedSubTasks
        });
    };

    const handleDeleteSubtask = (index) => {
        const updatedSubTasks = [...taskData.subTasks];
        updatedSubTasks.splice(index, 1);
        setTaskData({
            ...taskData,
            subTasks: updatedSubTasks
        });
    };
    const handleTask = async(e) => {
        e.preventDefault();
        try{
            setError('');
            const dataToSend = {
                ...taskData,
                subTasks: taskData.subTasks.map(subtask => ({ title: subtask.title, completed: subtask.completed }))
            };

            await axiosPostData(dataToSend);
            fetchTasks();
            setTaskData({
                title:'',
                description:'',
                dueDate: {},
                subTasks:[]
            });
        } catch(error){
            console.error('Error:', error);
        }
    }

    const axiosPostData = async (data) => {
        try {
            const response = await axios.post('http://localhost:8080/tasks', data, {
            withCredentials: true
            });

            if (response.status === 200) {
                console.log('Task added');
                setPostSuccess(true);
            }
        }
         catch (error) {
            console.error('Error adding task:', error);
            setPostSuccess(false);
        }
    }
    
    // Fetches tasks from the server.
    const fetchTasks = async () => {
        try{
            const response = await axios.get('http://localhost:8080/tasks',{
                withCredentials: true, // send cookie with the request
            });
         if (response === undefined) {
                console.log('Error fetching tasks');
                setTasks([]);
                return; 
            }
            setTasks(response.data.tasks);
     } catch(error){
         if (error.response) {
                if (error.response.status === 403) {
                    setError('Current session has expired. Please log in again.');
                } else {
                    setError('An unexpected error occurred. Please try again later.');
                }
            } else {
                setError('Network error. Please check your internet connection.');
            }
            
        }
    }

    useEffect(() => {   
        fetchTasks();
    }, [authState]);
    
    return (
        <>
            <div className="container mt-5">
                <h2>Dashboard</h2>
                <AlertBox isSuccess={postSuccess} clearAlert={clearAlert} />
                {/* Buttons */}
                <div className="d-flex justify-content-between mb-3">
                    <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Add Task</button>
                    <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                </div>
                {error}
                {/* Task Container */}
                <div className="accordion mt-4" id="taskAccordion">
                    {tasks.map(task => (
                        <TaskItem key={task._id} task={task} fetchTasks={fetchTasks}/>
                    ))}
                </div>
            </div>
            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" >
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">Add Task</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="title" name="title" value={taskData.title} onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea className="form-control" id="description" name="description" rows="3" value={taskData.description} onChange={handleChange}></textarea>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="dueDate" className="form-label">Due Date</label>
                                    <input type="date"
                                    className="form-control"
                                    id="dueDate"
                                    name="dueDate"
                                    value={taskData.dueDate}
                                    onChange={handleChange} required />
                                </div>
                                <div className="mb-3" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                    <label htmlFor="subTasks" className="form-label">Subtasks</label>
                                    {taskData.subTasks.length > 0 && taskData.subTasks.map((subtask, index)=> (
                                        <div key={subtask._id} className="mb-3 d-flex align-items-center">
                                            <input type="text" className="form-control me-2" value={subtask.title} onChange={(e) => handleSubtaskChange(index, e)} />
                                            <button type="button" className="btn btn-danger" onClick={() => handleDeleteSubtask(index)}>Delete</button>
                                        </div>
                                    ))}               
                                </div>  
                                <button type="button" className="btn btn-primary" onClick={handleAddSubtask}>Add Subtask</button>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-success" onClick={handleTask}>Add Task</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Dashboard;