import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import NotFound from './components/NotFound';
import { Routes,Route } from 'react-router-dom';
import Footer from './components/Footer';
import {RequireAuth} from "react-auth-kit";

function App() {
  return (
    <div id="root">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/dashboard" element={<RequireAuth loginPath='/login'><Dashboard /></RequireAuth>} />
        <Route element={<NotFound />} />
      </Routes>
      <footer><Footer /></footer>
    </div>
  );
}

export default App;
