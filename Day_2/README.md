# Модуль Request

## Что такое HTTP?

HTTP - это протокол передачи гипертекста. HTTP функционирует как протокол запроса-ответа в модели клиент-сервер.

## Коды состояния HTTP

Прежде чем погрузиться в общение с другими API-интерфейсами, давайте рассмотрим коды состояния HTTP, с которыми мы можем столкнуться во время работы нашего приложения. Они описывают результаты наших запросов и очень важны для обработки ошибок.

* 1xx — Информационный
* 2xx — Успех: Эти коды состояния говорят о том, что наш запрос был получен и обработан правильно. Наиболее распространённые коды успеха - `200 OK`, `201 Created` и `204 No Content`.
* 3xx — Редирект: Эта группа кодов показывает, что клиент должен будет выполнить дополнительные действия для завершения запроса. Наиболее распространёнными кодами перенаправления являются `301 Moved Permanently`, `304 Not Modified`.
* 4xx — Ошибка клиента. Этот класс кодов состояния используется, когда запрос, отправленный клиентом,  содержит какую-то ошибку. Ответ сервера обычно содержит объяснение ошибки. Наиболее распространёнными кодами ошибок клиента являются `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`.
* 5xx - Ошибка сервера: эти коды отправляются, когда сервер не смог выполнить корректный запрос из-за какой-то ошибки. Причиной может быть ошибка в коде или некоторая временная или постоянная неисправность. Наиболее распространённые коды ошибок сервера: `500 Internal Server Error`, `503 Service Unavailable`.

Если вы хотите узнать больше о кодах состояния HTTP, вы можете найти подробное объяснение [здесь](http://www.restapitutorial.com/httpstatuscodes.html).

## Отправка запросов внешним API

Подключение к внешним API-интерфейсам — простая задача в Node. Вы можете просто подключить базовый [модуль HTTP](https://nodejs.org/api/http.html) и начать отправку запросов.

Конечно, есть способы обращения к внешним API намного лучше. В NPM вы можете найти несколько модулей, которые облегчат вам этот процесс. Например, двумя наиболее популярными являются модули [request](https://www.npmjs.com/package/request) и [superagent](https://www.npmjs.com/package/superagent).

Оба этих модуля имеют интерфейс, построенный на колбеках, который может привести к проблемам (я уверен, вы слышали о *Callback-Hell*), но, к счастью, у нас есть доступ к версиям, обёрнутым в промисы.

## Использование модуля Request

Использование модуля [request-promise](https://www.npmjs.com/package/request-promise) — это очень просто. После установки из NPM вам нужно только подключить его к программе:

```javascript
const request = require('request-promise')
```

Отправка GET-запроса:

```javascript
const options = {
    method: 'GET',
    uri: 'https://risingstack.com'
}

request(options)
    .then(function (response) {
        // Запрос был успешным, используйте объект ответа как хотите
    })
    .catch(function (err) {
        // Произошло что-то плохое, обработка ошибки
    })
```

Если вы вызываете JSON API, вам может потребоваться, чтобы `request-promise` автоматически распарсил ответ. В этом случае просто добавьте это в параметры запроса:

```javascript
json: true
```

POST-запросы работают аналогичным образом:

```javascript
const options = {
    method: 'POST',
    uri: 'https://risingstack.com/login',
    body: {
       foo: 'bar'
    },
    json: true
    // Тело запроса приводится к формату JSON автоматически
}

request(options)
    .then(function (response) {
        // Обработка ответа
    })
    .catch(function (err) {
        // Работа с ошибкой
    })
```

Чтобы добавить параметры строки запроса, вам просто нужно добавить свойство `qs` к объекту `options`:

```javascript
const options = {
    method: 'GET',
    uri: 'https://risingstack.com',
    qs: {
        limit: 10,
        skip: 20,
        sort: 'asc'
    }
}
```

Этот код соберёт следующий URL для запроса: `https://risingstack.com?limit=10&skip=20&sort=asc`. Вы также можете назначить любой заголовок так же, как мы добавили параметры запроса:

```javascript
const options = {
    method: 'GET',
    uri: 'https://risingstack.com',
    headers: {
        'User-Agent': 'Request-Promise',
        'Authorization': 'Basic QWxhZGRpbjpPcGVuU2VzYW1l'
    }
}
```

## Обработка ошибок

Обработка ошибок - это неотъемлемая часть запросов на внешние API, поскольку мы никогда не можем быть уверены в том, что с ними произойдёт. Помимо наших ошибок клиента сервер может ответить с ошибкой или просто отправить данные в неправильном или непоследовательном формате. Помните об этом, когда вы пытаетесь обработать ответ. Кроме того, использование `catch` для каждого запроса - хороший способ избежать сбоя на нашем сервере по вине внешнего сервиса.

## Объединяем всё вместе

Поскольку вы уже узнали, как развернуть HTTP-сервер на Node.js, как отрисовать HTML и как получить данные из внешних API, пришло время собрать эти знания вместе!

В этом примере мы собираемся создать небольшое приложение на Express, отображающее текущие погодные условия на основе названий городов.

(Чтобы получить ключ для API AccuWeather, посетите их [сайт для разработчиков](http://apidev.accuweather.com/developers/samples))

```javascript
const express = require('express')
const rp = require('request-promise')
const exphbs = require('express-handlebars')
const path = require('path')
const app = express()

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts')
}))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))

app.get('/:city', (req, res) => {
    rp({
        uri: 'http://dataservice.accuweather.com/locations/v1/cities/search',
        qs: {
            q: req.params.city,
            apikey: 'api-key'
            // Используйте ваш ключ для accuweather API
                
        },
        json: true
    })
    .then((data) => {
        res.render('home', {
            res: JSON.stringify(data)
        })
    })
    .catch((err) => {
        console.log(err)
        res.render('error')
    })
})

app.listen(3000)
```

Пример выше делает следующее:
* создаёт Express-сервер
* устанавливает handlebars в качестве шаблонизатора
* отправляет запрос к внешнему API
    * если все в порядке, то приложение отображает страницу
    * в противном случае приложение показывает страницу неудачи и регистрирует ошибку

---
# Файловая структура проекта

## 5 основных правил структурирования проектов

Существует множество возможных способов организации Node.js-проектов и каждый из известных методов имеет свои плюсы и минусы. Однако, по нашему опыту, разработчики всегда хотят добиться одного и того же: чистоты кода и возможности легко добавлять новые функции.

Вот пять простых правил, которые мы применяются во время разработки на Node.js. Если вы будете им следовать, ваши проекты будут в порядке.

## Правило 1: Организуйте ваши файлы вокруг функций, а не ролей

Представьте, что у вас есть следующая структура каталогов:

```
// Неправильно
.
├── controllers
|   ├── product.js
|   └── user.js
├── models
|   ├── product.js
|   └── user.js
├── views
|   ├── product.hbs
|   └── user.hbs
```

Проблемы с этим подходом:
* Чтобы понять, как работает страница `product`, вам нужно открыть три разных каталога с большим количеством переключений контекста
* В конечном итоге вы пишете длинные пути при подключении модулей: `require('../../controllers/user.js')`

Вместо этого вы можете структурировать Node.js-приложения вокруг функций продукта / страниц / компонентов. Это облегчает понимание:

```
// Правильно
.
├── product
|   ├── index.js
|   ├── product.js
|   └── product.hbs
├── user
|   ├── index.js
|   ├── user.js
|   └── user.hbs
```

## Правило 2: Не помещайте логику в файлы `index.js`

Используйте эти файлы только для экспорта, например:

```javascript
 javascript
// product/index.js
var product = require('./product')

module.exports = {
    create: product.create
} 
```

## Правило 3: Поместите тестовые файлы рядом с реализацией

Тесты предназначены не только для проверки того, генерирует ли модуль ожидаемый результат, они также документируют ваши модули (вы узнаете больше о написании тестов в следующих частях). Из-за этого легче понять код приложения, когда тестовые файлы находятся рядом с реализацией.

Поместите ваши дополнительные тестовые файлы в отдельную папку `test`, чтобы избежать путаницы.

```
.
├── test
|   └── setup.spec.js
├── product
|   ├── index.js
|   ├── product.js
|   ├── product.spec.js
|   └── product.hbs
├── user
|   ├── index.js
|   ├── user.js
|   ├── user.spec.js
|   └── user.hbs
```

## Правило 4: Используйте директорию `config`

Для хранения файлов конфигурации используйте каталог `config`.

```
├── config
|   ├── index.js
|   └── server.js
├── product
|   ├── index.js
|   ├── product.js
|   ├── product.spec.js
|   └── product.hbs
```

## Правило 5: Положите свои большие npm-скрипты в каталог `scripts`

Создайте отдельный каталог для ваших дополнительных скриптов в `package.json`.

```
.
├── scripts
|   ├── syncDb.sh
|   └── provision.sh
├── product
|   ├── index.js
|   ├── product.js
|   ├── product.spec.js
|   └── product.hbs
```

---

# Руководство по кросс-доменным запросам (CORS)

Обычно запрос XMLHttpRequest может делать запрос только в рамках текущего сайта. При попытке использовать другой домен/порт/протокол – браузер выдаёт ошибку.

Существует современный стандарт XMLHttpRequest, он ещё в состоянии черновика, но предусматривает кросс-доменные запросы и многое другое.

Большинство возможностей этого стандарта уже поддерживаются всеми браузерами, но увы, не в IE9-.

Впрочем, частично кросс-доменные запросы поддерживаются, начиная с IE8, только вместо XMLHttpRequest нужно использовать объект XDomainRequest.

Cross-Origin Resource Sharing (CORS) — механизм, использующий дополнительные HTTP-заголовки, чтобы дать возможность агенту пользователя получать разрешения на доступ к выбранным ресурсам с сервера на источнике (домене), отличном от того, что сайт использует в данный момент. Говорят, что агент пользователя делает запрос с другого источника (cross-origin HTTP request), если источник текущего документа отличается от запрашиваемого ресурса доменом, протоколом или портом.

Пример cross-origin запроса: HTML страница, обслуживаемая сервером с http://domain-a.com, запрашивает <img> src по адресу http://domain-b.com/image.jpg. Сегодня многие страницы загружают ресурсы вроде CSS-стилей, изображений и скриптов с разных доменов, соответствующих разным сетям доставки контента (Content delivery networks, CDNs).

В целях безопасности браузеры ограничивают cross-origin запросы, инициируемые скриптами. Например, XMLHttpRequest и Fetch API следуют политике одного источника (same-origin policy). Это значит, что web-приложения, использующие такие API, могут запрашивать HTTP-ресурсы только с того домена, с которого были загружены, пока не будут использованы CORS-заголовки.

![](CORS_principle.png)

Механизм CORS поддерживает кросс-доменные запросы и передачу данных между браузером и web-серверами по защищенному соединению. Современные браузеры используют CORS в API-контейнерах, таких как XMLHttpRequest или Fetch, чтобы снизить риски, присущие запросам с других источников.

Для работы с кросс-доменными запросами используем библиотеку - Cors

сначала установите Cors в своем приложении.
```javascript
npm i cors
```

после установки cors необходимо подключение модуля к вашему основному файлу

```javascript
const cors = require('cors');
```
И теперь надо передать функции из приложения cors к нашему экземпляру Express с помощью директивы .use
Простой вариант использования модуля для всех маршрутов (Enable All CORS Requests)

```javascript
var express = require('express')
var cors = require('cors')
var app = express()

app.use(cors())

app.get('/products/:id', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
})

app.listen(80, function () {
  console.log('CORS-enabled web server listening on port 80')
})
```

или вот такой вариант, с расширенными настройками


```javascript
var allowCrossDomain = function(req, res, next) {
res.header("Access-Control-Allow-Origin", "*"); // allow requests from any other server
res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE'); // allow these verbs
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control");

app.use(allowCrossDomain); // plumbing it in as middleware
```

