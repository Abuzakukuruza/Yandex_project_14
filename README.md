 

# Яндекс.Практикум
  
## Проектная работа 14_v1.0.1
 
## Authentication

### Краткая информация о проекте

  
Применение на практике методов аутентификации и авторизации пользователей проекта Mesto.

В работе применяются базы данных MongoDB для разработки бэкенда проекта Mesto и разработки API, согласно принципам REST.


### ПО для выполнения задания:

<li>
Git
<li>
Node.js
<li>
MongoDB
<li>
MongoDB Compass Community
<li>
NPM-пакеты:

eslint, eslint-config-airbnb-base, eslint-plugin-import, express, mongoose, body-parser, validator, bcryptjs, jsonwebtoken, dotenv, helmet
  

### Инструкция по сборке:
- сервер запускается командой **npm run start** по адресу **localhost:3000**
- Node.js приложение подключается к серверу Mongo по адресу **mongodb://localhost:27017/mestodb**
- при отправке запросов в заголовок **authorization** нужно записать схему аутентификации (используем **Bearer**) и токен через пробел: 
  - запрос на **GET/users** возвращает всех пользователей из базы
  - запрос **GET/users/:userId** возвращает конкретного пользователя
  - запрос **POST/signup** создаёт пользователя. В теле POST-запроса на создание пользователя передается JSON-объект с пятью полями: **name**, **about**, **avatar**, **email**, **password**
  - запрос **POST/signin** производит авторизацию пользователя. Если успешно - токен возвращается в ответе и записыватеся в cookie с включенной опцией httpOnly. В теле POST-запроса на создание пользователя передается JSON-объект с двумя полями: **email**, **password**
  - запрос **GET/cards** возвращает все карточки всех пользователей
  - запрос **POST/cards** создаёт карточку. В теле POST-запроса на создание карточки передается JSON-объект с двумя полями: **name** и **link**.
  - запрос **DELETE/cards/:cardId** удаляет карточку по идентификатору