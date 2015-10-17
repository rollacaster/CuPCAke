/*jshint -W049 */
import Formsy from 'formsy-react';

/**
 * Adds a validation rule for valid hostnames.
 * @memberOf module:Helpers
*/
Formsy.addValidationRule('isHostname', function(values, value) {
  const  hostRegExp = /^(([a-z.]*\:\/\/)([\w\.\-]+(\:[\w\.\&%\$\-]+)*@)?((([^\s\(\)\<\>\\\"\.\[\]\,@;:]+)(\.[^\s\(\)\<\>\\\"\.\[\]\,@;:]+)*(\.[a-zA-Z]{2,4})?)|((([01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}([01]?\d{1,2}|2[0-4]\d|25[0-5]))|(localhost))(\b\:(6553[0-5]|655[0-2]\d|65[0-4]\d{2}|6[0-4]\d{3}|[1-5]\d{4}|[1-9]\d{0,3}|0)\b)?((\/[^\/][\w\.\,\?\'\\\/\+&%\$#\=~_\-@]*)*[^\.\,\?\"\'\(\)\[\]!;<>{}\s\x7F-\xFF])?)$/;
  return hostRegExp.test(value);
});
