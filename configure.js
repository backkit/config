const autoconf = require("@backkit/autoconf");

autoconf('config')
.generator(self => ([
  {
    mkdirp: self.rootServiceDir
  },
  {
    putFileOnce: self.serviceCodeMainJS,
    content: `module.exports = require('${self.npmModuleName}')`
  }
]))
.default(self => ({}))
.prompt(self => ([]))
.run()

