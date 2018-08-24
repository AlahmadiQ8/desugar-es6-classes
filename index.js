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

j.registerMethods(
  {
    build: function() {
      return this.find(j.MethodDefinition)
        .filter(path => path.value.key.name === 'constructor')
        .find(j.FunctionExpression)
    },
  },
  j.ClassDeclaration
)

const desugarClass = code => {
  return j(code)
    .find(j.ClassDeclaration)
    .forEach(path => {
      const className = path.node.id.name
      let declaration
      let prototypes = []
      j(path)
        .find(j.MethodDefinition)
        .forEach(path => {
          const methodName = path.value.key.name
          const isStatic = path.value.static
          if (methodName === 'constructor') {
            j(path)
              .find(j.FunctionExpression)
              .forEach(path => {
                declaration = j.functionDeclaration(
                  j.identifier(className),
                  path.value.params,
                  path.value.body
                )
              })
          } else {
            j(path)
              .find(j.FunctionExpression)
              .forEach(path => {
                const method = j.functionExpression(
                  null,
                  path.value.params,
                  path.value.body
                )
                const prototype = j.expressionStatement(
                  j.assignmentExpression(
                    '=',
                    j.memberExpression(
                      !isStatic
                        ? j.memberExpression(
                            j.identifier(className),
                            j.identifier('prototype'),
                            false
                          )
                        : j.identifier(className),
                      j.identifier(methodName),
                      false
                    ),
                    method
                  )
                )
                prototypes.push(prototype)
              })
          }
        })
      if (!declaration) {
        declaration = j.functionDeclaration(
          j.identifier(className),
          [],
          j.blockStatement([])
        )
      }
      j(path).replaceWith(declaration)
      while (prototypes.length > 0) {
        j(path).insertAfter(prototypes.pop())
      }
    })
    .toSource()
}

module.exports = desugarClass
