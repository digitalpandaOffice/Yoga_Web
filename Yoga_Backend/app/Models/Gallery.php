<?php
namespace App\Models;

use Core\Model;
use PDO;

class Gallery extends Model {
    public function getAll() {
        $stmt = $this->conn->query("SELECT * FROM gallery_images ORDER BY created_at DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create($data) {
        $stmt = $this->conn->prepare("INSERT INTO gallery_images (title, category, image_url) VALUES (:title, :category, :image_url)");
        return $stmt->execute([
            ':title' => $data['title'],
            ':category' => $data['category'],
            ':image_url' => $data['image_url']
        ]);
    }

    public function delete($id) {
        $stmt = $this->conn->prepare("DELETE FROM gallery_images WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }
}
