import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import logo from '../assets/images/AdvayuLogo.png';

const LoginCard = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isShaking, setIsShaking] = useState(false);

    const navigate = useNavigate();

    // Mock Credentials
    const MOCK_USER = 'admin';
    const MOCK_PASS = 'admin123';

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setIsShaking(false);

        if (!username || !password) {
            setError('Please enter both username and password.');
            return;
        }

        setIsLoading(true);

        // Simulate Network Delay
        setTimeout(() => {
            if (username === MOCK_USER && password === MOCK_PASS) {
                setIsSuccess(true);
                setTimeout(() => {
                    // alert(`Welcome back, ${username}! Redirecting to CMS Dashboard...`);
                    setIsLoading(false);
                    setIsSuccess(false);
                    setUsername('');
                    setPassword('');
                    navigate('/dashboard');
                }, 500);
            } else {
                setError('Invalid username or password.');
                setIsLoading(false);
                setIsShaking(true);
                // Reset shake after animation
                setTimeout(() => setIsShaking(false), 500);
            }
        }, 1500);
    };

    return (
        <div className={`login-card ${isShaking ? 'shake' : ''}`}>
            <div className="login-header">
                <img src={logo} alt="Edvayu Logo" className="logo" />
                <h1>CMS Portal</h1>
                <p>Edvayu Educational Foundations</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <div className="input-wrapper">
                        <span className="input-icon">👤</span>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="input-wrapper">
                        <span className="input-icon">🔒</span>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div className="form-options">
                    <label className="checkbox-container">
                        <input type="checkbox" id="rememberMe" />
                        <span className="checkmark"></span>
                        Remember me
                    </label>
                    <a href="#" className="forgot-password">Forgot Password?</a>
                </div>

                <div className={`error-message ${error ? 'visible' : ''}`}>
                    {error}
                </div>

                <button
                    type="submit"
                    className={`btn-login ${isSuccess ? 'success' : ''}`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Authenticating...' : isSuccess ? 'Success!' : 'Login to Dashboard'}
                </button>
            </form>

            <div className="login-footer">
                <p>&copy; 2025 Edvayu Educational Foundations. All rights reserved.</p>
            </div>
        </div>
    );
};

export default LoginCard;
