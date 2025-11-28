<?php
namespace App\Controllers;

use Core\Controller;

class Home extends Controller {
    public function index() {
        $this->json([
            'message' => 'Welcome to Edvayu API',
            'status' => 'connected',
            'version' => '1.0.0'
        ]);
    }
}
