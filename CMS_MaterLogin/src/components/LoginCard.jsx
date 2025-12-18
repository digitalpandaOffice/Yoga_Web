import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { endpoints } from '../config';
import logo from '../assets/images/AdvayuLogo.png';

const LoginCard = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loginStep, setLoginStep] = useState('form'); // 'form' or 'otp'
    const [resendTimer, setResendTimer] = useState(0);

    useEffect(() => {
        let interval;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const body = loginStep === 'form'
                ? { username, password }
                : { username, otp };

            const response = await fetch(endpoints.login, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.status === 'otp_required') {
                    setLoginStep('otp');
                    setResendTimer(60); // 1 minute countdown
                } else {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    navigate('/dashboard');
                }
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (resendTimer > 0) return;
        setIsLoading(true);
        try {
            const response = await fetch(endpoints.resendOTP, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            });
            const data = await response.json();
            if (response.ok) {
                setResendTimer(60);
                setError('');
            } else {
                setError(data.error || 'Failed to resend OTP');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <img src={logo} alt="Edvayu Logo" className="logo" />
                    <h1>{loginStep === 'otp' ? 'Verify OTP' : 'CMS Portal'}</h1>
                    <p>{loginStep === 'otp' ? 'Check your registered email' : 'Edvayu Educational Foundations'}</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    {error && (
                        <div className="error-message visible">
                            {error}
                        </div>
                    )}

                    {loginStep === 'form' ? (
                        <>
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

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <div className="input-wrapper">
                                    <span className="input-icon"><Lock className="h-5 w-5" /></span>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="forgot-password-container">
                                <Link to="/forgot-password" size="sm" className="forgot-password-link">
                                    Forgot Password?
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="form-group">
                            <label htmlFor="otp">Enter 6-Digit OTP</label>
                            <div className="input-wrapper">
                                <span className="input-icon"><Lock className="h-5 w-5" /></span>
                                <input
                                    type="text"
                                    id="otp"
                                    value={otp}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                                        setOtp(val);
                                    }}
                                    placeholder="000000"
                                    className="otp-input"
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="otp-actions">
                                <button
                                    type="button"
                                    onClick={() => { setLoginStep('form'); setError(''); }}
                                    className="back-btn"
                                >
                                    Back to Login
                                </button>
                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    disabled={resendTimer > 0 || isLoading}
                                    className="resend-btn"
                                >
                                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                                </button>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-login"
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                        ) : (
                            <>{loginStep === 'otp' ? 'Verify & Login' : 'Sign In'}</>
                        )}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Protected by Edvayu Security Systems</p>
                </div>
            </div>
        </div>
    );
};

export default LoginCard;
