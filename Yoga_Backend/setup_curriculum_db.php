<?php
$host = 'localhost';
$db_name = 'edvayu_db';
$username = 'root';
$password = '';

try {
    $dsn = "mysql:host=$host;dbname=$db_name;charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "CREATE TABLE IF NOT EXISTS curriculum (
        id INT AUTO_INCREMENT PRIMARY KEY,
        discipline_name VARCHAR(255) NOT NULL,
        icon VARCHAR(50),
        full_pdf_url VARCHAR(500),
        levels_data JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";

    $pdo->exec($sql);
    echo "Table 'curriculum' created successfully.";

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
