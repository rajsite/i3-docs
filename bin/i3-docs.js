#! /usr/bin/env node

/* eslint-env node */
(function () {
    'use strict';
    var ini = require('ini');
    var fs = require('fs');
    var path = require('path');
    var shelljs = require('shelljs');

    var loadi3DocsConfig = function (configPath) {
        var configText = fs.readFileSync(configPath, 'utf-8');
        var config = ini.parse(configText);

        if (Object.keys(config.output_directories).length < 1) {
            console.error('The .i3-docs.ini config file needs an output directory');
        }

        return config;
    };

    var verifyOnlyOneCommand = function (argv) {
        if (argv._.length > 1) {
            console.error('only provide one command at a time');
            process.exit(1);
        }
    };

    var install = function (argv) {
        verifyOnlyOneCommand(argv);

        // TODO perform parent search instead
        var configDir = process.cwd();
        var configPath = path.join(configDir, '.i3-docs.ini');
        var config = loadi3DocsConfig(configPath);

        var webAppDir = path.join(__dirname, '../build/*');

        // TODO actual parse output_directories
        var outputPath = path.join(configDir, config.output_directories.docs);
        shelljs.cp('-R', webAppDir, outputPath);
    };

    var build = function (argv) {
        verifyOnlyOneCommand(argv);
        console.error('Not yet implemented, please run the LabVIEW docs generation manually');
        process.exit(1);
    };

    var startOfActualArgs = 2;
    require('yargs')
        .usage('Usage: $0 <command> [options]')
        .command('build', 'Attempt to run the LabVIEW i3-docs Main VI', {}, build)
        .command('install', 'Copy the i3-docs webapp files to the build output directories', {}, install)
        .demandCommand(1)
        .help('h')
        .alias('h', 'help')
        .parse(process.argv.slice(startOfActualArgs));
}());
