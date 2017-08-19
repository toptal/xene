import test from 'ava'
import { Resolvable } from '../resolvable'

test.cb('Resolves with correct value', t => {
  const s = new Resolvable<any>()
  s.promise.then(v => t.is(v, 5)).then(t.end)
  s.resolve(5)
})

test.cb('Rejects with correct error', t => {
  const s = new Resolvable<any>()
  s.promise.catch(err => t.is(err.message, 'Error5')).then(t.end)
  s.reject(new Error('Error5'))
})
