<?php
namespace App\Models;

use Core\Model;
use PDO;

class User extends Model {
    public function login($username, $password) {
        $stmt = $this->conn->prepare("SELECT * FROM admins WHERE username = :username");
        $stmt->bindParam(':username', $username);
        $stmt->execute();
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            unset($user['password']);
            unset($user['reset_token']); // Hide token
            return $user;
        }
        return false;
    }

    public function setResetToken($username, $token) {
        $expires = date('Y-m-d H:i:s', strtotime('+1 hour'));
        $stmt = $this->conn->prepare("UPDATE admins SET reset_token = :token, reset_expires = :expires WHERE username = :username");
        $stmt->bindParam(':token', $token);
        $stmt->bindParam(':expires', $expires);
        $stmt->bindParam(':username', $username);
        return $stmt->execute();
    }

    public function resetPassword($token, $newPassword) {
        // Find user with valid token (Ignoring expiry for now)
        $stmt = $this->conn->prepare("SELECT * FROM admins WHERE reset_token = :token");
        $stmt->bindParam(':token', $token);
        $stmt->execute();
        $user = $stmt->fetch();

        if ($user) {
            $hashed = password_hash($newPassword, PASSWORD_DEFAULT);
            $update = $this->conn->prepare("UPDATE admins SET password = :pass, reset_token = NULL, reset_expires = NULL WHERE id = :id");
            $update->bindParam(':pass', $hashed);
            $update->bindParam(':id', $user['id']);
            return $update->execute();
        }
        return false;
    }
}
