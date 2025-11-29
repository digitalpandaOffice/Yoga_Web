<?php
namespace App\Models;

use Core\Model;
use PDO;

class Result extends Model {
    public function getAll() {
        $stmt = $this->conn->query("SELECT * FROM results ORDER BY created_at DESC");
        return $stmt->fetchAll();
    }

    public function getById($id) {
        $stmt = $this->conn->prepare("SELECT * FROM results WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch();
    }

    public function getByRollAndCourse($rollNumber, $courseId, $year) {
        $sql = "SELECT * FROM results WHERE roll_number = :roll_number AND course_id = :course_id AND year = :year";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            ':roll_number' => $rollNumber,
            ':course_id' => $courseId,
            ':year' => $year
        ]);
        return $stmt->fetch();
    }

    public function create($data) {
        $sql = "INSERT INTO results (student_name, roll_number, course_id, year, marks_data, total_marks, obtained_marks, percentage, grade, status) 
                VALUES (:student_name, :roll_number, :course_id, :year, :marks_data, :total_marks, :obtained_marks, :percentage, :grade, :status)";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute($data);
    }

    public function update($id, $data) {
        $sql = "UPDATE results SET 
                student_name = :student_name, 
                roll_number = :roll_number, 
                course_id = :course_id, 
                year = :year, 
                marks_data = :marks_data, 
                total_marks = :total_marks, 
                obtained_marks = :obtained_marks, 
                percentage = :percentage, 
                grade = :grade, 
                status = :status
                WHERE id = :id";
        $data['id'] = $id;
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute($data);
    }

    public function delete($id) {
        $stmt = $this->conn->prepare("DELETE FROM results WHERE id = :id");
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}
