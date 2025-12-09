<?php
namespace App\Models;

use Core\Model;
use PDO;

class Policy extends Model {
    protected $table = 'policies';

    public function getAll() {
        $stmt = $this->conn->prepare("SELECT * FROM {$this->table} ORDER BY id ASC");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getById($id) {
        $stmt = $this->conn->prepare("SELECT * FROM {$this->table} WHERE id = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($data) {
        $sql = "INSERT INTO {$this->table} (title, content, last_updated) 
                VALUES (:title, :content, CURRENT_DATE)";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
            'title' => $data['title'],
            'content' => $data['content']
        ]);
    }

    public function update($id, $data) {
        $sql = "UPDATE {$this->table} SET 
                title = :title, 
                content = :content,
                last_updated = CURRENT_DATE 
                WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
            'id' => $id,
            'title' => $data['title'],
            'content' => $data['content']
        ]);
    }

    public function delete($id) {
        $stmt = $this->conn->prepare("DELETE FROM {$this->table} WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }
}
