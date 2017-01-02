#! /usr/bin/env node

/* eslint-env node */
(function () {
    'use strict';
    var ini = require('ini');
    var fs = require('fs');
    var path = require('path');
    var shelljs = require('shelljs');
    var findParentDir = require('find-parent-dir');
    var yargs = require('yargs');

    var loadI3DocsConfig = function (configPath) {
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

        var cwd = process.cwd();
        var configDir = findParentDir.sync(cwd, '.i3-docs.ini');

        if (configDir === null) {
            console.error('Could not find .i3-docs.ini config file');
            process.exit(1);
        }

        var configPath = path.join(configDir, '.i3-docs.ini');
        var config = loadI3DocsConfig(configPath);

        var webAppFileList = path.join(__dirname, '../build/*');

        var absoluteOutputDirectories = Object.keys(config.output_directories).map(function (relativeOutputDirectory) {
            var absoluteOutputDirectory = path.join(configDir, relativeOutputDirectory);
            return absoluteOutputDirectory;
        });

        absoluteOutputDirectories.forEach(function (absoluteOutputDirectory) {
            shelljs.cp('-R', webAppFileList, absoluteOutputDirectory);
        });
    };

    var startOfActualArgs = 2;
    yargs.usage('Usage: $0 <command> [options]')
         .command('install', 'Copy the i3-docs webapp files to the build output directories', {}, install)
         .demandCommand(1)
         .help('h')
         .alias('h', 'help')
         .parse(process.argv.slice(startOfActualArgs));
}());
