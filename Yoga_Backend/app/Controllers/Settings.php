<?php
namespace App\Controllers;

use Core\Controller;

class Settings extends Controller {
    private $settingModel;

    public function __construct() {
        $this->settingModel = $this->model('Setting');
    }

    public function index() {
        $settings = $this->settingModel->getAll();
        // Convert to key-value pair object for easier frontend consumption
        $formatted = [];
        foreach ($settings as $s) {
            $formatted[$s['setting_key']] = $s['setting_value'];
        }
        $this->json($formatted);
    }

    public function update() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->json(['error' => 'Method not allowed'], 405);
        }

        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!is_array($data)) {
            $this->json(['error' => 'Invalid data format'], 400);
        }

        $successCount = 0;
        foreach ($data as $key => $value) {
            if ($this->settingModel->update($key, $value)) {
                $successCount++;
            }
        }

        $this->json(['message' => "Updated $successCount settings"]);
    }
}
