# Dialogs

Xene использует диалоги для общения с ползователями, львиную долю логики разговора вы будете описывать в диалогах. И это очень просто сделать: Вам потребуется subclass от базового класса `Dialog` и определить метод `talk` и либо `match`, либо свойсвто `isDefault`.

## Первые шаги

Давайте создадим простой класс диалога и научим нашего бота отвечать на приветсвия.

```ts
import Consolebot from 'xene/bots/console'
import Dialog from 'xene/dialog'

class Greeting extends Dialog<Consolebot> {
  static match(message: string) {
    return /hi/i.test(message)
  }
  async talk() {
    this.message("Hi master!")
  }
}

const bot = new Consolebot({ dialogs: [ Greeting ] })
```

Здесь мы определили статичный метод `match` который будет вызван ботом чтоб проверить подходит ли сообщение пользователя этому диалогу и метод `talk`, который будет вызван если `match` вернул `true`.

Если мы сейчас напишем нашему боту **Hi**, то он ответит **Hi master!**, это очень здорово, но что будет если мы напишем ему **What's up?** или что угодно еще? Ничего, наш бот просто промолчит, потому что он не знает как вести диалоги начинающиеся с таких фраз.

Но мы можем его научить хотя бы говорить что он не знает этой фразы вместо молчания.

Давайте добавим простой класс диалога на случай если мы не поняли пользователя

```ts
// ...
class Default extends Dialog<Consolebot> {
  static isDefault = true
  async talk() {
    this.message("I didn't understand you :(")
  }
}

const bot = new Consolebot({ dialogs: [ Greeting, Default ] })
```

Тут мы создали стандартный диалог в котором на любое сообщение пользователя которому не нашлось других диалогов наш бот будет говорить `I didn't understand you :(`. Здесь мы использовали статичное свойсвто `isDefault` чтобы сказать нашему боту что этот стандартный диалог.

_Note:В реальном проекте лучше всего в стандартном диалоге отправить пользователю **help**._

##  Немного про типобезопасность

Давайте посмотрим на наши диалоги еще раз. А именно на конструкцию `Dialog<Consolebot>`, мы передаем здесь type argument'ом класс бота и это обязательный аргемент потому что каждый из типов ботов может отправлять разные виды сообщений — одни могут отправлять только строки(как `Consolebot`), а другие могут отправлять еще и файлы и красиво оформленные attachments(как `Slackbot`). И чтобы наш бот был безопасным при компилировании(да и для подсказок в IDE) мы указываем для какого типа бота наш диалог. В зависимости от типа бота меняются 3 метода нашего бота: уже знакомый нам `message`, `ask` и `parse`.

## Методы `Dialog`

### `Dialog#talk`
```ts
talk() => Promise<void>
```
Все общение(отправлять сообщения, парсить, спрашивать допольнительную информацию) в рамках этого диалога вы будете делать в этом методе. Его вызовет `Bot` если сообщение пользователя является началом этого диалога и будет ждать пока `talk` завершится ознаменовав окончание разговора.

### `Dialog#message`
```ts
message(msg: Message) => Promise<void>
```

Метод `message` отправит отформатированное сообщение пользователю и верент promise с результатом отправки сообщения.

[Link to formatting spec]

**NOTE: `Message` is a message type defined in bot class**

### `Dialog#parse`
Метод `parse` определен служит, как следует из названия, для того чтобы парсить сообщения пользователя. Когда вы визываете `parse` он создает Promise для вас который будет отрезолвен только с распарсенным значением. Чтобы было проще понять как оно работает, давайте посмотрим на пример:

```ts
class Weather extends Dialog<Consolebot>{
  // some weather logic . . .
  async talk() {
    const {message, parse} = this
    message('Give me a second, connecting WeatherChannel...')
    const speciedLocation = await parse<string>(locationParser)
    const location = speciedLocation || this.currentUserLocation()
    message(`Weather in ${location} is a ${this.weatherInLocation(location)}`)
  }
}
```

Нас тут инетесует только вызов метода `parse` которому мы передали парсер `locationParser`. Про то как выглядят сами парсеры читайте в [link]. Что же он парсит? На самом деле у каждого `Dialog` есть очередь из парсеров, который запускаются на последнее сообщение пользователя и `Dialog` берет следующий парсер и парсит им сообщение до тех пор пока очередь не опустеет или сообщение не получилось распарсить. В нашем примере наш парсер запуститься на первом и единственном сообщении пользователя. Потому что мы игнорируем неудачные попытка парсинга.


```ts
parse<T>(parserFunc: (msg: string) => T) => Promise<T>
```
ошибки в процессе парсинга(falsy return value) будут проигнорирована и парсер будет исключен из очереди так как будто он вернул


```ts
parse<T>(parserFunc: (msg: string) => T, errorMessage: Message) => Promise<T>
```
если в процессе парсинга произошла ошибка(falsy return value) то будет отправлено сообщение `errorMessage` пользователю и парсер будет ждать в очереди до следующего сообщения пользователя

```ts
parse<T>(
  parserObject: {
    parse: (msg: string) => T,
    check: (parsed: T) => boolean
  },
  errorMessage: Message
) => Promise<T>
```
то же что и выше только парсинг будет считаться невалидным только если `check` вернет `false`


```ts
parse<T>(parserFunc: (msg: string) => T, errorCallback: (msg: string, parsed: T) => void) => Promise<T>
```
то же что и чуть выше только вместо отправки сообщения будет вызван ващ callback с сообщением пользователя и результатом парсинга

```ts
parse<T>(
  parserObject: {
    parse: (msg: string) => T,
    check: (parsed: T) => boolean
  },
  errorCallback: (msg: string, parsed: T) => void
) => Promise<T>
```
тоже самое только парсер не функция о объект с валидатором


### `Dialog#ask`
`ask` это метод который поможет вам получить от пользователя то что вам нужно. Он в своей сути есть комбинацию из `message` и `parse`. Если бы вы хотели реализовать ваш собственный метод `ask` то он выглядел бы примерно так:

```ts
class Dialog {
  async ask<T>(msg, parser, errorCallback?) {
    await this.message(msg)
    return this.parse<T>(parser, errorCallback)
  }
}
```

Не сложно правдва ли, но с помощью `ask` вы можете строить очень сложные диалогы. Давайте улучшим наш пример с погодным диалогом использую `ask`:


```ts
class Weather extends Dialog<Consolebot>{
  // some weather logic . . .
  async talk() {
    const {message, parse, ask} = this
    message('Give me a second, connecting WeatherChannel...')
    const speciedLocation = await parse<string>(locationParser)
    const daysForecast = await ask<number>('For how many days you need forecast?', dateNumberParser)
    const location = speciedLocation || this.currentUserLocation()
    message(`Weather in ${location} for ${daysForecast} is a ${this.weatherInLocation(location)}`)
  }
}
```

как видите добавив простой метод мы смогли получить очень много информации от пользователя.

#### 1.
```ts
ask<T>(message: Message, parserFunc: (msg: string) => T) => Promise<T>
```
если `parserFunc` вернет falsy value, то `message` будет отправлен еще раз до тех пор пока `parserFunc` не вернет не falsy value

#### 2.
```ts
ask<T>(
  message: Message,
  parserObject: {
    parse: (msg: string) => T
    check: (parsed: T) => boolean
  }
) => Promise<T>
```
то же самое что и в [1.](#1) только будет проверяться что return value of check is not `false` instead of check for falsy return value on `parse` fucntion

#### 3.
```ts
ask<T>(message: Message, parserFunc: (msg: string) => T, errorMessage: Message) => Promise<T>
```
то же самое что и в [1.](#1) то же самое только если после первого парсинга `parserFunc` вернет falsy value, то `errorMessage` будет отправлен

#### 4.
```ts
ask<T>(
  message: Message,
  parserObject: {
    parse: (msg: string) => T
    check: (parsed: T) => boolean
  },
  errorMessage: Message
) => Promise<T>
```
то же самое что и в [3.](#3) только будет проверяться что return value of check is not `false` instead of check for falsy return value on `parse` fucntion

#### 5.
```ts
ask<T>(
  message: Message,
  parserFunc: (msg: string) => T,
  errorCallback: (reply: string, parsed: T) => void
) => Promise<T>
```
то же самое что и в [3.](#3) только вместо отправки сообщения в случае ошибок управление будет передано `errorCallback`

#### 6.
```ts
ask<T>(
  message: Message,
  parserObject: {
    parse: (msg: string) => T
    check: (parsed: T) => boolean
  },
  errorCallback: (reply: string, parsed: T) => void
) => Promise<T>
```
то же самое что и в [5.](#5) только будет проверяться что return value of check is not `false` instead of check for falsy return value on `parse` fucntion
