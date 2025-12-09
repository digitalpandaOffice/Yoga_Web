<?php
namespace App\Models;

use Core\Model;
use PDO;

class Alumni extends Model {
    protected $table = 'alumni';

    public function getAll() {
        $stmt = $this->conn->prepare("SELECT * FROM {$this->table} ORDER BY batch_year DESC");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create($data) {
        $sql = "INSERT INTO {$this->table} (name, batch_year, achievement, image_url, testimonial, is_featured) 
                VALUES (:name, :batch_year, :achievement, :image_url, :testimonial, :is_featured)";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
            'name' => $data['name'],
            'batch_year' => $data['batch_year'],
            'achievement' => $data['achievement'] ?? '',
            'image_url' => $data['image_url'] ?? '',
            'testimonial' => $data['testimonial'] ?? '',
            'is_featured' => isset($data['is_featured']) ? (int)$data['is_featured'] : 0
        ]);
    }

    public function update($id, $data) {
        $sql = "UPDATE {$this->table} SET 
                name = :name, 
                batch_year = :batch_year, 
                achievement = :achievement, 
                image_url = :image_url, 
                testimonial = :testimonial,
                is_featured = :is_featured
                WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
            'id' => $id,
            'name' => $data['name'],
            'batch_year' => $data['batch_year'],
            'achievement' => $data['achievement'] ?? '',
            'image_url' => $data['image_url'] ?? '',
            'testimonial' => $data['testimonial'] ?? '',
            'is_featured' => isset($data['is_featured']) ? (int)$data['is_featured'] : 0
        ]);
    }

    public function delete($id) {
        $stmt = $this->conn->prepare("DELETE FROM {$this->table} WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }
}
