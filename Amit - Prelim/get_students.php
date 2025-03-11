<?php
include('dbconnection.php');

try {
    $stmt = $connection->query("SELECT * FROM students");
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);

    error_log(print_r($students, TRUE));

    echo json_encode($students);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
    error_log("Database error: " . $e->getMessage());
}


?>