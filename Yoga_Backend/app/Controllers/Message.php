<?php
namespace App\Controllers;

use Core\Controller;

class Message extends Controller {
    
    // GET /message
    public function index() {
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $model = $this->model('Message');
            $this->json($model->getAll());
        } else {
             $this->json(['error' => 'Method not allowed'], 405);
        }
    }

    // POST /message/submit
    public function submit() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            
            // Basic validation
            if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
                 $this->json(['error' => 'Name, Email and Message are required'], 400);
            }

            $model = $this->model('Message');
            if ($model->create($data)) {
                $this->json(['message' => 'Message sent successfully']);
            } else {
                $this->json(['error' => 'Failed to send message'], 500);
            }
        }
    }

    // POST /message/delete
    public function delete() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = $_GET['id'] ?? null;
            if (!$id) {
                $this->json(['error' => 'ID required'], 400);
            }
            $model = $this->model('Message');
            if ($model->delete($id)) {
                $this->json(['message' => 'Message deleted successfully']);
            } else {
                $this->json(['error' => 'Failed to delete message'], 500);
            }
        }
    }
}
