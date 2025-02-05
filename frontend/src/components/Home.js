import React from 'react';
import axios from 'axios';

const Home = ({ onLogout }) => {

    const handleProtectedCall = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve token from localStorage
            const response = await axios.get('http://localhost:5004/api/protected', {
                headers: {
                    Authorization: `Bearer ${token}`, // Include token in the Authorization header
                },
            });
            console.log(response.data.message);
        } catch (error) {
            console.error("Protected API call error:", error);
        }
    };

    return (
        <div>
            <h2>Home</h2>
            <button onClick={handleProtectedCall}>Call Protected API</button> {/* Example */}
            <button onClick={onLogout}>Logout</button>
        </div>
    );
};

export default Home;