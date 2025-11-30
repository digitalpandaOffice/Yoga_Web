<?php
namespace App\Controllers;

use Core\Controller;

class Training extends Controller {
    
    // GET /training
    public function index() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->json(['error' => 'Method not allowed'], 405);
        }

        $model = $this->model('Training');
        $data = $model->getAll();
        $this->json($data);
    }

    // POST /training/create
    public function create() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->json(['error' => 'Method not allowed'], 405);
        }

        $input = json_decode(file_get_contents("php://input"), true);
        
        if (empty($input['title']) || empty($input['training_date'])) {
            $this->json(['error' => 'Title and Date are required'], 400);
        }

        $data = [
            'title' => $input['title'],
            'training_date' => $input['training_date'],
            'duration' => $input['duration'] ?? '',
            'mode' => $input['mode'] ?? 'Offline',
            'location' => $input['location'] ?? '',
            'description' => $input['description'] ?? '',
            'tags' => $input['tags'] ?? '',
            'registration_link' => $input['registration_link'] ?? '#'
        ];

        $model = $this->model('Training');
        if ($model->create($data)) {
            $this->json(['message' => 'Training created successfully']);
        } else {
            $this->json(['error' => 'Failed to create training'], 500);
        }
    }

    // POST /training/delete?id=1
    public function delete() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->json(['error' => 'Method not allowed'], 405);
        }

        $id = $_GET['id'] ?? null;
        if (!$id) {
            $this->json(['error' => 'Missing ID'], 400);
        }

        $model = $this->model('Training');
        if ($model->delete($id)) {
            $this->json(['message' => 'Training deleted successfully']);
        } else {
            $this->json(['error' => 'Failed to delete training'], 500);
        }
    }
}
