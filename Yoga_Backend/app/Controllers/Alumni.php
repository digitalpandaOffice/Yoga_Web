<?php
namespace App\Controllers;

use Core\Controller;

class Alumni extends Controller {
    
    public function index() {
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $model = $this->model('Alumni');
            $this->json($model->getAll());
        } else {
             $this->json(['error' => 'Method not allowed'], 405);
        }
    }

    public function create() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            if (empty($data['name']) || empty($data['batch_year'])) {
                $this->json(['error' => 'Name and Batch Year are required'], 400);
            }

            $model = $this->model('Alumni');
            if ($model->create($data)) {
                $this->json(['message' => 'Alumni profile created successfully']);
            } else {
                $this->json(['error' => 'Failed to create alumni profile'], 500);
            }
        }
    }

    public function update($id = null) {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
             if (!$id) {
                $this->json(['error' => 'ID required'], 400);
            }

            $data = json_decode(file_get_contents("php://input"), true);
            $model = $this->model('Alumni');
            if ($model->update($id, $data)) {
                $this->json(['message' => 'Alumni profile updated successfully']);
            } else {
                $this->json(['error' => 'Failed to update alumni profile'], 500);
            }
        }
    }

    public function delete($id = null) {
        if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'DELETE') {
            if (!$id) {
                $this->json(['error' => 'ID required'], 400);
            }
            $model = $this->model('Alumni');
            if ($model->delete($id)) {
                $this->json(['message' => 'Alumni profile deleted successfully']);
            } else {
                $this->json(['error' => 'Failed to delete alumni profile'], 500);
            }
        }
    }
}
