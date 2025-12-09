<?php
namespace App\Controllers;

use Core\Controller;

class Policy extends Controller {
    
    public function index() {
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $model = $this->model('Policy');
            $this->json($model->getAll());
        } else {
             $this->json(['error' => 'Method not allowed'], 405);
        }
    }

    public function create() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            if (empty($data['title']) || empty($data['content'])) {
                $this->json(['error' => 'Title and Content are required'], 400);
            }

            $model = $this->model('Policy');
            if ($model->create($data)) {
                $this->json(['message' => 'Policy created successfully']);
            } else {
                $this->json(['error' => 'Failed to create policy'], 500);
            }
        }
    }

    public function update($id = null) {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
             if (!$id) {
                $this->json(['error' => 'ID required'], 400);
            }

            $data = json_decode(file_get_contents("php://input"), true);
            $model = $this->model('Policy');
            if ($model->update($id, $data)) {
                $this->json(['message' => 'Policy updated successfully']);
            } else {
                $this->json(['error' => 'Failed to update policy'], 500);
            }
        }
    }

    public function delete($id = null) {
        if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'DELETE') {
            if (!$id) {
                $this->json(['error' => 'ID required'], 400);
            }
            $model = $this->model('Policy');
            if ($model->delete($id)) {
                $this->json(['message' => 'Policy deleted successfully']);
            } else {
                $this->json(['error' => 'Failed to delete policy'], 500);
            }
        }
    }
}
