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
}
