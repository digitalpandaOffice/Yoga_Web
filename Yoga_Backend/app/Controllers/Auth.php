<?php
namespace App\Controllers;

use Core\Controller;

class Auth extends Controller {
    public function login() {
        // Only allow POST requests
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->json(['error' => 'Method not allowed'], 405);
        }

        // Get JSON input
        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->username) || !isset($data->password)) {
            $this->json(['error' => 'Missing credentials'], 400);
        }

        $userModel = $this->model('User');
        $user = $userModel->login($data->username, $data->password);

        if ($user) {
            // In a real app, you would generate a JWT token here
            $this->json([
                'message' => 'Login successful',
                'user' => $user,
                'token' => 'dummy_token_for_now' 
            ]);
        } else {
            $this->json(['error' => 'Invalid credentials'], 401);
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
