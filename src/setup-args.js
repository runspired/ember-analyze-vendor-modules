"use strict";

const AVAILABLE_FLAGS = [
  { name: 'showBundle', flag: 'show', shortcut: 's', type: Boolean, default: false },
  { name: 'bundlePath', flag: 'bundle', shortcut: 'b', type: String, default: null },
  { name: 'projectPath', flag: 'project', shortcut: 'p', type: String, default: null }
];

const _Flags = parseFlags(AVAILABLE_FLAGS);

function parseFlags(flags) {
  const dict = Object.create(null);

  for (let i = 0; i < flags.length; i++) {
    let flag = flags[i];
    dict[`--${flag.flag}`] = flag;
    dict[`--${flag.shortcut}`] = flag;
    dict[`-${flag.flag}`] = flag;
    dict[`-${flag.shortcut}`] = flag;
  }

  return dict;
}

function createConfig() {
  const config = Object.create(null);

  for (let i = 0; i < AVAILABLE_FLAGS.length; i++) {
    let flag = AVAILABLE_FLAGS[i];
    config[flag.name] = flag.default ? (flag.type ? flag.type(flag.default) : flag.default) : null;
  }

  return config;
}

module.exports = function setupArgs(argv) {
  let config = createConfig();

  for (let i = 2; i < argv.length; i++) {
    let arg = argv[i];
    let valueIndex = arg.indexOf('=');
    let value;
    let flag = _Flags[arg];

    if (!flag && valueIndex !== -1) {
      value = arg.substr(valueIndex);
      arg = arg.subtring(0, valueIndex);
      flag = _Flags[arg];
    }

    if (flag) {
      value = value || (flag.type && flag.type !== Boolean) ? argv[++i] : true;

      config[flag.name] = flag.type ? flag.type(value) : String(value);
    }
  }

  return config;
};