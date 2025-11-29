<?php
$host = 'localhost';
$db_name = 'edvayu_db';
$username = 'root';
$password = '';

try {
    $dsn = "mysql:host=$host;dbname=$db_name;charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "CREATE TABLE IF NOT EXISTS results (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_name VARCHAR(255) NOT NULL,
        roll_number VARCHAR(100) NOT NULL,
        course_id VARCHAR(100) NOT NULL,
        year VARCHAR(20) NOT NULL,
        marks_data JSON,
        total_marks INT,
        obtained_marks INT,
        percentage FLOAT,
        grade VARCHAR(10),
        status VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_result (roll_number, course_id, year)
    )";

    $pdo->exec($sql);
    echo "Table 'results' created successfully.";

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
