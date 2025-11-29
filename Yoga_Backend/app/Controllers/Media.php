<?php
namespace App\Controllers;

use Core\Controller;

class Media extends Controller {
    
    // GET /media
    public function index() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->json(['error' => 'Method not allowed'], 405);
        }

        $uploadDir = __DIR__ . '/../../public/uploads/';
        $files = [];

        if (is_dir($uploadDir)) {
            $scannedFiles = scandir($uploadDir);
            foreach ($scannedFiles as $file) {
                if ($file !== '.' && $file !== '..') {
                    $filePath = $uploadDir . $file;
                    $files[] = [
                        'id' => md5($file), // Generate a unique ID based on filename
                        'name' => $file,
                        'type' => $this->getFileType($file),
                        'size' => $this->formatSize(filesize($filePath)),
                        'date' => date("Y-m-d", filemtime($filePath)),
                        'url' => 'http://localhost/Yoga_Web/Yoga_Backend/public/uploads/' . $file
                    ];
                }
            }
        }

        // Sort by date (newest first)
        usort($files, function($a, $b) {
            return strtotime($b['date']) - strtotime($a['date']);
        });

        $this->json($files);
    }

    // POST /media/upload
    public function upload() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->json(['error' => 'Method not allowed'], 405);
        }

        if (!isset($_FILES['file'])) {
            $this->json(['error' => 'No file uploaded'], 400);
        }

        $file = $_FILES['file'];
        $uploadDir = __DIR__ . '/../../public/uploads/';
        
        // Ensure directory exists
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        // Sanitize filename
        $filename = basename($file['name']);
        $filename = preg_replace("/[^a-zA-Z0-9\._-]/", "_", $filename);
        
        // Prevent overwriting existing files by appending timestamp
        if (file_exists($uploadDir . $filename)) {
            $filename = time() . '_' . $filename;
        }

        $targetPath = $uploadDir . $filename;

        // Validate file type (Basic validation)
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        if (!in_array($file['type'], $allowedTypes)) {
            // Allow if extension matches known types (fallback)
            $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
            $allowedExts = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx'];
            if (!in_array($ext, $allowedExts)) {
                $this->json(['error' => 'File type not allowed'], 400);
            }
        }

        if (move_uploaded_file($file['tmp_name'], $targetPath)) {
            $this->json([
                'message' => 'File uploaded successfully',
                'file' => [
                    'id' => md5($filename),
                    'name' => $filename,
                    'type' => $this->getFileType($filename),
                    'size' => $this->formatSize(filesize($targetPath)),
                    'date' => date("Y-m-d"),
                    'url' => 'http://localhost/Yoga_Web/Yoga_Backend/public/uploads/' . $filename
                ]
            ]);
        } else {
            $this->json(['error' => 'Failed to move uploaded file'], 500);
        }
    }

    // POST /media/delete
    public function delete() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->json(['error' => 'Method not allowed'], 405);
        }

        $input = json_decode(file_get_contents("php://input"), true);
        $filename = $input['filename'] ?? null;

        if (!$filename) {
            $this->json(['error' => 'Filename is required'], 400);
        }

        // Sanitize filename to prevent directory traversal
        $filename = basename($filename);
        $filePath = __DIR__ . '/../../public/uploads/' . $filename;

        if (file_exists($filePath)) {
            if (unlink($filePath)) {
                $this->json(['message' => 'File deleted successfully']);
            } else {
                $this->json(['error' => 'Failed to delete file'], 500);
            }
        } else {
            $this->json(['error' => 'File not found'], 404);
        }
    }

    private function getFileType($filename) {
        $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        if (in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
            return 'image';
        }
        return 'document';
    }

    private function formatSize($bytes) {
        if ($bytes === 0) return '0 Bytes';
        $k = 1024;
        $sizes = ['Bytes', 'KB', 'MB', 'GB'];
        $i = floor(log($bytes) / log($k));
        return sprintf("%.2f %s", $bytes / pow($k, $i), $sizes[$i]);
    }
}
