<?php
namespace App\Controllers;

use Core\Controller;

class Franchise extends Controller {
    
    // POST /Franchise/submit
    public function submit() {
        // Enable CORS
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type");
        
        // Handle preflight request
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            return;
        }

        header("Content-Type: application/json");
        
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
             $this->json(['error' => 'Method not allowed'], 405);
             return;
        }

        // Get JSON input
        $input = json_decode(file_get_contents("php://input"), true);
        if (!$input) {
             $this->json(['error' => 'Invalid JSON'], 400);
             return;
        }
        
        $refNo = $input['reference_no'] ?? '';
        $formData = $input['form_data'] ?? [];
        
        // Extract key fields for main columns (handle array vs string if needed)
        // Helper to get string value
        $getVal = function($k) use ($formData) {
            $v = $formData[$k] ?? '';
            return is_array($v) ? implode(', ', $v) : $v;
        };

        $name = $getVal('ownerName');
        $email = $getVal('email');
        $phone = $getVal('mobile');
        $city = $getVal('placeProfile') ?: $getVal('centreAddress'); // simple fallback

        if (!$name || !$email) {
             $this->json(['error' => 'Missing required fields (Name or Email)'], 400);
             return;
        }

        $model = $this->model('Franchise');
        
        try {
            $result = $model->create([
                'applicant_name' => $name,
                'email' => $email,
                'phone' => $phone,
                'city' => substr($city, 0, 50), // Truncate to fit column
                'message' => 'Submitted via Online Form',
                'form_data' => json_encode($formData),
                'reference_no' => $refNo
            ]);

            if ($result) {
                $this->json(['message' => 'Application submitted successfully', 'ref_no' => $refNo]);
            } else {
                $this->json(['error' => 'Database insertion failed'], 500);
            }
        } catch (\Exception $e) {
            $this->json(['error' => 'Server Error: ' . $e->getMessage()], 500);
        }
    }

    // GET /Franchise/get_application_data?ref=EDV-XXX
    public function get_application_data() {
        // Enable CORS
        header("Access-Control-Allow-Origin: *");
        header("Content-Type: application/json");

        $refNo = $_GET['ref'] ?? '';
        if (!$refNo) {
            $this->json(['error' => 'Reference Number required'], 400);
            return;
        }

        $model = $this->model('Franchise');
        $data = $model->getByRef($refNo);

        if ($data) {
            // Check if form_data is JSON string and decode it for the client
            $formData = json_decode($data['form_data'], true);
            $this->json([
                'status' => 'success',
                'application' => [
                    'reference_no' => $data['reference_no'],
                    'applicant_name' => $data['applicant_name'],
                    'submission_date' => $data['submitted_at'], // Assuming timestamp column exists from CREATE TABLE
                    'form_data' => $formData
                ]
            ]);
        } else {
            $this->json(['error' => 'Application not found'], 404);
        }
    }

    // GET /Franchise/get_all
    public function get_all() {
        // Enable CORS (handled by .htaccess usually, but adding for safety if direct file access)
        
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->json(['error' => 'Method not allowed'], 405);
            return;
        }

        $model = $this->model('Franchise');
        $data = $model->getAll();
        
        $this->json(['status' => 'success', 'data' => $data]);
    }

    // POST /Franchise/update_status
    public function update_status() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->json(['error' => 'Method not allowed'], 405);
            return;
        }

        $input = json_decode(file_get_contents("php://input"), true);
        $id = $input['id'] ?? null;
        $status = $input['status'] ?? null;

        if (!$id || !$status) {
            $this->json(['error' => 'ID and Status are required'], 400);
            return;
        }

        $model = $this->model('Franchise');
        
        $result = ($status === 'Approved') ? $model->approveApplication($id) : $model->updateStatus($id, $status);

        if ($result === true) {
            $this->json(['status' => 'success', 'message' => 'Status updated successfully']);
        } else {
            // If result is not true, it might be an error message string or false
            $errorMsg = is_string($result) ? $result : 'Failed to update status';
            $this->json(['error' => $errorMsg], 500);
        }
    }

    // GET /Franchise/get_active
    public function get_active() {
         $model = $this->model('Franchise');
         $data = $model->getActiveFranchises();
         $this->json(['status' => 'success', 'data' => $data]);
    }

    // --- Financials ---
    public function get_payments() {
        $model = $this->model('Franchise');
        $this->json(['status' => 'success', 'data' => $model->getPayments()]);
    }

    public function add_payment() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') { $this->json(['error' => 'Method not allowed'], 405); return; }
        $input = json_decode(file_get_contents("php://input"), true);
        
        $model = $this->model('Franchise');
        if ($model->addPayment($input)) {
            $this->json(['status' => 'success']);
        } else {
            $this->json(['error' => 'Failed to add payment'], 500);
        }
    }

    // --- Resources ---
    public function get_resources() {
        $model = $this->model('Franchise');
        $this->json(['status' => 'success', 'data' => $model->getResources()]);
    }

    // Simple file upload for resources
    public function add_resource() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') { $this->json(['error' => 'Method not allowed'], 405); return; }
        
        if (!isset($_FILES['file']) || !isset($_POST['title'])) {
            $this->json(['error' => 'File and Title are required'], 400);
            return;
        }

        $uploadDir = __DIR__ . '/../../public/uploads/resources/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

        $fileName = basename($_FILES['file']['name']);
        $targetPath = $uploadDir . $fileName;
        $publicPath = 'uploads/resources/' . $fileName;
        $fileSize = round($_FILES['file']['size'] / 1024, 2) . ' KB'; // Size in KB

        if (move_uploaded_file($_FILES['file']['tmp_name'], $targetPath)) {
            $model = $this->model('Franchise');
            if ($model->addResource($_POST['title'], $publicPath, $fileSize)) {
                $this->json(['status' => 'success']);
            } else {
                $this->json(['error' => 'Database error'], 500);
            }
        } else {
            $this->json(['error' => 'Upload failed'], 500);
        }
    }

    // --- Settings ---
    public function get_settings() {
        $model = $this->model('Franchise');
        $this->json(['status' => 'success', 'data' => $model->getSettings()]);
    }

    public function save_settings() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') { $this->json(['error' => 'Method not allowed'], 405); return; }
        $input = json_decode(file_get_contents("php://input"), true);
        
        $model = $this->model('Franchise');
        if ($model->saveSettings($input)) {
            $this->json(['status' => 'success']);
        } else {
            $this->json(['error' => 'Failed to save settings'], 500);
        }
    }
}
