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

it('preserve constructor into function declaration', () => {
  buildCase(
    `
class Test {
  constructor() {
    const a = 1
  }
}

class Omg {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}
`,
    `
function Test() {
  const a = 1
}

function Omg(x, y) {
  this.x = x
  this.y = y
}
`
  )
})

it('converts methods to prototype declarations', () => {
  buildCase(
    `
class Test {
  constructor() {
    const a = 1
  }

  run() {
    const foo = () => 'phiphi'
  }
}

class Omg {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  add(x, y) {
    return x + y
  }

  substract(x, y) {
    return x - y
  }
}
`,
    `
function Test() {
  const a = 1
}

Test.prototype.run = function() {
  const foo = () => 'phiphi'
};

function Omg(x, y) {
  this.x = x
  this.y = y
}

Omg.prototype.add = function(x, y) {
  return x + y
};

Omg.prototype.substract = function(x, y) {
  return x - y
};
`
  )
})

it('converts static methods to prototype declarations', () => {
  buildCase(
    `
class Test {
  constructor() {
    const a = 1
  }

  run() {
    const foo = () => 'phiphi'
  }
}

class Omg {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  static multip(x, y) {
    return x * y
  }

  add(x, y) {
    return x + y
  }

  substract(x, y) {
    return x - y
  }
}
`,
    `
function Test() {
  const a = 1
}

Test.prototype.run = function() {
  const foo = () => 'phiphi'
};

function Omg(x, y) {
  this.x = x
  this.y = y
}

Omg.multip = function(x, y) {
  return x * y
};

Omg.prototype.add = function(x, y) {
  return x + y
};

Omg.prototype.substract = function(x, y) {
  return x - y
};
`
  )
})
