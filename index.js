var fs = require('fs'),
    path = require('path'),
    hogan = require('hogan.js'),
    rootFolder = path.resolve(path.dirname('')) + '/templates/mustache',
    loaderUtils = require('loader-utils');

module.exports = function(source) {
    'use strict';
    var query = loaderUtils.parseQuery(this.query);

    function inline_mustache_template(tmplPath) {
        if (!tmplPath) {
            return '';
        }
        var templates = {},
            compiled = Hogan.compile(source);

        compiled.partials.forEach(function (key, data) {
            var template = fs.readFileSync(path.resolve(rootFolder, data.name));

            templates[data.name] = template.toString();

        });
        templates.forEach(function (partial, template) {
            source.replace('{{>' + partial + '}}', template);
        });

        return source;
    }
    return "define(['hogan'], function (Hogan) { return '" + inline_mustache_template(query.path) + "'})";
};
