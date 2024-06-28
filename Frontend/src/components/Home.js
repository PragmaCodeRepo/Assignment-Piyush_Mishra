import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    return (
        // <div className="container">
            <div className="home-container">
                <h1>Welcome to the Chat Application</h1>
                <p>Please login to start chatting with our  Pranjal' AI.</p>
                <Link to="/login">Login</Link>
            </div>
        // </div>
    );
};

export default Home;
