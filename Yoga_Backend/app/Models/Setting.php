<?php
namespace App\Models;

use Core\Model;
use PDO;

class Setting extends Model {
    public function getAll() {
        $stmt = $this->conn->query("SELECT * FROM site_settings");
        return $stmt->fetchAll();
    }

    public function getByKey($key) {
        $stmt = $this->conn->prepare("SELECT * FROM site_settings WHERE setting_key = :key");
        $stmt->bindParam(':key', $key);
        $stmt->execute();
        return $stmt->fetch();
    }

    public function update($key, $value) {
        // Check if exists first
        if ($this->getByKey($key)) {
            $sql = "UPDATE site_settings SET setting_value = :value WHERE setting_key = :key";
        } else {
            $sql = "INSERT INTO site_settings (setting_key, setting_value) VALUES (:key, :value)";
        }
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':key', $key);
        $stmt->bindParam(':value', $value);
        return $stmt->execute();
    }
}
