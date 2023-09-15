import anyTest, { TestFn } from 'ava'
import { TestBot } from './helpers/test-bot'

interface Context {
  bot: TestBot
}
const test = anyTest as TestFn<Context>
test.beforeEach(t => { t.context.bot = new TestBot() })

const msg = (message) => ({ channel: '#', message })

test('Can bind with any matcher', (t) => {
  t.plan(3)
  t.context.bot
    .when('string').do(() => t.pass())
    .when(/regex/gi).do(() => t.pass())
    .when(m => m.text === 'func').do(() => t.pass())

  t.context.bot.incoming('', '', 'string')
  t.context.bot.incoming('', '', 'regex')
  t.context.bot.incoming('', '', 'func')
})

test('Throws on unknown matcher', (t) => {
  t.throws(() => t.context.bot.when(45 as any).do(() => { /* noop */ }))
})

test('Can bind to any handler', (t) => {
  t.context.bot
    .when('do').do(({ channel }, b) => b.say(channel, 'done'))
    .when('talk').talk(d => d.say('talked'))
    .when('say').say('said')

  t.context.bot.incoming('#', '@', 'do')
  t.context.bot.incoming('#', '@', 'talk')
  t.context.bot.incoming('#', '@', 'say')
  t.deepEqual(t.context.bot.messages, [msg('done'), msg('talked'), msg('said')])
})
