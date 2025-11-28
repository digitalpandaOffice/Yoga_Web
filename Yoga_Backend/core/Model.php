<?php
namespace Core;

use App\Config\Database;
use PDO;

class Model {
    protected $db;
    protected $conn;

    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->connect();
    }
}
