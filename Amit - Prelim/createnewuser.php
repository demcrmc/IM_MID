<?php
include('dbconnection.php');

if (
    isset($_POST['first_name']) && !empty($_POST['first_name']) &&
    isset($_POST['last_name']) && !empty($_POST['last_name']) &&
    isset($_POST['email']) && !empty($_POST['email']) &&
    isset($_POST['gender']) && !empty($_POST['gender']) &&
    isset($_POST['course']) && !empty($_POST['course']) &&
    isset($_POST['user_address']) && !empty($_POST['user_address']) &&
    isset($_POST['birthdate']) && !empty($_POST['birthdate'])
) {
    $firstName = $_POST['first_name'];
    $lastName = $_POST['last_name'];
    $email = $_POST['email'];
    $gender = $_POST['gender'];
    $course = $_POST['course'];
    $address = $_POST['user_address'];
    $birthdate = $_POST['birthdate'];


    $checkQuery = "SELECT * FROM students WHERE email = :email";
    $checkStatement = $connection->prepare($checkQuery);
    $checkStatement->bindParam(':email', $email);
    $checkStatement->execute();
    
    if ($checkStatement->rowCount() > 0) {
        echo json_encode(["res" => "error", "msg" => "Email is already used"]);
    } else {
        $query = "INSERT INTO students (first_name, last_name, email, gender, course, user_address, birthdate, date_created) VALUES (:firstName, :lastName, :email, :gender, :course, :address, :birthdate, NOW())";
        $statement = $connection->prepare($query);
        $statement->bindParam(':firstName', $firstName);
        $statement->bindParam(':lastName', $lastName);
        $statement->bindParam(':email', $email);
        $statement->bindParam(':gender', $gender);
        $statement->bindParam(':course', $course);
        $statement->bindParam(':address', $address);
        $statement->bindParam(':birthdate', $birthdate);

        try {
            $res = $statement->execute();

            if ($res) {
                echo json_encode(["res" => "success"]);
            } else {
                echo json_encode(["res" => "error", "msg" => "Failed to insert student"]);
            }
        } catch (PDOException $th) {
            echo json_encode(["res" => "error", "msg" => $th->getMessage()]);
        }
    }
} else {
    echo json_encode(["res" => "error", "msg" => "All student details are required"]);
}
?>
