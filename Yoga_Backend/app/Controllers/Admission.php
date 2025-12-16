<?php
namespace App\Controllers;

use Core\Controller;

class Admission extends Controller {
    
    // POST /Admission/submit
    public function submit() {
        // Enable CORS
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type");
        
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
        
        // Helper
        $getVal = function($k) use ($formData) {
            $v = $formData[$k] ?? '';
            return is_array($v) ? implode(', ', $v) : $v;
        };

        $name = $getVal('full_name');
        $email = $getVal('email');
        $phone = $getVal('mobile_no');
        $course = $getVal('course_name');

        if (!$name || !$email) {
             $this->json(['error' => 'Missing required fields (Name or Email)'], 400);
             return;
        }

        $model = $this->model('Admission');
        
        try {
            $result = $model->create([
                'applicant_name' => $name,
                'email' => $email,
                'phone' => $phone,
                'course_name' => $course,
                'form_data' => json_encode($formData),
                'reference_no' => $refNo
            ]);

            if ($result) {
                // Send Confirmation Email
                $to = $email;
                $subject = "Admission Application Received - " . $refNo;
                $message = "
                <html>
                <head>
                <title>Application Received</title>
                </head>
                <body>
                <h2>Dear " . htmlspecialchars($name) . ",</h2>
                <p>Thank you for applying to Edvayu Educational Foundations.</p>
                <p>Your application has been received successfully.</p>
                <p><strong>Reference Number: " . $refNo . "</strong></p>
                <p>Please keep this reference number for future communication.</p>
                <br>
                <p>Regards,<br>Edvayu Admissions Team</p>
                </body>
                </html>
                ";

                // Always set content-type when sending HTML email
                // $headers = "MIME-Version: 1.0" . "\r\n";
                // $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
                // $headers .= 'From: <no-reply@niac.edu.in>' . "\r\n";
                // @mail($to, $subject, $message, $headers);

                // Use SMTP Class
                require_once __DIR__ . '/../Config/SMTP.php';
                $smtp = new \App\Config\SMTP();
                $smtp->send($to, $subject, $message);

                $this->json(['message' => 'Application submitted successfully', 'ref_no' => $refNo]);
            } else {
                $this->json(['error' => 'Database insertion failed'], 500);
            }
        } catch (\Exception $e) {
            $this->json(['error' => 'Server Error: ' . $e->getMessage()], 500);
        }
    }

    // GET /Admission/get_application_data?ref=EDV-XXX
    public function get_application_data() {
        header("Access-Control-Allow-Origin: *");
        header("Content-Type: application/json");

        $refNo = $_GET['ref'] ?? '';
        if (!$refNo) {
            $this->json(['error' => 'Reference Number required'], 400);
            return;
        }

        $model = $this->model('Admission');
        $data = $model->getByRef($refNo);

        if ($data) {
            $formData = json_decode($data['form_data'], true);
            $this->json([
                'status' => 'success',
                'application' => [
                    'reference_no' => $data['reference_no'],
                    'applicant_name' => $data['applicant_name'],
                    'submission_date' => $data['submitted_at'],
                    'form_data' => $formData
                ]
            ]);
        } else {
            $this->json(['error' => 'Application not found'], 404);
        }
    }
}
