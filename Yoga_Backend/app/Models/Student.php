<?php
namespace App\Models;

use Core\Model;
use PDO;

class Student extends Model {
    public function enroll($data) {
        // Generate Student ID: ST-YYYY-XXXX
        $year = date('Y');
        
        // Get last student ID for current year to increment
        $stmt = $this->conn->prepare("SELECT student_id FROM enrolled_students WHERE student_id LIKE :prefix ORDER BY id DESC LIMIT 1");
        $stmt->execute([':prefix' => "ST-$year-%"]);
        $lastId = $stmt->fetchColumn();

        if ($lastId) {
            $num = intval(substr($lastId, strrpos($lastId, '-') + 1)) + 1;
        } else {
            $num = 1;
        }
        
        $studentId = sprintf("ST-%s-%04d", $year, $num);

        $sql = "INSERT INTO enrolled_students (student_id, admission_id, name, email, phone, course, batch, joining_date, status) 
                VALUES (:student_id, :admission_id, :name, :email, :phone, :course, :batch, :joining_date, 'Active')";
        
        $stmt = $this->conn->prepare($sql);
        $result = $stmt->execute([
            ':student_id' => $studentId,
            ':admission_id' => $data['admission_id'],
            ':name' => $data['name'],
            ':email' => $data['email'],
            ':phone' => $data['phone'],
            ':course' => $data['course'],
            ':batch' => $data['batch'],
            ':joining_date' => date('Y-m-d')
        ]);

        return $result ? $studentId : false;
    }

    public function getAll() {
        $stmt = $this->conn->prepare("SELECT * FROM enrolled_students ORDER BY id DESC");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
