import test, { ContextualTestContext } from 'ava'
import * as sinon from 'sinon'
import Dialog from '../../dialog'
import Testbot from '../../bots/test'

interface IContext extends ContextualTestContext {
  context: { bot: Testbot, dialog: Dialog<Testbot> }
}

test.beforeEach((t: IContext) => {
  const bot = new Testbot({ dialogs: [] })
  const dialog = new Dialog<Testbot>(bot, 'chat')
  t.context = { bot, dialog }
})

test('Sends formatted message', (t: IContext) => {
  const { bot, dialog } = t.context
  const sender = sinon.stub(bot, 'sendMessage')
  const formatter = sinon.stub(bot, 'formatMessage').returns('Formatted Message')
  const lifecycle = sinon.stub(dialog, 'onOutgoingMessage')
  dialog.message('Message')
  t.true(formatter.calledWithExactly('Message', dialog))
  t.true(lifecycle.calledWithExactly('Formatted Message'))
  t.true(sender.calledWithExactly(dialog.chat, 'Formatted Message'))
})

test('Sends formatted message', (t: IContext) => {
  const { bot, dialog } = t.context
  const sender = sinon.stub(bot, 'sendMessage')
  const formatter = sinon.stub(bot, 'formatMessage').returns('Formatted Message')
  const lifecycle = sinon.stub(dialog, 'onOutgoingMessage')
  dialog.message('Message')
  t.true(formatter.calledWithExactly('Message', dialog))
  t.true(lifecycle.calledWithExactly('Formatted Message'))
  t.true(sender.calledWithExactly(dialog.chat, 'Formatted Message'))
})
