/* eslint-disable */
/* eslint-disable import/no-extraneous-dependencies */
import $ from "jquery";
import jQueryConstructor from "../utils/jQuery.constructor";
import CamelCase from "../../utils/camel-case";

/**
 * @typedef {{
 *  name:string,
 *  pluginName:string,
 *  plugin:(string|function),
 *  selector:string=undefined}
 *  } Plugin
 */

let allPlugins = [];

$.fn.initPlugins = initPlugins;
$.fn.destroyPlugins = destroyPlugins;

function initPlugins(params) {
  allPlugins.forEach(initElement(this, params));
  return this;
}

function destroyPlugins() {
  allPlugins.forEach(initElement(this, "destroy"));
  return this;
}

/**
 *
 * @param {jQuery|HTMLElement|*} $target
 * @param {string|Object} action
 * @return {Function}
 */
function initElement($target, action) {
  return _;

  /**
   * @param {Plugin|function} plugin
   * @private
   */
  function _(plugin) {
    let p = typeof plugin === "function" ? plugin() : plugin;
    if (p && p.selector) {
      $($target)
        .filter(p.selector)
        .add($($target).find(p.selector))
        [p.pluginName](action);
    }
  }
}

/**
 * @param {function[]|Plugin[]} plugins
 */
export function registerPlugins(...plugins) {
  plugins = normalize(plugins);

  allPlugins = allPlugins.concat(plugins);

  plugins.forEach(function(plugin) {
    // $.fn[plugin.name] = plugin.plugin;
    let _name = (plugin.pluginName =
      plugin.pluginName || CamelCase.to(plugin.name));

    let index = 0;
    while ($.fn.hasOwnProperty(_name)) {
      _name += ++index;
    }
    if (plugin.pluginName !== _name) {
      console.warn(
        `${
          plugin.pluginName
        } уже используется в jQuery, функция переименована в ${_name}`
      );
    }
    $.fn[(plugin.pluginName = _name)] = jQueryConstructor(
      plugin.Constructor,
      plugin.name
    );
  });
}

export class Plugin {
  __destroy = [];

  constructor($element) {
  }

  init(action, ...args) {
    if (action && typeof this[action] === "function") {
      return this[action].apply(this, args);
    }
    if (typeof this.defaultAction === "function") {
      return this.defaultAction.apply(this, arguments);
    }
  }

  get isDestroyed() {
    return !this.__destroy;
  }

  destroy() {
    const arr = this.__destroy;
    delete this.__destroy;
    if (Array.isArray(arr)) {
      while (arr.length > 0) {
        arr.shift()();
      }
    }
  }
}

/**
 *
 * @param plugins
 * @return {Plugin[]}
 */
function normalize(plugins) {
  if (!Array.isArray(plugins)) plugins = [plugins];

  plugins.forEach(function(plugin) {
    if (typeof plugin !== "function" && !plugin.name) {
      throw new Error("Plugin name required");
    }
    if (!plugin.hasOwnProperty("selector")) {
      plugin.selector = `.${plugin.name}`;
    }
  });

  return plugins;
}
