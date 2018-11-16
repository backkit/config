const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const yaml = require('js-yaml');

const skipAutoconf = process.env.NO_AUTOCONF ? true : false;

const generate = (serviceName, moduleName, config) => {
  const serviceDir = `${__dirname}/../../services`;
  const servicePath = `${__dirname}/../../services/${serviceName}.js`;
  const configDir = `${__dirname}/../../config`;

  // save service config
  console.log(`creating config folder: ${configDir}`);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, {recursive: true});
  }

  // enable service
  console.log(`creating service alias: ${servicePath}`);
  if (!fs.existsSync(serviceDir)) {
    fs.mkdirSync(serviceDir, {recursive: true});
  }
  if (!fs.existsSync(servicePath)) {
    fs.writeFileSync(servicePath, `module.exports = require('${moduleName}')`);
  }
};

if (!skipAutoconf) {
  const packageJson = require('./package.json');
  const serviceName = 'config';
  const moduleName = packageJson.name;
  generate(serviceName, moduleName, {});
}
