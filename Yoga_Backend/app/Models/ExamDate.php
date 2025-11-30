<?php
namespace App\Models;

use Core\Model;

class ExamDate extends Model {
    public function getAll() {
        $stmt = $this->conn->query("SELECT * FROM exam_schedules ORDER BY created_at DESC");
        $results = $stmt->fetchAll();
        
        // Decode JSON
        foreach ($results as &$row) {
            $row['batches_data'] = json_decode($row['batches_data'], true);
        }
        return $results;
    }

    public function save($data) {
        $batches_json = json_encode($data['batches_data']);

        if (isset($data['id']) && !empty($data['id'])) {
            // Update
            $sql = "UPDATE exam_schedules SET course_name = :course_name, icon = :icon, description = :description, batches_data = :batches_data WHERE id = :id";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':id', $data['id']);
        } else {
            // Insert
            $sql = "INSERT INTO exam_schedules (course_name, icon, description, batches_data) VALUES (:course_name, :icon, :description, :batches_data)";
            $stmt = $this->conn->prepare($sql);
        }

        $stmt->bindParam(':course_name', $data['course_name']);
        $stmt->bindParam(':icon', $data['icon']);
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':batches_data', $batches_json);

        return $stmt->execute();
    }

    public function delete($id) {
        $stmt = $this->conn->prepare("DELETE FROM exam_schedules WHERE id = :id");
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}
