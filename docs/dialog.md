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

### `talk`
```ts
talk() => Promise<void>
```
Все общение(отправлять сообщения, парсить, спрашивать допольнительную информацию) в рамках этого диалога вы будете делать в этом методе. Его вызовет `Bot` если сообщение пользователя является началом этого диалога и будет ждать пока `talk` завершится ознаменовав окончание разговора.

### `message`
```ts
message(msg: Message) => Promise<void>
// Message is a message type defined in bot class
```

Метод `message` отправит отформатированное сообщение пользователю и верент promise с результатом отправки сообщения. 

[Link to formatting spec]

### `parse`
Метод `parse` определен служит, как следует из названия, для того чтобы парсить сообщения пользователя. Когда вы визываете `parse` он создает Promise для вас который будет отрезолвен только с распарсенным значением. Чтобы было проще понять как оно работает, давайте посмотрим на тип первого варианта визова:

```ts
parse<T>(parserFunc: (msg: string) => T) => Promise<T>
```

и пример его использования

```ts
class Weather extends Dialog<Consolebot>{
  // some weather logic . . .
  async talk() {
    const {message, parse} = this
    const speciedLocation = await parse<string>(tryParseLocation)
    const location = speciedLocation || this.currentUserLocation()
    message(`Weather in ${location} is a ${this.weatherInLocation(location)}`)
  }
}
```





```ts
// +4 overloads
parse<T>(parserFunc: (msg: string) => T, errorMessage: Message) => Promise<T>
parse<T>(parserFunc: (msg: string) => T, errorCallback: (reply: string, parsed: T) => void) => Promise<T>

parse<T>(
  parserObject: { 
    parse: (msg: string) => T, 
    check: (parsed: T) => boolean 
  },
  errorMessage: Message
) => Promise<T>

parse<T>(
  parserObject: { 
    parse: (msg: string) => T, 
    check: (parsed: T) => boolean 
  },
  errorCallback: (reply: string, parsed: T) => void
) => Promise<T>
// Message is a message type defined in bot class
```
