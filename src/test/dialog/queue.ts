import test from 'ava'
import * as sinon from 'sinon'

import Queue from '../../dialog/queue'

test('doesn\'t parse without a message', (t) => {
  const queue = new Queue()
  const obj = {
    parser: {
      parse: sinon.stub().returns('message'),
      check: (msg) => !!msg
    },
    done: sinon.stub
  }
  const process = sinon.spy(queue, 'processMessage')
  const internalQueue = sinon.spy(queue['queue'], 'push')
  queue.push(obj)

  t.true(process.called)
  t.true(internalQueue.calledWithExactly(obj))
  t.true(obj.parser.parse.notCalled)
})

test('reset message', (t) => {
  const queue = new Queue()
  queue.processMessage('some message')
  queue.resetMessage()
  t.is(queue['message'], null)
})

test('calls `done` if `check` fails but `error` is missing', async (t) => {
  const queue = new Queue()
  const message = 'Some message'
  const obj = {
    parser: {
      parse: sinon.stub().returns('parsed'),
      check: sinon.stub().returns(false)
    },
    done: sinon.stub()
  }

  await queue.processMessage(message)
  await queue.push(obj)
  t.true(obj.parser.parse.calledWithExactly(message))
  t.true(obj.parser.check.calledWithExactly('parsed'))
  t.true(obj.done.calledWithExactly('parsed'))
  t.is(queue['queue'].length, 0)
})

test('calls `error` if `check` fails and `error` is present', async (t) => {
  const queue = new Queue()
  const message = 'Some message'
  const obj = {
    parser: {
      parse: sinon.stub().returns('parsed'),
      check: sinon.stub().returns(false)
    },
    done: sinon.stub(),
    error: sinon.stub()
  }

  await queue.processMessage(message)
  await queue.push(obj)
  t.true(obj.parser.parse.calledWithExactly(message))
  t.true(obj.parser.check.calledWith('parsed'))
  t.true(obj.done.notCalled)
  t.true(obj.error.calledWithExactly(message, 'parsed'))
})
