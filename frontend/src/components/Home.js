import React from 'react';
import { Link } from 'react-router-dom'
import "../styles/Home.css"
import TaskButton from './TaskButton'; 

function Home(){
    return (
        <div>
            <header>
                <h1>Welcome to Task Manager</h1>
            </header>
            <main>
                <section className="hero">
                    <h2>Organize Your Tasks Efficiently</h2>
                    <p>Task Manager helps you stay organized and focused by managing your tasks effectively</p>                  
                    <Link to="/login">
                        <TaskButton text={'Login'} theme="homeButton" />
                    </Link>
                    <Link to="/register">
                        <TaskButton text={'Register'} theme="homeButton" />
                    </Link>
                </section>
            </main>
        </div>
    )
}
export default Home;