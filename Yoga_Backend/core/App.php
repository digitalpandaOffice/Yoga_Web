<?php
namespace Core;

class App {
    protected $controller = 'Home'; // Default controller
    protected $method = 'index';    // Default method
    protected $params = [];

    public function __construct() {
        // Handle CORS
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
        
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            http_response_code(200);
            exit;
        }

        $url = $this->parseUrl();

        // 1. Check for Controller
        if (isset($url[0])) {
            // Capitalize first letter
            $controllerName = ucfirst($url[0]);
            if (file_exists('../app/Controllers/' . $controllerName . '.php')) {
                $this->controller = $controllerName;
                unset($url[0]);
            }
        }

        require_once '../app/Controllers/' . $this->controller . '.php';
        
        // Instantiate controller class
        $controllerClass = 'App\\Controllers\\' . $this->controller;
        $this->controller = new $controllerClass;

        // 2. Check for Method
        if (isset($url[1])) {
            if (method_exists($this->controller, $url[1])) {
                $this->method = $url[1];
                unset($url[1]);
            }
        }

        // 3. Get Params
        $this->params = $url ? array_values($url) : [];

        // 4. Call method
        call_user_func_array([$this->controller, $this->method], $this->params);
    }

    public function parseUrl() {
        if (isset($_GET['url'])) {
            // Trim trailing slash, sanitize, explode
            return explode('/', filter_var(rtrim($_GET['url'], '/'), FILTER_SANITIZE_URL));
        }
    }
}
