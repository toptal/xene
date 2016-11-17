import * as chai from 'chai'
import fomrat from '../../helpers/format-string'
const expect = chai.expect

describe('Format string:', () => {
  it('should format by single key', () => {
    const str = 'test {test}'
    const obj = {test: 'string'}
    const formatted = fomrat(str, obj)
    expect(formatted).to.equals('test string')
  })

  it('should format by nested key', () => {
    const str = 'test {test.nested}'
    const obj = {test: {nested: 'string'}}
    const formatted = fomrat(str, obj)
    expect(formatted).to.equals('test string')
  })

  it('should not format by missing key', () => {
    const str = 'test {test.nested}'
    const obj = {test: {missing: 'string'}}
    const formatted = fomrat(str, obj)
    expect(formatted).to.equals('test {test.nested}')
  })
})
