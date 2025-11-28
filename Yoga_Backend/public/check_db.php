<?php
require_once '../app/Config/Database.php';
use App\Config\Database;

$db = new Database();
$conn = $db->connect();

try {
    $stmt = $conn->query("DESCRIBE admins");
    $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "Columns in admins table: " . implode(", ", $columns);
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
