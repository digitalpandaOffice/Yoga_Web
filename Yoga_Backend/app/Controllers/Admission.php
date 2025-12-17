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
    // GET /Admission/get_all
    public function get_all() {
        header("Access-Control-Allow-Origin: *");
        header("Content-Type: application/json");

        $model = $this->model('Admission');
        $data = $model->getAll();

        if ($data) {
            // Decode form_data for each item
            foreach ($data as &$item) {
                if (isset($item['form_data'])) {
                    $item['form_data'] = json_decode($item['form_data'], true);
                }
            }
            $this->json(['status' => 'success', 'data' => $data]);
        } else {
            $this->json(['status' => 'success', 'data' => []]); // Return empty array if no data
        }
    }
    // POST /Admission/approve
    public function approve() {
        $this->handleStatusUpdate('Approved');
    }

    // POST /Admission/reject
    public function reject() {
        $this->handleStatusUpdate('Rejected');
    }

    private function handleStatusUpdate($status) {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type");
        
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') return;

        header("Content-Type: application/json");
        $input = json_decode(file_get_contents("php://input"), true);
        $id = $input['id'] ?? null;

        if (!$id) {
            $this->json(['error' => 'ID required'], 400);
            return;
        }

        $model = $this->model('Admission');
        
        // If Approving, move to Enrolled Students
        if ($status === 'Approved') {
            // 1. Get Application Details
            // Since we don't have a direct getById in Model (only getByRef), let's just do a direct query or add getById.
            // Using a quick query here or modifying model is better. 
            // Ideally add getById to model. But for speed, let's assume we can fetch it via existing getAll or add a helper.
            // Let's add a quick fetch here or use existing method.
            // Actually, we need form_data to get 'batch' etc.
            
            // Let's add getById to Admission Model first? Or just do it here if we had direct access (but we are in controller).
            // Let's rely on Model.
            $app = $model->getById($id); // Accessing new method we will add
            
            if ($app) {
                // Prepare data for student table
                $formData = json_decode($app['form_data'], true);
                
                require_once __DIR__ . '/../Models/Student.php';
                $studentModel = new \App\Models\Student();
                
                $assignedBatch = $input['batch'] ?? ($formData['batch'] ?? 'Batch A');

                $studentData = [
                    'admission_id' => $id,
                    'name' => $app['applicant_name'],
                    'email' => $app['email'],
                    'phone' => $app['phone'],
                    'course' => $app['course_name'],
                    'batch' => $assignedBatch
                ];

                $studentId = $studentModel->enroll($studentData);
                
                if ($studentId) {
                    $model->updateStatus($id, 'Approved');
                    $this->json(['status' => 'success', 'message' => "Application Approved. Student ID: $studentId generated."]);
                    return;
                } else {
                    $this->json(['error' => 'Failed to enroll student'], 500);
                    return;
                }
            } else {
                $this->json(['error' => 'Application not found'], 404);
                return;
            }
        }

        if ($model->updateStatus($id, $status)) {
            $this->json(['status' => 'success', 'message' => "Application $status"]);
        } else {
            $this->json(['error' => 'Failed to update status'], 500);
        }
    }
    // GET /Admission/get_students
    public function get_students() {
        header("Access-Control-Allow-Origin: *");
        header("Content-Type: application/json");

        require_once __DIR__ . '/../Models/Student.php';
        $studentModel = new \App\Models\Student();
        $data = $studentModel->getAll();

        if ($data) {
            $this->json(['status' => 'success', 'data' => $data]);
        } else {
            $this->json(['status' => 'success', 'data' => []]);
        }
    }
}
