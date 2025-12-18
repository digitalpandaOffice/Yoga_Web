<?php
namespace App\Models;

use Core\Model;
use PDO;

class User extends Model {
    public function getByUsername($username) {
        $stmt = $this->conn->prepare("SELECT id, username, email FROM admins WHERE username = :username");
        $stmt->bindParam(':username', $username);
        $stmt->execute();
        return $stmt->fetch();
    }

    public function setOTP($username, $otp) {
        $expires = date('Y-m-d H:i:s', strtotime('+10 minutes'));
        $stmt = $this->conn->prepare("UPDATE admins SET otp_code = :otp, otp_expires = :expires WHERE username = :username");
        $stmt->bindParam(':otp', $otp);
        $stmt->bindParam(':expires', $expires);
        $stmt->bindParam(':username', $username);
        return $stmt->execute();
    }

    public function verifyOTP($username, $otp) {
        $stmt = $this->conn->prepare("SELECT * FROM admins WHERE username = :username AND otp_code = :otp AND otp_expires > NOW()");
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':otp', $otp);
        $stmt->execute();
        $user = $stmt->fetch();
        
        if ($user) {
            // Clear OTP after successful verification
            $this->conn->prepare("UPDATE admins SET otp_code = NULL, otp_expires = NULL WHERE username = :username")
                 ->execute([':username' => $username]);
            
            unset($user['password']);
            unset($user['otp_code']);
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
