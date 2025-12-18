<?php
namespace App\Controllers;

use Core\Controller;

class Auth extends Controller {
    public function login() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->json(['error' => 'Method not allowed'], 405);
        }

        $data = json_decode(file_get_contents("php://input"));
        $userModel = $this->model('User');

        // Step 2: Verify OTP
        if (isset($data->otp)) {
            if (!isset($data->username)) {
                $this->json(['error' => 'Username required for OTP verification'], 400);
            }
            $user = $userModel->verifyOTP($data->username, $data->otp);
            if ($user) {
                $this->json([
                    'status' => 'success',
                    'message' => 'Login successful',
                    'user' => $user,
                    'token' => bin2hex(random_bytes(32))
                ]);
            } else {
                $this->json(['error' => 'Invalid or expired OTP'], 401);
            }
            return;
        }

        // Step 1: Initial Login (Password Check)
        if (!isset($data->username) || !isset($data->password)) {
            $this->json(['error' => 'Missing credentials'], 400);
        }

        // We need the full user record including password hash
        $stmt = $userModel->getConnection()->prepare("SELECT * FROM admins WHERE username = :username");
        $stmt->execute([':username' => $data->username]);
        $user = $stmt->fetch();

        if ($user && password_verify($data->password, $user['password'])) {
            // Generate 6-digit OTP
            $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            $userModel->setOTP($data->username, $otp);

            // Send Email
            require_once __DIR__ . '/../Config/SMTP.php';
            $smtp = new \App\Config\SMTP();
            
            $subject = "CMS Login OTP - Edvayu";
            $message = "
                <div style='font-family: Arial, sans-serif; padding: 20px; color: #333;'>
                    <h2 style='color: #184a55;'>Login Verification</h2>
                    <p>Your OTP for CMS login is:</p>
                    <div style='background: #f4f6f8; padding: 15px; font-size: 24px; font-weight: bold; letter-spacing: 5px; text-align: center; border-radius: 8px; border: 1px solid #e1e1e1;'>
                        $otp
                    </div>
                    <p style='margin-top: 20px; font-size: 14px; color: #666;'>This code will expire in 10 minutes.</p>
                    <p style='font-size: 12px; color: #999;'>If you didn't request this login, please ignore this email.</p>
                </div>
            ";

            if ($smtp->send($user['email'], $subject, $message)) {
                $this->json([
                    'status' => 'otp_required',
                    'message' => 'OTP sent to your registered email',
                    'email_preview' => substr($user['email'], 0, 3) . '***' . strstr($user['email'], '@')
                ]);
            } else {
                $this->json(['error' => 'Failed to send OTP email'], 500);
            }
        } else {
            $this->json(['error' => 'Invalid username or password'], 401);
        }
    }

    public function resendOTP() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->json(['error' => 'Method not allowed'], 405);
        }

        $data = json_decode(file_get_contents("php://input"));
        if (!isset($data->username)) {
            $this->json(['error' => 'Username required'], 400);
        }

        $userModel = $this->model('User');
        $user = $userModel->getByUsername($data->username);

        if ($user) {
            $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            $userModel->setOTP($data->username, $otp);

            require_once __DIR__ . '/../Config/SMTP.php';
            $smtp = new \App\Config\SMTP();
            
            $subject = "CMS Login OTP (Resent) - Edvayu";
            $message = "
                <div style='font-family: Arial, sans-serif; padding: 20px; color: #333;'>
                    <h2 style='color: #184a55;'>Login Verification</h2>
                    <p>Your new OTP for CMS login is:</p>
                    <div style='background: #f4f6f8; padding: 15px; font-size: 24px; font-weight: bold; letter-spacing: 5px; text-align: center; border-radius: 8px; border: 1px solid #e1e1e1;'>
                        $otp
                    </div>
                    <p style='margin-top: 20px; font-size: 14px; color: #666;'>This code will expire in 10 minutes.</p>
                </div>
            ";

            if ($smtp->send($user['email'], $subject, $message)) {
                $this->json(['status' => 'success', 'message' => 'New OTP sent']);
            } else {
                $this->json(['error' => 'Failed to resend OTP'], 500);
            }
        } else {
            $this->json(['error' => 'User not found'], 404);
        }
    }

    public function forgotPassword() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->json(['error' => 'Method not allowed'], 405);
        }

        $data = json_decode(file_get_contents("php://input"));
        if (!isset($data->username)) {
            $this->json(['error' => 'Username required'], 400);
        }

        $token = bin2hex(random_bytes(32));
        $userModel = $this->model('User');
        
        // We assume the user exists for security (don't reveal existence)
        // But for this dev environment, we'll return the token if successful
        if ($userModel->setResetToken($data->username, $token)) {
            // In production, SEND EMAIL here.
            // For DEV, we return the token.
            $this->json([
                'message' => 'Reset token generated',
                'dev_token' => $token // REMOVE IN PRODUCTION
            ]);
        } else {
            $this->json(['error' => 'Failed to process request'], 500);
        }
    }

    public function resetPassword() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->json(['error' => 'Method not allowed'], 405);
        }

        $data = json_decode(file_get_contents("php://input"));
        if (!isset($data->token) || !isset($data->new_password)) {
            $this->json(['error' => 'Token and new password required'], 400);
        }

        $userModel = $this->model('User');
        if ($userModel->resetPassword($data->token, $data->new_password)) {
            $this->json(['message' => 'Password updated successfully']);
        } else {
            $this->json(['error' => 'Invalid or expired token'], 400);
        }
    }
}
