<?php

include('dbconnection.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['id'])) {
    $studentId = $_POST['id'];
    $firstName = $_POST['first_name'];
    $lastName = $_POST['last_name'];
    $email = $_POST['email'];
    $gender = $_POST['gender'];
    $course = $_POST['course'];
    $userAddress = $_POST['user_address'];
    $birthdate = $_POST['birthdate'];

    try {
        $sql = "UPDATE students SET first_name = :first_name, last_name = :last_name, email = :email, gender = :gender, course = :course, user_address = :user_address, birthdate = :birthdate WHERE student_id = :student_id";

        $stmt = $connection->prepare($sql);

        $stmt->bindParam(':student_id', $studentId, PDO::PARAM_INT);
        $stmt->bindParam(':first_name', $firstName, PDO::PARAM_STR);
        $stmt->bindParam(':last_name', $lastName, PDO::PARAM_STR);
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->bindParam(':gender', $gender, PDO::PARAM_STR);
        $stmt->bindParam(':course', $course, PDO::PARAM_STR);
        $stmt->bindParam(':user_address', $userAddress, PDO::PARAM_STR);
        $stmt->bindParam(':birthdate', $birthdate, PDO::PARAM_STR);

        error_log("Executing SQL: " . $sql);
        error_log("Bound parameters: " . print_r($_POST, true));

        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            echo json_encode(['res' => 'success']);
        } else {
            echo json_encode(['res' => 'error', 'msg' => 'No rows updated. Check student_id.']);
            error_log("Update error: No rows updated. Check student_id. student id: " . $studentId);
        }

    } catch (PDOException $e) {
        error_log("Update error: " . $e->getMessage());
        echo json_encode(['res' => 'error', 'msg' => $e->getMessage()]);
    }
} else {
    error_log("Update error: Invalid request");
    echo json_encode(['res' => 'error', 'msg' => 'Invalid request']);
}


?>
