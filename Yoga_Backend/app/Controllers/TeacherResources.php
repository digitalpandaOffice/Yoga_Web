<?php
namespace App\Controllers;

use Core\Controller;

class TeacherResources extends Controller {
    
    // GET /teacher-resources
    public function index() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->json(['error' => 'Method not allowed'], 405);
        }

        $model = $this->model('TeacherResource');
        $data = $model->getAll();
        $this->json($data);
    }

    // POST /teacher-resources/create
    public function create() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->json(['error' => 'Method not allowed'], 405);
        }

        $input = json_decode(file_get_contents("php://input"), true);
        
        if (empty($input['title']) || empty($input['file_url'])) {
            $this->json(['error' => 'Title and File are required'], 400);
        }

        $data = [
            'title' => $input['title'],
            'description' => $input['description'] ?? '',
            'category' => $input['category'] ?? 'General',
            'file_url' => $input['file_url'],
            'file_type' => $input['file_type'] ?? 'Unknown',
            'file_size' => $input['file_size'] ?? 'Unknown'
        ];

        $model = $this->model('TeacherResource');
        if ($model->create($data)) {
            $this->json(['message' => 'Resource created successfully']);
        } else {
            $this->json(['error' => 'Failed to create resource'], 500);
        }
    }

    // POST /teacher-resources/delete?id=1
    public function delete() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->json(['error' => 'Method not allowed'], 405);
        }

        $id = $_GET['id'] ?? null;
        if (!$id) {
            $this->json(['error' => 'Missing ID'], 400);
        }

        $model = $this->model('TeacherResource');
        if ($model->delete($id)) {
            $this->json(['message' => 'Resource deleted successfully']);
        } else {
            $this->json(['error' => 'Failed to delete resource'], 500);
        }
    }
}
