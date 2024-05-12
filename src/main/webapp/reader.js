document.addEventListener('DOMContentLoaded', function () {
    // Функции для работы со студентами
    const form = document.getElementById('studentForm');
    let studentsData;
    let currentStudentId;
    const studentList = document.getElementById('studentList');
    window.studentModal = new bootstrap.Modal(document.getElementById('editStudentModal'));

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(form);
        const student = {};
        formData.forEach(function (value, key) {
            student[key] = value;
        });
        loadStudents()
    });

    // Функция для загрузки списка студентов
    function loadStudents() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:8080/laba5_gleb_war_exploded/student', true);

        xhr.onload = function () {
            if (xhr.status === 200) {
                studentsData = JSON.parse(xhr.responseText);
                displayStudents(studentsData);
            } else {
                console.error('Произошла ошибка при загрузке списка студентов:', xhr.statusText);
            }
        };

        xhr.send();
    }

    // Функция для отображения списка студентов
    function displayStudents(students) {
        let tableHTML = `
            <table class="table table-striped table-bordered" style="width: 100%;">
                <thead class="thead-dark">
                    <tr>
                        <th style="width: 20%;">Имя</th>
                        <th style="width: 20%;">Фамилия</th>
                        <th style="width: 15%;">Группа</th>
                        <th style="width: 10%;">Возраст</th>
                        <th style="width: 35%;">Предмет</th>
                        <th style="width: 30%;">Действия</th> 
                    </tr>
                </thead>
                <tbody>
        `;

        students.forEach(function (student) {
            tableHTML += `
                <tr>
                    <td>${student.name}</td>
                    <td>${student.surname}</td>
                    <td>${student.group_name}</td>
                    <td>${student.age}</td>
                    <td>${student.subject}</td>
                    <td>
                        <button onclick="editStudent(${student.id})">Редактировать</button>
                        <button onclick="deleteStudent(${student.id})">Удалить</button>
                    </td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
        `;

        studentList.innerHTML = tableHTML;
    }

    // Функция для редактирования студента
    window.editStudent = function (studentId) {
        const selectedStudent = studentsData.find(student => student.id === studentId);

        document.getElementById('editName').value = selectedStudent.name;
        document.getElementById('editSurname').value = selectedStudent.surname;
        document.getElementById('editGroup_name').value = selectedStudent.group_name;
        document.getElementById('editAge').value = selectedStudent.age;
        document.getElementById('editSubject').value = selectedStudent.subject;
        currentStudentId = studentId;
        studentModal.show();
    }

    // Функция для сохранения изменений студента
    window.saveStudentChanges = function () {
        const name = document.getElementById('editName').value;
        const surname = document.getElementById('editSurname').value;
        const group_name = document.getElementById('editGroup_name').value;
        const age = document.getElementById('editAge').value;
        const subject = document.getElementById('editSubject').value;

        const xhr = new XMLHttpRequest();
        xhr.open('PUT', `http://localhost:8080/laba5_gleb_war_exploded/student`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function () {
            if (xhr.status === 200) {
                loadStudents();
                studentModal.hide();
            } else {
                console.error('Произошла ошибка при сохранении изменений:', xhr.statusText);
            }
        };

        xhr.send(JSON.stringify({
            id: currentStudentId,
            name: name,
            surname: surname,
            group_name: group_name,
            age: age,
            subject: subject
        }));
    }


    // Функция для удаления студента
    window.deleteStudent = function (studentId) {
        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', `http://localhost:8080/laba5_gleb_war_exploded/student?id=${studentId}`, true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                loadStudents();
            } else {
                console.error('Произошла ошибка при удалении студента:', xhr.statusText);
            }
        };

        xhr.send();
        console.log("Удаление студента с ID:", studentId);
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(form);
        const student = {};
        formData.forEach(function (value, key) {
            student[key] = value;
        });

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:8080/laba5_gleb_war_exploded/student', true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function () {
            if (xhr.status === 200) {
                loadStudents();
            } else {
                console.error('Произошла ошибка при обработке запроса:', xhr.statusText);
            }
        };

        xhr.send(JSON.stringify(student));
    });

    loadStudents();
});
