<?php
namespace App\Controllers;

use Core\Controller;

class Resources extends Controller {
    
    // GET /resources
    public function index() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->json(['error' => 'Method not allowed'], 405);
        }

        $resourceModel = $this->model('Resource');
        $resources = $resourceModel->getAll();
        $this->json($resources);
    }

    // POST /resources/create
    public function create() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->json(['error' => 'Method not allowed'], 405);
        }

        $input = json_decode(file_get_contents("php://input"), true);
        
        if (empty($input['title']) || empty($input['category']) || empty($input['file_url'])) {
            $this->json(['error' => 'Missing required fields'], 400);
        }

        $data = [
            'title' => $input['title'],
            'description' => $input['description'] ?? '',
            'category' => $input['category'],
            'file_url' => $input['file_url'],
            'file_type' => $input['file_type'] ?? 'Unknown',
            'file_size' => $input['file_size'] ?? 'Unknown'
        ];

        $resourceModel = $this->model('Resource');
        if ($resourceModel->create($data)) {
            $this->json(['message' => 'Resource created successfully']);
        } else {
            $this->json(['error' => 'Failed to create resource'], 500);
        }
    }

    // POST /resources/delete?id=1
    public function delete() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->json(['error' => 'Method not allowed'], 405);
        }

        $id = $_GET['id'] ?? null;
        if (!$id) {
            $this->json(['error' => 'Missing ID'], 400);
        }

        $resourceModel = $this->model('Resource');
        if ($resourceModel->delete($id)) {
            $this->json(['message' => 'Resource deleted successfully']);
        } else {
            $this->json(['error' => 'Failed to delete resource'], 500);
        }
    }
}
