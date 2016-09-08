var fs = require('fs'),
    path = require('path'),
    hogan = require('hogan.js'),
    rootFolder = '/templates/mustache',
    loaderUtils = require('loader-utils');

module.exports = function(source) {
    'use strict';
    var query = loaderUtils.parseQuery(this.query);

    function inline_mustache_template(tmplPath) {
        if (!tmplPath) {
            return '';
        }
        var templates = {},
            tmpl = fs.readFileSync(path.resolve(__dirname, rootFolder, tmplPath)).toString(),
            compiled = Hogan.compile(tmpl);

        compiled.partials.forEach(function (key, data) {
            var template = fs.readFileSync(path.resolve(__dirname, rootFolder, data.name));

            templates[data.name] = tmpl.toString();

        });
        templates.forEach(function (partial, template) {
            tmpl.replace('{{>'+ partial +'}}', template);
        });

        return tmpl;
    }
    return "define(['hogan'], function (Hogan) { return '" + inline_mustache_template(query.path) + "'})";
};
