/// <reference types="cypress" />

import {installPlugin} from '../../src/';

/**
* @type {Cypress.PluginConfig}
*/
module.exports = (on, config) => {
  installPlugin(on);
}
