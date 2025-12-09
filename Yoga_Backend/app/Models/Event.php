<?php
namespace App\Models;

use Core\Model;
use PDO;

class Event extends Model {
    protected $table = 'events';

    public function getAll() {
        $stmt = $this->conn->prepare("SELECT * FROM {$this->table} ORDER BY event_date DESC");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getById($id) {
        $stmt = $this->conn->prepare("SELECT * FROM {$this->table} WHERE id = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($data) {
        $sql = "INSERT INTO {$this->table} (title, event_date, location, description, image_url, type) 
                VALUES (:title, :event_date, :location, :description, :image_url, :type)";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
            'title' => $data['title'],
            'event_date' => $data['event_date'],
            'location' => $data['location'] ?? '',
            'description' => $data['description'] ?? '',
            'image_url' => $data['image_url'] ?? '',
            'type' => $data['type'] ?? 'other'
        ]);
    }

    public function update($id, $data) {
        $sql = "UPDATE {$this->table} SET 
                title = :title, 
                event_date = :event_date, 
                location = :location, 
                description = :description, 
                image_url = :image_url, 
                type = :type 
                WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
            'id' => $id,
            'title' => $data['title'],
            'event_date' => $data['event_date'],
            'location' => $data['location'] ?? '',
            'description' => $data['description'] ?? '',
            'image_url' => $data['image_url'] ?? '',
            'type' => $data['type'] ?? 'other'
        ]);
    }

    public function delete($id) {
        $stmt = $this->conn->prepare("DELETE FROM {$this->table} WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }
}
