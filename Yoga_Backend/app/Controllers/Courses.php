<?php
namespace App\Controllers;

use Core\Controller;

class Courses extends Controller {
    private $courseModel;

    public function __construct() {
        $this->courseModel = $this->model('Course');
    }

    public function index() {
        $courses = $this->courseModel->getAll();
        $this->json($courses);
    }

    public function show($id) {
        $course = $this->courseModel->getById($id);
        if ($course) {
            $this->json($course);
        } else {
            $this->json(['error' => 'Course not found'], 404);
        }
    }

    public function create() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->json(['error' => 'Method not allowed'], 405);
        }

        $data = json_decode(file_get_contents("php://input"), true);
        
        // Basic validation
        if (empty($data['title']) || empty($data['category'])) {
            $this->json(['error' => 'Missing required fields'], 400);
        }

        if ($this->courseModel->create($data)) {
            $this->json(['message' => 'Course created successfully']);
        } else {
            $this->json(['error' => 'Failed to create course'], 500);
        }
    }
    
    // Add update and delete methods similarly...
}
