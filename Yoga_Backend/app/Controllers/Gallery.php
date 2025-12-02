<?php
namespace App\Controllers;

use Core\Controller;

class Gallery extends Controller {
    
    // GET /Gallery
    public function index() {
        $model = $this->model('Gallery');
        $this->json($model->getAll());
    }

    // POST /Gallery/create
    public function create() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->json(['error' => 'Method not allowed'], 405);
        }

        $title = $_POST['title'] ?? '';
        $category = $_POST['category'] ?? 'General';
        
        if (!isset($_FILES['image'])) {
            $this->json(['error' => 'Image required'], 400);
        }

        $file = $_FILES['image'];
        $uploadDir = __DIR__ . '/../../public/uploads/gallery/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

        $fileName = time() . '_' . basename($file['name']);
        $targetPath = $uploadDir . $fileName;

        if (move_uploaded_file($file['tmp_name'], $targetPath)) {
            $imageUrl = 'http://localhost/Yoga_Web/Yoga_Backend/public/uploads/gallery/' . $fileName;
            
            $model = $this->model('Gallery');
            if ($model->create([
                'title' => $title,
                'category' => $category,
                'image_url' => $imageUrl
            ])) {
                $this->json(['message' => 'Image uploaded successfully']);
            } else {
                $this->json(['error' => 'Database error'], 500);
            }
        } else {
            $this->json(['error' => 'File upload failed'], 500);
        }
    }

    // POST /Gallery/delete?id=1
    public function delete() {
        $id = $_GET['id'] ?? null;
        if (!$id) {
            $this->json(['error' => 'ID required'], 400);
        }

        $model = $this->model('Gallery');
        if ($model->delete($id)) {
            $this->json(['message' => 'Deleted successfully']);
        } else {
            $this->json(['error' => 'Failed to delete'], 500);
        }
    }
}
