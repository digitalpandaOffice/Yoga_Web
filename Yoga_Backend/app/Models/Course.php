<?php
namespace App\Models;

use Core\Model;
use PDO;

class Course extends Model {
    public function getAll() {
        $stmt = $this->conn->query("SELECT * FROM courses ORDER BY created_at DESC");
        return $stmt->fetchAll();
    }

    public function getById($id) {
        $stmt = $this->conn->prepare("SELECT * FROM courses WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch();
    }

    public function create($data) {
        $sql = "INSERT INTO courses (title, category, level, duration, mode, description, image_url) 
                VALUES (:title, :category, :level, :duration, :mode, :description, :image_url)";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute($data);
    }

    public function update($id, $data) {
        $sql = "UPDATE courses SET title = :title, category = :category, level = :level, 
                duration = :duration, mode = :mode, description = :description, image_url = :image_url 
                WHERE id = :id";
        $data['id'] = $id;
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute($data);
    }

    public function delete($id) {
        $stmt = $this->conn->prepare("DELETE FROM courses WHERE id = :id");
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}
