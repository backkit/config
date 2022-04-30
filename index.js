const fs = require('fs');
const camelCase = require('camelcase');
const yaml = require('js-yaml');
require('dotenv').config();

/**
 * String.prototype.replaceAll() polyfill
 * https://gomakethings.com/how-to-replace-a-section-of-a-string-with-another-one-with-vanilla-js/
 * @author Chris Ferdinandi
 * @license MIT
 */
if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function(str, newStr){

    // If a regex pattern
    if (Object.prototype.toString.call(str).toLowerCase() === '[object regexp]') {
      return this.replace(str, newStr);
    }

    // If a string
    return this.replace(new RegExp(str, 'g'), newStr);

  };
}

class Config {
  constructor(services) {
    this.configs = null;
    this.logfn = console.log;
    // attempt to use logger service if exists, to have more consistent logs across the app
    // otherwise, fallback to console.log
    try {
      this.logfn = services.logger.info;
    } catch (ex) {}
  }

  loadConfigs() {
    if (this.configs === null) {
      this.configs = {};
      fs.readdirSync('./config').forEach(file => {
        if (file.endsWith(".yml")) {
          const name = camelCase(file.substr(0, file.length - 4));
          this.logfn(`loading config from ./config/${file} as "${name}"`);
          const confRaw = fs.readFileSync(`./config/${file}`, 'utf8')
          const confWithVars = this.__injectEnvToString(confRaw);
          this.configs[name] = yaml.safeLoad(confWithVars);
        }
      });
    } 
  }

  __injectEnvToString(orig) {
    const rawVars = orig.match(/\{\{(\ *ENV.[A-Za-z0-9_]+\ *)\}\}/ig);
    if (rawVars) {
      const replacements = rawVars.map(el => {
        const trim = el.replace(/\s/g, '');
        return {
          placeholder: el,
          envname: trim.substring(6, trim.length - 2)
        };
      });
      let ret = orig;
      for (let swap of replacements) {
        ret = ret.replaceAll(swap.placeholder, process.env[swap.envname] || '');
      }
      return ret;
    }
    return orig;    
  }

  get(name) {
    this.loadConfigs();
    return this.configs[name];
  }
}

module.exports = Config;