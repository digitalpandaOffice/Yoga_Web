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
}
