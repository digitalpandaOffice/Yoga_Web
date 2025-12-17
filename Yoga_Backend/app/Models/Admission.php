<?php
namespace App\Models;

use Core\Model;
use PDO;

class Admission extends Model {
    public function create($data) {
        $sql = "INSERT INTO admission_applications (applicant_name, email, phone, course_name, form_data, reference_no) VALUES (:name, :email, :phone, :course, :form_data, :reference_no)";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
            ':name' => $data['applicant_name'],
            ':email' => $data['email'],
            ':phone' => $data['phone'],
            ':course' => $data['course_name'],
            ':form_data' => $data['form_data'],
            ':reference_no' => $data['reference_no']
        ]);
    }

    public function getByRef($refNo) {
        $stmt = $this->conn->prepare("SELECT * FROM admission_applications WHERE reference_no = :refNo");
        $stmt->execute([':refNo' => $refNo]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getById($id) {
        $stmt = $this->conn->prepare("SELECT * FROM admission_applications WHERE id = :id");
        $stmt->execute([':id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getAll() {
        $stmt = $this->conn->prepare("SELECT * FROM admission_applications ORDER BY id DESC");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function updateStatus($id, $status) {
        $stmt = $this->conn->prepare("UPDATE admission_applications SET status = :status WHERE id = :id");
        return $stmt->execute([
            ':status' => $status, 
            ':id' => $id
        ]);
    }
}
