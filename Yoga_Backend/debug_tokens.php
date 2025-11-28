<?php
require_once 'app/Config/Database.php';
use App\Config\Database;

$db = new Database();
$conn = $db->connect();

try {
    $stmt = $conn->query("SELECT id, username, reset_token, reset_expires FROM admins");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    print_r($users);
    
    echo "\nCurrent Time: " . date('Y-m-d H:i:s') . "\n";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
