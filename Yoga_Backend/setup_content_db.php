<?php
$host = 'localhost';
$db_name = 'edvayu_db';
$username = 'root';
$password = '';

try {
    $dsn = "mysql:host=$host;dbname=$db_name;charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "CREATE TABLE IF NOT EXISTS page_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page_slug VARCHAR(50) NOT NULL,
        section_key VARCHAR(50) NOT NULL,
        content_value LONGTEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_content (page_slug, section_key)
    )";

    $pdo->exec($sql);
    echo "Table 'page_content' created successfully.";

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
