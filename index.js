const j = require('jscodeshift')

j.registerMethods(
  {
    logNames: function() {
      return this.forEach(function(path) {
        console.log(path.node.name)
      })
    },
  },
  j.Identifier
)

j.registerMethods({
  findIdentifiers: function() {
    return this.find(j.Identifier)
  },
})

const desugarClass = code => {
  return j(code)
    .find(j.ClassDeclaration)
    .forEach(path => {
      const className = path.node.id.name
      const func = j.functionDeclaration(
        j.identifier(className),
        [],
        j.blockStatement([])
      )
      j(path).replaceWith(func)
    })
    .toSource()
}

module.exports = desugarClass
