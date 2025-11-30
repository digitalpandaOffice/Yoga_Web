<?php
$host = 'localhost';
$db_name = 'edvayu_db';
$username = 'root';
$password = '';

try {
    $dsn = "mysql:host=$host;dbname=$db_name;charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Check if exists
    $check = $pdo->query("SELECT id FROM admit_cards WHERE registration_number = '123'");
    if ($check->fetch()) {
        echo "Test record already exists.\n";
    } else {
        $stmt = $pdo->prepare("INSERT INTO admit_cards (student_name, father_name, registration_number, roll_number, dob, course_name, exam_session, exam_center, student_photo, subjects) VALUES ('Test Student', 'Test Father', '123', '999', '2025-01-01', 'Test Course', '2025', 'Test Center', '', '[]')");
        $stmt->execute();
        echo "Inserted test record: Reg='123', DOB='2025-01-01'\n";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
