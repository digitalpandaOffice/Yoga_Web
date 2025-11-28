<?php
namespace App\Controllers;

use Core\Controller;

class Content extends Controller {
    private $contentModel;

    public function __construct() {
        $this->contentModel = $this->model('PageContent');
    }

    // GET /api/content/get/{page_slug}
    public function get($pageSlug = '') {
        if (empty($pageSlug)) {
            $this->json(['error' => 'Page slug required'], 400);
        }

        $content = $this->contentModel->getByPage($pageSlug);
        
        // Format as key-value pairs
        $formatted = [];
        foreach ($content as $item) {
            $formatted[$item['section_key']] = [
                'text' => $item['content_value'],
                'image' => $item['image_url']
            ];
        }
        
        $this->json($formatted);
    }

    // POST /api/content/update
    public function update() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->json(['error' => 'Method not allowed'], 405);
        }

        $data = json_decode(file_get_contents("php://input"), true);
        
        if (empty($data['page_slug']) || empty($data['sections'])) {
            $this->json(['error' => 'Missing required fields'], 400);
        }

        $pageSlug = $data['page_slug'];
        $sections = $data['sections']; // Array of key => {text, image}

        $successCount = 0;
        foreach ($sections as $key => $values) {
            $text = isset($values['text']) ? $values['text'] : '';
            $image = isset($values['image']) ? $values['image'] : null;
            
            if ($this->contentModel->updateSection($pageSlug, $key, $text, $image)) {
                $successCount++;
            }
        }

        $this->json(['message' => "Updated $successCount sections for $pageSlug"]);
    }
}
