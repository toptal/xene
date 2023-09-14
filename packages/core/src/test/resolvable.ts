import test from 'ava'
import { Resolvable } from '../resolvable'

test('Resolves with correct value', async t => {
  const s = new Resolvable<any>()
  s.promise.then(v => t.is(v, 5))
  s.resolve(5)
  t.pass()
})

test('Rejects with correct error', async t => {
  const s = new Resolvable<any>()
  s.promise.catch(err => t.is(err.message, 'Error5'))
  s.reject(new Error('Error5'))
  t.pass()
})
