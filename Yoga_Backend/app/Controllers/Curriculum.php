<?php
namespace App\Controllers;

use Core\Controller;

class Curriculum extends Controller {
    
    // GET /curriculum
    public function index() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->json(['error' => 'Method not allowed'], 405);
        }

        $model = $this->model('Curriculum');
        $data = $model->getAll();
        
        // Decode JSON levels_data for frontend
        foreach ($data as &$item) {
            $item['levels_data'] = json_decode($item['levels_data'], true);
        }

        $this->json($data);
    }

    // POST /curriculum/save
    public function save() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->json(['error' => 'Method not allowed'], 405);
        }

        $input = json_decode(file_get_contents("php://input"), true);
        
        if (empty($input['discipline_name'])) {
            $this->json(['error' => 'Discipline Name is required'], 400);
        }

        $data = [
            'id' => $input['id'] ?? null,
            'discipline_name' => $input['discipline_name'],
            'icon' => $input['icon'] ?? '📚',
            'full_pdf_url' => $input['full_pdf_url'] ?? '',
            'levels_data' => json_encode($input['levels_data'] ?? [])
        ];

        $model = $this->model('Curriculum');
        if ($model->save($data)) {
            $this->json(['message' => 'Curriculum saved successfully']);
        } else {
            $this->json(['error' => 'Failed to save curriculum'], 500);
        }
    }

    // POST /curriculum/delete?id=1
    public function delete() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->json(['error' => 'Method not allowed'], 405);
        }

        $id = $_GET['id'] ?? null;
        if (!$id) {
            $this->json(['error' => 'Missing ID'], 400);
        }

        $model = $this->model('Curriculum');
        if ($model->delete($id)) {
            $this->json(['message' => 'Curriculum deleted successfully']);
        } else {
            $this->json(['error' => 'Failed to delete curriculum'], 500);
        }
    }
}
