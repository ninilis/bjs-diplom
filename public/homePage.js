'use strict';

//Выход из ЛК
const logoutButton = new LogoutButton();
logoutButton.action = () => {
    ApiConnector.logout((response) => {
        if(response.success) {
            location.reload();
        }
    });
}

//Получение инфы о пользователе
ApiConnector.current((response) => {
    if(response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

//Получение текущих курсов валют !!! НЕ РАБОТАЕТ - не показывает какой сейчас курс, и после авто-обновления тоже
const ratesBoard = new RatesBoard();
function updateRates() {
    ApiConnector.getStocks((response) => {
        if(response.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        }
    });
}
updateRates();
setInterval(updateRates, 6000);

//Операции с деньгами
const moneyManager = new MoneyManager();

//1. Пополнение баланса
moneyManager.addMoneyCallback = (data) => {
    ApiConnector.addMoney(data, (response) => {
        if(response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Баланс пополнен")
        } else {
            moneyManager.setMessage(false, response.error || "Ошибка при попытке пополнения баланса");
        }
    });
}

//2. Конвертирование валюты
moneyManager.conversionMoneyCallback = (data) => {
    ApiConnector.convertMoney(data, (response) => {
        if(response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Конвертация выполнена")
        } else {
            moneyManager.setMessage(false, response.error || "Ошибка при конвертации")
        }
    });
}

//3. Перевод валюты
moneyManager.sendMoneyCallback = (data) => {
    ApiConnector.transferMoney(data, (response) => {
        if(response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Перевод выполнен")
        } else {
            moneyManager.setMessage(false, response.error || "Ошибка при переводе валюты")
        }
    })
}

// Работа с избранным
const favoritesWidget = new FavoritesWidget();

//1. Запросить начальный список избранного
function updateFavorites() {
    ApiConnector.getFavorites((response) => {
        if(response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
        }
    });
}
updateFavorites();

//2. Добавление пользователя в список избранных
favoritesWidget.addUserCallback = (data) => {
    ApiConnector.addUserToFavorites(data, (response) => {
        if(response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(true, "Пользователь добавлен в избранные")
        } else {
            favoritesWidget.setMessage(false, response.error || "Ошибка добавления в избранные")
        }
    });
}

//3. Удаление пользователя из избранного
favoritesWidget.removeUserCallback = (data) => {
    ApiConnector.removeUserFromFavorites(data, (response) => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(true, "Пользователь удален из избранных")
        } else {
            favoritesWidget.setMessage(false, response.error || "Ошибка удаления пользователя")
        }
    });
}
