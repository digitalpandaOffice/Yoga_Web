<?php
namespace App\Models;

use Core\Model;
use PDO;

class Curriculum extends Model {
    public function getAll() {
        $stmt = $this->conn->query("SELECT * FROM curriculum ORDER BY created_at DESC");
        return $stmt->fetchAll();
    }

    public function save($data) {
        // If ID is present, update; otherwise insert
        if (!empty($data['id'])) {
            $sql = "UPDATE curriculum SET 
                    discipline_name = :discipline_name, 
                    icon = :icon, 
                    full_pdf_url = :full_pdf_url, 
                    levels_data = :levels_data 
                    WHERE id = :id";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':id', $data['id']);
        } else {
            $sql = "INSERT INTO curriculum (discipline_name, icon, full_pdf_url, levels_data) 
                    VALUES (:discipline_name, :icon, :full_pdf_url, :levels_data)";
            $stmt = $this->conn->prepare($sql);
        }

        $stmt->bindParam(':discipline_name', $data['discipline_name']);
        $stmt->bindParam(':icon', $data['icon']);
        $stmt->bindParam(':full_pdf_url', $data['full_pdf_url']);
        $stmt->bindParam(':levels_data', $data['levels_data']);

        return $stmt->execute();
    }

    public function delete($id) {
        $stmt = $this->conn->prepare("DELETE FROM curriculum WHERE id = :id");
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}
