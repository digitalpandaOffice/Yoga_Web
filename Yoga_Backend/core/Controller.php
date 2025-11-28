<?php
namespace Core;

class Controller {
    public function model($model) {
        // Require model file
        require_once '../app/Models/' . $model . '.php';
        
        // Instantiate model
        // Assuming namespace App\Models
        $modelClass = 'App\\Models\\' . $model;
        return new $modelClass();
    }

    // Helper to send JSON response
    public function json($data, $status = 200) {
        header("Content-Type: application/json");
        http_response_code($status);
        echo json_encode($data);
        exit;
    }
}
