<?php
namespace App\Controllers;

use Core\Controller;

class Results extends Controller {
    
    // GET /results
    public function index() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->json(['error' => 'Method not allowed'], 405);
        }

        $resultModel = $this->model('Result');
        $results = $resultModel->getAll();
        $this->json($results);
    }

    // POST /results/create
    public function create() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->json(['error' => 'Method not allowed'], 405);
        }

        $input = json_decode(file_get_contents("php://input"), true);
        
        // Basic Validation
        if (empty($input['student_name']) || empty($input['roll_number']) || empty($input['course_id']) || empty($input['year'])) {
            $this->json(['error' => 'Missing required fields'], 400);
        }

        // Calculate totals if not provided
        $marksData = $input['marks_data'] ?? []; // Array of {subject, marks, max_marks}
        $totalMarks = 0;
        $obtainedMarks = 0;
        
        if (is_array($marksData)) {
            foreach ($marksData as $subject) {
                $totalMarks += $subject['max_marks'] ?? 100;
                $obtainedMarks += $subject['marks'] ?? 0;
            }
        }

        $percentage = ($totalMarks > 0) ? ($obtainedMarks / $totalMarks) * 100 : 0;
        $status = ($percentage >= 40) ? 'PASS' : 'FAIL'; // Simple logic, can be customized
        $grade = $this->calculateGrade($percentage);

        $data = [
            'student_name' => $input['student_name'],
            'roll_number' => $input['roll_number'],
            'course_id' => $input['course_id'],
            'year' => $input['year'],
            'marks_data' => json_encode($marksData),
            'total_marks' => $totalMarks,
            'obtained_marks' => $obtainedMarks,
            'percentage' => $percentage,
            'grade' => $grade,
            'status' => $status
        ];

        $resultModel = $this->model('Result');
        try {
            if ($resultModel->create($data)) {
                $this->json(['message' => 'Result created successfully']);
            } else {
                $this->json(['error' => 'Failed to create result'], 500);
            }
        } catch (\PDOException $e) {
            if ($e->getCode() == 23000) { // Duplicate entry
                $this->json(['error' => 'Result already exists for this student/course/year'], 409);
            } else {
                $this->json(['error' => $e->getMessage()], 500);
            }
        }
    }

    // POST /results/delete?id=1
    public function delete() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->json(['error' => 'Method not allowed'], 405);
        }

        $id = $_GET['id'] ?? null;
        if (!$id) {
            $this->json(['error' => 'Missing ID'], 400);
        }

        $resultModel = $this->model('Result');
        if ($resultModel->delete($id)) {
            $this->json(['message' => 'Result deleted successfully']);
        } else {
            $this->json(['error' => 'Failed to delete result'], 500);
        }
    }

    // POST /results/check (Public Endpoint)
    public function check() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->json(['error' => 'Method not allowed'], 405);
        }

        $input = json_decode(file_get_contents("php://input"), true);
        
        $rollNumber = $input['roll_number'] ?? '';
        $courseId = $input['course_id'] ?? '';
        $year = $input['year'] ?? '';

        if (empty($rollNumber) || empty($courseId) || empty($year)) {
            $this->json(['error' => 'Please provide Roll Number, Course, and Year'], 400);
        }

        $resultModel = $this->model('Result');
        $result = $resultModel->getByRollAndCourse($rollNumber, $courseId, $year);

        if ($result) {
            // Decode JSON marks data for the frontend
            $result['marks_data'] = json_decode($result['marks_data'], true);
            $this->json($result);
        } else {
            $this->json(['error' => 'Result not found'], 404);
        }
    }

    private function calculateGrade($percentage) {
        if ($percentage >= 80) return 'A+';
        if ($percentage >= 70) return 'A';
        if ($percentage >= 60) return 'B';
        if ($percentage >= 50) return 'C';
        if ($percentage >= 40) return 'D';
        return 'F';
    }
}
