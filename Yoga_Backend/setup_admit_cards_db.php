<?php
$host = 'localhost';
$db_name = 'edvayu_db';
$username = 'root';
$password = '';

try {
    $dsn = "mysql:host=$host;dbname=$db_name;charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "DROP TABLE IF EXISTS admit_cards";
    $pdo->exec($sql);

    $sql = "CREATE TABLE admit_cards (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_name VARCHAR(255) NOT NULL,
        father_name VARCHAR(255) NOT NULL,
        registration_number VARCHAR(100) NOT NULL UNIQUE,
        roll_number VARCHAR(100) NOT NULL,
        dob DATE NOT NULL,
        course_name VARCHAR(255) NOT NULL,
        exam_session VARCHAR(100) NOT NULL,
        exam_center VARCHAR(255) NOT NULL,
        student_photo VARCHAR(255) NOT NULL,
        subjects JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";

    $pdo->exec($sql);
    echo "Table 'admit_cards' created successfully.";

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
