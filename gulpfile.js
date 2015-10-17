var requireDir = require('require-dir');

//Load all build tasks
requireDir('./build/tasks', { recurse: true});
