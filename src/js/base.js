var APP = APP || {};

APP.namespace = function (ns_string) {
  var parts = ns_string.split('.'),
    parent = APP,
    i;
  if (parts[0] === 'APP') {
    parts = parts.slice(1);
  }
  for (i = 0; i < parts.length; i += 1) {
    if (typeof parent[parts[i]] === 'undefined') {
      parent[parts[i]] = {};
    }
    parent = parent[parts[i]];
  }
  return parent;
};

// Usage
// APP.namespace('APP.sample');
// APP.sample = function(){}
