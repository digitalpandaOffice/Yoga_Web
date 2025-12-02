<?php
$host = 'localhost';
$db_name = 'edvayu_db';
$username = 'root';
$password = '';

try {
    $dsn = "mysql:host=$host;dbname=$db_name;charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password);
    $stmt = $pdo->query("SELECT registration_number, dob FROM admit_cards");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($rows as $row) {
        echo "Reg: '" . $row['registration_number'] . "', DOB: '" . $row['dob'] . "'\n";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}

