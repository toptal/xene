import test, { TestContext } from 'ava'
import { TestBot } from './helpers/test-bot'

interface IContext extends TestContext { context: { bot: TestBot } }
test.beforeEach(t => { t.context.bot = new TestBot() })

const CHANNEL = 'channel'
const msg = (message) => ({ channel: CHANNEL, message })

test('When same pattern registered twice, only first matches', (t: IContext) => {
  t.context.bot
    .when('hi').say('hey you')
    .when(/hi/i).do((m, b) => b.say(m.channel, 'ho ho ho'))
    .incoming(CHANNEL, 'user', 'hi')

  t.deepEqual(t.context.bot.lastMessage, msg('hey you'))
})

test('Questions of dialogs are asked only when previous question to user is resolved', (t: IContext) => {
  t.plan(9)
  const dialog1 = t.context.bot.dialog(CHANNEL, ['user'])
  const dialog2 = t.context.bot.dialog(CHANNEL, ['user'])

  dialog1.on('incomingMessage', m => t.pass())
  dialog1.on('outgoingMessage', m => t.pass())

  dialog1.ask('q1', m => true)
  dialog2.ask('q2', m => true)
  dialog1.ask('q3', m => true)
  dialog1.ask('q4', m => true)

  t.deepEqual(t.context.bot.lastMessage, msg('q1'))
  t.context.bot.incoming(CHANNEL, 'user', '')

  t.deepEqual(t.context.bot.lastMessage, msg('q2'))
  t.context.bot.incoming(CHANNEL, 'user', '')

  t.deepEqual(t.context.bot.lastMessage, msg('q3'))
  t.context.bot.incoming(CHANNEL, 'user', '')

  t.deepEqual(t.context.bot.lastMessage, msg('q4'))
})

test('Different users, different dialogs, same channel', (t: IContext) => {
  const parser = () => true
  const dialog1 = t.context.bot.dialog(CHANNEL, ['user1'])
  const dialog2 = t.context.bot.dialog(CHANNEL, ['user1', 'user2'])
  const dialog3 = t.context.bot.dialog(CHANNEL, ['user2'])
  const dialog4 = t.context.bot.dialog(CHANNEL, ['user2', 'user3'])
  dialog1.ask('q1', parser)
  dialog2.ask('q2', parser)
  dialog2.ask('q5', parser)
  dialog3.ask('q3', parser)
  dialog4.ask('q4', parser)

  t.deepEqual(t.context.bot.messages, [msg('q1'), msg('q2'), msg('q4')])

  t.context.bot.incoming(CHANNEL, 'user2', '')
  t.deepEqual(t.context.bot.messages, [msg('q1'), msg('q2'), msg('q4'), msg('q5')])

  t.context.bot.incoming(CHANNEL, 'user1', '')
  t.deepEqual(t.context.bot.messages, [msg('q1'), msg('q2'), msg('q4'), msg('q5')])
})

test('Dialog with parsing errors', async (t: IContext) => {
  const dialog1 = t.context.bot.dialog(CHANNEL, ['user1'])
  const dialog2 = t.context.bot.dialog(CHANNEL, ['user1', 'user2'])
  const parser = (a) => ({ parse: reply => reply === a, isValid: i => i === true })
  dialog1.ask('q1', parser('q'))
  dialog1.parse(reply => { if (reply === 'p') return 'parsed' }).then(i => dialog1.say(i))
  dialog2.ask('q2', reply => reply === 'q')
  dialog2.parse(parser('p'), 'err')

  t.deepEqual(t.context.bot.messages, [msg('q1'), msg('q2')])

  t.context.bot.incoming(CHANNEL, 'user1', '')
  t.deepEqual(t.context.bot.messages, [msg('q1'), msg('q2'), msg('q1')])

  t.context.bot.incoming(CHANNEL, 'user1', 'q')
  await new Promise(r => process.nextTick(r))
  t.deepEqual(t.context.bot.messages, [msg('q1'), msg('q2'), msg('q1'), msg(undefined)])

  t.context.bot.incoming(CHANNEL, 'user1', 'q')
  await new Promise(r => process.nextTick(r))
  t.deepEqual(t.context.bot.messages, [msg('q1'), msg('q2'), msg('q1'), msg(undefined), msg('err')])

  t.context.bot.incoming(CHANNEL, 'user1', 'p')
  t.deepEqual(t.context.bot.messages, [msg('q1'), msg('q2'), msg('q1'), msg(undefined), msg('err')])
})

test('Flow with pause', async (t: IContext) => {
  t.plan(5)
  const dialog = t.context.bot.dialog(CHANNEL, ['user'])
  dialog.on('pause', () => t.pass())
  dialog.on('unpause', () => t.pass())
  dialog.pause('PAUSED')
  t.true(dialog.isPaused)
  t.context.bot.incoming(CHANNEL, 'user', 'message')
  t.deepEqual(t.context.bot.messages, [msg('PAUSED')])
  await dialog.say('Hi')
  t.false(dialog.isPaused)
})
