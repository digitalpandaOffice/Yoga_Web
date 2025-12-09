<?php
namespace App\Controllers;

use Core\Controller;

class Event extends Controller {
    
    public function index() {
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $model = $this->model('Event');
            $events = $model->getAll();
            $this->json($events);
        } else {
             $this->json(['error' => 'Method not allowed'], 405);
        }
    }

    public function create() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            if (!$data) {
                $data = $_POST;
            }

            if (empty($data['title']) || empty($data['event_date'])) {
                $this->json(['error' => 'Title and Date are required'], 400);
            }

            $model = $this->model('Event');
            if ($model->create($data)) {
                $this->json(['message' => 'Event created successfully']);
            } else {
                $this->json(['error' => 'Failed to create event'], 500);
            }
        }
    }

    public function update($id = null) {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
             if (!$id) {
                $this->json(['error' => 'ID required'], 400);
            }

            $data = json_decode(file_get_contents("php://input"), true);
             if (!$data) {
                $data = $_POST;
            }

            $model = $this->model('Event');
            if ($model->update($id, $data)) {
                $this->json(['message' => 'Event updated successfully']);
            } else {
                $this->json(['error' => 'Failed to update event'], 500);
            }
        }
    }

    public function delete($id = null) {
        if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'DELETE') {
            if (!$id) {
                $this->json(['error' => 'ID required'], 400);
            }

            $model = $this->model('Event');
            if ($model->delete($id)) {
                $this->json(['message' => 'Event deleted successfully']);
            } else {
                $this->json(['error' => 'Failed to delete event'], 500);
            }
        }
    }
}
