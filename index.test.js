const desugarClass = require('./index')

const code = `
class Test {}
class Omg {}
`.trim('\n')

const buildCase = (input, expected) => {
  expect(desugarClass(input.trim('\n'))).toEqual(expected.trim('\n'))
}

it('tranforms class declaration to function declaration', () => {
  buildCase(
    `
class Test {}
class Omg {}
`,
    `
function Test() {}
function Omg() {}
`
  )
})
