import test from 'ava'
import { Bot as CoreBot } from '@xene/core'
import { wrap } from '../'

class Bot extends CoreBot<string | object> {
  async say(channel, msg) { /* noop */ }
  listen() { return this }
}

const subject = wrap(new Bot()
  .when(m => m.text === '2' && m.channel === 'c1' && m.user === 'u1').say('7')
  .when(m => m.text === '2' && m.channel === 'c1').say('3')
  .when('3').say({ message: ['3'] })
  .when('1').say('2')
)

test.serial('UserContext', t => {
  subject.user.says('1')
  t.true(subject.bot.said('2'))
  t.false(subject.bot.said('3'))
})

test.serial('BotContext', async t => {
  t.true(await subject.bot.on('2', 'c1').says('3'))
  t.true(await subject.bot.on('2', 'c1', 'u1').says('7', 'c1'))
  t.true(await subject.bot.on('3').says({ message: ['3'] }))
  t.false(await subject.bot.on('3').says({ message: ['3', '32'] }))
  t.true(subject.bot.messages.length !== 0)
  subject.bot.reset()
  t.true(subject.bot.messages.length === 0)
})
