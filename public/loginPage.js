"use strict";

const userForm = new UserForm();

//Авторизация
userForm.loginFormCallback = (data) => {
    ApiConnector.login(data, (response) => {
        console.log(response);
        if (response.success) {
            location.reload();
        } else {
            userForm.setLoginErrorMessage(
                response.error || "Ошибка при авторизации"
            );
        }
    });
}

//Регистрация
userForm.registerFormCallback = (data) => {
    ApiConnector.register(data, (response) => {
        if (response.success) {
            location.reload();
        } else {
            userForm.setRegisterErrorMessage(
                response.error || "Ошибка при регистрации"
            );
        }
    });
}

//Проверка
// ДА {login: "oleg@demo.ru", password: "demo"}
// НЕТ {login: "oleg@demo.ru", password: "wrong"}
