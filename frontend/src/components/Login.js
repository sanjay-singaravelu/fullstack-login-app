import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous errors

        try {
            const response = await axios.post('http://localhost:5004/login', {
                email,
                password,
            });
            onLogin(response.data.token); // Call the onLogin function to set auth status
        } catch (err) {
            console.error("Login error:", err);

            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message); // Display backend error message
            } else if (err.message) {
                setError(err.message); // Display a generic error message
            } else {
                setError("An error occurred during login.");
            }
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;