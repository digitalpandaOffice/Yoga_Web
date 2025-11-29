<?php
namespace App\Models;

use Core\Model;
use PDO;

class Resource extends Model {
    public function getAll() {
        $stmt = $this->conn->query("SELECT * FROM resources ORDER BY created_at DESC");
        return $stmt->fetchAll();
    }

    public function create($data) {
        $sql = "INSERT INTO resources (title, description, category, file_url, file_type, file_size) 
                VALUES (:title, :description, :category, :file_url, :file_type, :file_size)";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute($data);
    }

    public function delete($id) {
        $stmt = $this->conn->prepare("DELETE FROM resources WHERE id = :id");
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}
