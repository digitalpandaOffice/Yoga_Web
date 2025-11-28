<?php

// CORS Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Autoloader
spl_autoload_register(function ($class) {
    // Convert namespace to full file path
    // e.g. Core\App -> ../core/App.php
    // e.g. App\Controllers\Home -> ../app/Controllers/Home.php
    
    $prefix = '';
    $base_dir = __DIR__ . '/../';

    // Namespace prefix mapping
    $prefixes = [
        'Core\\' => 'core/',
        'App\\' => 'app/'
    ];

    foreach ($prefixes as $ns => $dir) {
        if (strpos($class, $ns) === 0) {
            $relative_class = substr($class, strlen($ns));
            $file = $base_dir . $dir . str_replace('\\', '/', $relative_class) . '.php';
            if (file_exists($file)) {
                require $file;
                return;
            }
        }
    }
});

// Initialize App
$app = new Core\App();
