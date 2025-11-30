<?php
namespace App\Models;

use Core\Model;
use PDO;

class AdmitCard extends Model {
    public function getAll() {
        $stmt = $this->conn->query("SELECT * FROM admit_cards ORDER BY created_at DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create($data) {
        $stmt = $this->conn->prepare("INSERT INTO admit_cards (student_name, father_name, registration_number, roll_number, dob, course_name, exam_session, exam_center, student_photo, subjects) VALUES (:student_name, :father_name, :registration_number, :roll_number, :dob, :course_name, :exam_session, :exam_center, :student_photo, :subjects)");
        return $stmt->execute([
            ':student_name' => $data['student_name'],
            ':father_name' => $data['father_name'],
            ':registration_number' => $data['registration_number'],
            ':roll_number' => $data['roll_number'],
            ':dob' => $data['dob'],
            ':course_name' => $data['course_name'],
            ':exam_session' => $data['exam_session'],
            ':exam_center' => $data['exam_center'],
            ':student_photo' => $data['student_photo'],
            ':subjects' => $data['subjects']
        ]);
    }

    public function update($id, $data) {
        $sql = "UPDATE admit_cards SET 
            student_name = :student_name,
            father_name = :father_name,
            registration_number = :registration_number,
            roll_number = :roll_number,
            dob = :dob,
            course_name = :course_name,
            exam_session = :exam_session,
            exam_center = :exam_center,
            subjects = :subjects";
        
        $params = [
            ':id' => $id,
            ':student_name' => $data['student_name'],
            ':father_name' => $data['father_name'],
            ':registration_number' => $data['registration_number'],
            ':roll_number' => $data['roll_number'],
            ':dob' => $data['dob'],
            ':course_name' => $data['course_name'],
            ':exam_session' => $data['exam_session'],
            ':exam_center' => $data['exam_center'],
            ':subjects' => $data['subjects']
        ];

        if (!empty($data['student_photo'])) {
            $sql .= ", student_photo = :student_photo";
            $params[':student_photo'] = $data['student_photo'];
        }

        $sql .= " WHERE id = :id";
        
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute($params);
    }

    public function delete($id) {
        $stmt = $this->conn->prepare("DELETE FROM admit_cards WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }

    public function search($regNum, $dob) {
        $stmt = $this->conn->prepare("SELECT * FROM admit_cards WHERE LOWER(registration_number) = LOWER(:regNum) AND dob = :dob");
        $stmt->execute([':regNum' => $regNum, ':dob' => $dob]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
