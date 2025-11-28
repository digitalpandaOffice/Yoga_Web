import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { endpoints } from '../config';
import logo from '../assets/images/AdvayuLogo.png';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [devToken, setDevToken] = useState(''); // For dev display only

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setDevToken('');
        setIsLoading(true);

        try {
            // Hardcoded URL for debugging
            const response = await fetch('http://localhost/Yoga_Web/Yoga_Backend/auth/forgotPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage('Reset token generated successfully.');
                if (data.dev_token) {
                    setDevToken(data.dev_token);
                }
            } else {
                setError(data.error || 'Failed to generate reset token.');
            }
        } catch (err) {
            setError('Network error. Please try again.');
            console.error('Forgot password error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <img src={logo} alt="Edvayu Logo" className="logo" />
                    <h1>Reset Password</h1>
                    <p>Enter your username to receive a reset token</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && (
                        <div className="error-message visible">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="p-3 text-sm text-green-600 bg-green-50 rounded-lg border border-green-100 mb-4 text-center">
                            {successMessage}
                        </div>
                    )}

                    {devToken && (
                        <div className="p-3 text-xs bg-gray-100 border border-gray-300 rounded mb-4 break-all">
                            <strong>Dev Token (Copy this):</strong><br />
                            {devToken}
                            <div className="mt-2">
                                <Link to={`/reset-password?token=${devToken}`} className="text-indigo-600 underline">
                                    Click here to Reset
                                </Link>
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <div className="input-wrapper">
                            <span className="input-icon"><User className="h-5 w-5" /></span>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-login"
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                        ) : (
                            <>
                                Get Reset Token
                                <ArrowRight className="ml-2 h-4 w-4 inline" />
                            </>
                        )}
                    </button>
                </form>

                <div className="login-footer">
                    <Link to="/" className="flex items-center justify-center text-sm text-gray-600 hover:text-indigo-600">
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
