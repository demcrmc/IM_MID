$(document).ready(function() {
    function calculateAge(birthdate) {
        const today = new Date();
        const birthDate = new Date(birthdate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    function loadStudents() {
        $.ajax({
            url: "get_students.php"
        }).done(function(data) {
            try {
                let result = JSON.parse(data);
                let parent = document.querySelector("#tableBody");
                parent.innerHTML = "";

                result.forEach(item => {
                    console.log(item);
                    let row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${item.student_id}</td>
                        <td>${item.first_name}</td>
                        <td>${item.last_name}</td>
                        <td>${item.email}</td>
                        <td>${item.gender}</td>
                        <td>${item.course}</td>
                        <td>${item.user_address}</td>
                        <td>${calculateAge(item.birthdate)}</td>
                        <td>
                            <button class="btn btn-sm btn-primary update-btn" data-id="${item.student_id}" data-name="${item.first_name}" data-last="${item.last_name}" data-email="${item.email}" data-gender="${item.gender}" data-course="${item.course}" data-user_address="${item.user_address}" data-birthdate="${item.birthdate}">Update</button>
                            <button class="btn btn-sm btn-danger delete-btn" data-id="${item.student_id}">Delete</button>
                        </td>
                    `;
                    parent.appendChild(row);
                });
            } catch (error) {
                console.error("Error parsing JSON: ", error);
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.error("AJAX call failed: ", textStatus, errorThrown);
        });
    }

    loadStudents();

    $("#createUserForm").submit(function(event) {
        event.preventDefault();
        const formData = $(this).serializeArray();
        const data = {};
        formData.forEach(item => {
            data[item.name] = item.value;
        });

        $.ajax({
            url: "createnewuser.php",
            type: "POST",
            dataType: "json",
            data: data
        }).done(function(result) {
            if (result.res === "success") {
                alert("Student added successfully");
                $("#createUserModal").modal("hide");
                loadStudents();
                $("#createUserForm")[0].reset();
            } else {
                alert("Error adding student: " + (result.msg || "Unknown error"));
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            alert("Request failed: " + textStatus);
            console.error("AJAX call failed: ", errorThrown);
        });
    });

    $(document).on('click', '.update-btn', function() {
        const studentId = $(this).data('id');
        const studentFirstName = $(this).data('name');
        const studentLastName = $(this).data('last');
        const studentEmail = $(this).data('email');
        const studentGender = $(this).data('gender');
        const studentCourse = $(this).data('course');
        const studentAddress = $(this).data('user_address');
        const studentBirthdate = $(this).data('birthdate');
    
        $('#updateStudentId').val(studentId);
        $('#updateFirstName').val(studentFirstName);
        $('#updateLastName').val(studentLastName);
        $('#updateEmail').val(studentEmail);
        $('#updateGender').val(studentGender);
        $('#updateCourse').val(studentCourse);
        $('#updateUserAddress').val(studentAddress);
        $('#updateBirthdate').val(studentBirthdate);
    
        $('#updateStudentModal').modal('show');
    });
    
    $('#updateStudentForm').submit(function(event) {
        event.preventDefault();
    
        const studentId = $('#updateStudentId').val();
        const newFirstName = $('#updateFirstName').val();
        const newLastName = $('#updateLastName').val();
        const newEmail = $('#updateEmail').val();
        const newGender = $('#updateGender').val();
        const newCourse = $('#updateCourse').val();
        const newUserAddress = $('#updateUserAddress').val();
        const newBirthdate = $('#updateBirthdate').val();
    
        $.ajax({
            url: "updateuser.php",
            type: "POST",
            dataType: "json",
            data: {
                id: studentId,
                first_name: newFirstName,
                last_name: newLastName,
                email: newEmail,
                gender: newGender,
                course: newCourse,
                user_address: newUserAddress,
                birthdate: newBirthdate
            }
        }).done(function(result) {
            if (result.res === "success") {
                alert("Student updated successfully");
                $('#updateStudentModal').modal('hide');
                loadStudents();
            } else {
                alert("Error updating student: " + (result.msg || "Unknown error"));
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            alert("Request failed: " + textStatus);
            console.error("AJAX call failed: ", errorThrown);
        });
    });

    $(document).on('click', '.delete-btn', function() {
        const studentId = $(this).data('id');

        if (confirm("Are you sure you want to delete this student?")) {
            $.ajax({
                url: "deleteuser.php",
                type: "POST",
                dataType: "json",
                data: {
                    id: studentId
                }
            }).done(function(result) {
                if (result.res === "success") {
                    alert("Student deleted successfully");
                    loadStudents();
                } else {
                    alert("Error deleting student: " + (result.msg || "Unknown error"));
                }
            }).fail(function(jqXHR, textStatus, errorThrown) {
                console.error("AJAX call failed: ", errorThrown);
                console.error(jqXHR.responseText);
                alert("Request failed: " + textStatus);
            });
        }
    });
});