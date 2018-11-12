const fs = require('fs');
const camelCase = require('camelcase');
const yaml = require('js-yaml');

class Config {
  constructor() {
    this.configs = null;
  }

  loadConfigs() {
    if (this.configs === null) {
      this.configs = {};
      fs.readdirSync('./config').forEach(file => {
        if (file.endsWith(".yml")) {
          const name = camelCase(file.substr(0, file.length - 4));
          console.log(`loading config from ./config/${file} as "${name}"`);
          this.configs[name] = yaml.safeLoad(fs.readFileSync(`./config/${file}`, 'utf8'));
        }
      });
    } 
  }

  get(name) {
    this.loadConfigs();
    return this.configs[name];
  }
}

module.exports = Config;