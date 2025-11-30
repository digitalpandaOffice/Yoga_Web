<?php
namespace App\Models;

use Core\Model;

class Training extends Model {
    public function getAll() {
        // Order by date ascending (upcoming first)
        $stmt = $this->conn->query("SELECT * FROM trainings ORDER BY training_date ASC");
        return $stmt->fetchAll();
    }

    public function create($data) {
        $sql = "INSERT INTO trainings (title, training_date, duration, mode, location, description, tags, registration_link) 
                VALUES (:title, :training_date, :duration, :mode, :location, :description, :tags, :registration_link)";
        $stmt = $this->conn->prepare($sql);
        
        $stmt->bindParam(':title', $data['title']);
        $stmt->bindParam(':training_date', $data['training_date']);
        $stmt->bindParam(':duration', $data['duration']);
        $stmt->bindParam(':mode', $data['mode']);
        $stmt->bindParam(':location', $data['location']);
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':tags', $data['tags']);
        $stmt->bindParam(':registration_link', $data['registration_link']);

        return $stmt->execute();
    }

    public function delete($id) {
        $stmt = $this->conn->prepare("DELETE FROM trainings WHERE id = :id");
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}
