<?php
namespace App\Controllers;

use Core\Controller;

class ExamDates extends Controller {
    
    // GET /exam-dates
    public function index() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->json(['error' => 'Method not allowed'], 405);
        }

        $model = $this->model('ExamDate');
        $data = $model->getAll();
        $this->json($data);
    }

    // POST /exam-dates/save
    public function save() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->json(['error' => 'Method not allowed'], 405);
        }

        $input = json_decode(file_get_contents("php://input"), true);
        
        if (empty($input['course_name'])) {
            $this->json(['error' => 'Course Name is required'], 400);
        }

        $data = [
            'id' => $input['id'] ?? null,
            'course_name' => $input['course_name'],
            'icon' => $input['icon'] ?? '📅',
            'description' => $input['description'] ?? '',
            'batches_data' => $input['batches_data'] ?? []
        ];

        $model = $this->model('ExamDate');
        if ($model->save($data)) {
            $this->json(['message' => 'Schedule saved successfully']);
        } else {
            $this->json(['error' => 'Failed to save schedule'], 500);
        }
    }

    // POST /exam-dates/delete?id=1
    public function delete() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->json(['error' => 'Method not allowed'], 405);
        }

        $id = $_GET['id'] ?? null;
        if (!$id) {
            $this->json(['error' => 'Missing ID'], 400);
        }

        $model = $this->model('ExamDate');
        if ($model->delete($id)) {
            $this->json(['message' => 'Schedule deleted successfully']);
        } else {
            $this->json(['error' => 'Failed to delete schedule'], 500);
        }
    }
}
