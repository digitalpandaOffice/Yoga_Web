<?php
namespace App\Models;

use Core\Model;

class TeacherResource extends Model {
    public function getAll() {
        $stmt = $this->conn->query("SELECT * FROM teacher_resources ORDER BY created_at DESC");
        return $stmt->fetchAll();
    }

    public function create($data) {
        $sql = "INSERT INTO teacher_resources (title, description, category, file_url, file_type, file_size) 
                VALUES (:title, :description, :category, :file_url, :file_type, :file_size)";
        $stmt = $this->conn->prepare($sql);
        
        $stmt->bindParam(':title', $data['title']);
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':category', $data['category']);
        $stmt->bindParam(':file_url', $data['file_url']);
        $stmt->bindParam(':file_type', $data['file_type']);
        $stmt->bindParam(':file_size', $data['file_size']);

        return $stmt->execute();
    }

    public function delete($id) {
        $stmt = $this->conn->prepare("DELETE FROM teacher_resources WHERE id = :id");
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}
