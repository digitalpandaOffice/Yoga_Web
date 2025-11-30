<?php
namespace App\Controllers;

use Core\Controller;

class AdmitCards extends Controller {
    
    // GET /AdmitCards
    public function index() {
        $model = $this->model('AdmitCard');
        $this->json($model->getAll());
    }

    // POST /AdmitCards/create
    public function create() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->json(['error' => 'Method not allowed'], 405);
        }

        $studentName = $_POST['student_name'] ?? '';
        $fatherName = $_POST['father_name'] ?? '';
        $regNum = $_POST['registration_number'] ?? '';
        $rollNum = $_POST['roll_number'] ?? '';
        $dob = $_POST['dob'] ?? '';
        $course = $_POST['course_name'] ?? '';
        $session = $_POST['exam_session'] ?? '';
        $center = $_POST['exam_center'] ?? '';
        $subjects = $_POST['subjects'] ?? '[]';

        if (!$studentName || !$regNum || !$dob || !isset($_FILES['photo'])) {
            $this->json(['error' => 'Missing required fields'], 400);
        }

        // Handle Photo Upload
        $file = $_FILES['photo'];
        $uploadDir = __DIR__ . '/../../public/uploads/student_photos/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

        $fileName = time() . '_' . basename($file['name']);
        $targetPath = $uploadDir . $fileName;

        if (move_uploaded_file($file['tmp_name'], $targetPath)) {
            $baseUrl = 'http://localhost/Yoga_Web/Yoga_Backend/public/uploads/student_photos/';
            $photoUrl = $baseUrl . $fileName;
            
            $model = $this->model('AdmitCard');
            try {
                if ($model->create([
                    'student_name' => $studentName,
                    'father_name' => $fatherName,
                    'registration_number' => $regNum,
                    'roll_number' => $rollNum,
                    'dob' => $dob,
                    'course_name' => $course,
                    'exam_session' => $session,
                    'exam_center' => $center,
                    'student_photo' => $photoUrl,
                    'subjects' => $subjects
                ])) {
                    $this->json(['message' => 'Admit card generated successfully']);
                } else {
                    $this->json(['error' => 'Database error'], 500);
                }
            } catch (\Exception $e) {
                $this->json(['error' => 'Duplicate registration number or database error: ' . $e->getMessage()], 500);
            }
        } else {
            $this->json(['error' => 'Photo upload failed'], 500);
        }
    }

    // POST /AdmitCards/update?id=1
    public function update() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->json(['error' => 'Method not allowed'], 405);
        }

        $id = $_GET['id'] ?? null;
        if (!$id) {
            $this->json(['error' => 'ID required'], 400);
        }

        $studentName = $_POST['student_name'] ?? '';
        $fatherName = $_POST['father_name'] ?? '';
        $regNum = $_POST['registration_number'] ?? '';
        $rollNum = $_POST['roll_number'] ?? '';
        $dob = $_POST['dob'] ?? '';
        $course = $_POST['course_name'] ?? '';
        $session = $_POST['exam_session'] ?? '';
        $center = $_POST['exam_center'] ?? '';
        $subjects = $_POST['subjects'] ?? '[]';

        $photoUrl = null;
        if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
            $file = $_FILES['photo'];
            $uploadDir = __DIR__ . '/../../public/uploads/student_photos/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
            $fileName = time() . '_' . basename($file['name']);
            if (move_uploaded_file($file['tmp_name'], $uploadDir . $fileName)) {
                $photoUrl = 'http://localhost/Yoga_Web/Yoga_Backend/public/uploads/student_photos/' . $fileName;
            }
        }

        $model = $this->model('AdmitCard');
        $data = [
            'student_name' => $studentName,
            'father_name' => $fatherName,
            'registration_number' => $regNum,
            'roll_number' => $rollNum,
            'dob' => $dob,
            'course_name' => $course,
            'exam_session' => $session,
            'exam_center' => $center,
            'subjects' => $subjects,
            'student_photo' => $photoUrl
        ];

        if ($model->update($id, $data)) {
            $this->json(['message' => 'Admit card updated successfully']);
        } else {
            $this->json(['error' => 'Failed to update'], 500);
        }
    }

    // POST /AdmitCards/delete?id=1
    public function delete() {
        $id = $_GET['id'] ?? null;
        if (!$id) {
            $this->json(['error' => 'ID required'], 400);
        }

        $model = $this->model('AdmitCard');
        if ($model->delete($id)) {
            $this->json(['message' => 'Deleted successfully']);
        } else {
            $this->json(['error' => 'Failed to delete'], 500);
        }
    }

    // POST /AdmitCards/search
    public function search() {
        $input = json_decode(file_get_contents("php://input"), true);
        $regNum = trim($input['registration_number'] ?? '');
        $dob = trim($input['dob'] ?? '');

        if (!$regNum || !$dob) {
            $this->json(['error' => 'Registration number and DOB required'], 400);
        }

        $model = $this->model('AdmitCard');
        $result = $model->search($regNum, $dob);

        if ($result) {
            $this->json($result);
        } else {
            $this->json([
                'error' => 'Admit card not found',
                'debug_received' => ['reg' => $regNum, 'dob' => $dob]
            ], 404);
        }
    }
}
