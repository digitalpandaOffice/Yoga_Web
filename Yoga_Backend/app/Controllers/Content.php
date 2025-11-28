<?php
namespace App\Controllers;

use Core\Controller;

class Content extends Controller {
    
    // GET /content/home
    public function home() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->json(['error' => 'Method not allowed'], 405);
        }

        $contentModel = $this->model('Content');
        $data = $contentModel->getContentByPage('home');

        // Return empty object if no data found (frontend expects objects)
        if (empty($data)) {
            $data = [
                'hero' => [],
                'about' => [],
                'stats' => [],
                'features' => [],
                'values' => [],
                'highlights' => [],
                'footer' => []
            ];
        }

        $this->json($data);
    }

    // POST /content/update
    public function update() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->json(['error' => 'Method not allowed'], 405);
        }

        $input = json_decode(file_get_contents("php://input"), true);
        
        if (!$input) {
            $this->json(['error' => 'Invalid JSON data'], 400);
        }

        $contentModel = $this->model('Content');
        $pageSlug = 'home'; // Defaulting to home for now, can be dynamic later

        $success = true;
        foreach ($input as $sectionKey => $contentValue) {
            if (!$contentModel->updateContent($pageSlug, $sectionKey, $contentValue)) {
                $success = false;
            }
        }

        if ($success) {
            $this->json(['message' => 'Content updated successfully']);
        } else {
            $this->json(['error' => 'Some content failed to update'], 500);
        }
    }
}
