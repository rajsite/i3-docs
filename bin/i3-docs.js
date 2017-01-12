#! /usr/bin/env node

/* eslint-env node */
(function () {
    'use strict';
    var ini = require('ini');
    var fs = require('fs');
    var path = require('path');
    var shelljs = require('shelljs');
    var findParentDir = require('find-parent-dir');
    var pathIsInside = require('path-is-inside');
    var yargs = require('yargs');

    var log = function () {
        // Intentionally blank
    };

    var createLogger = function (verbose) {
        if (verbose) {
            log = console.log.bind(console);
        }
    };

    var findI3DocsConfigDir = function (cwd) {
        var configDir = findParentDir.sync(cwd, '.i3-docs.ini');

        if (configDir === null) {
            console.error('Could not find .i3-docs.ini config file in current working directory or parent directory.');
            console.error(' - Current working directory:', cwd);
            process.exit(1);
        }

        return configDir;
    };

    var loadI3DocsConfig = function (configDir) {
        var configPath = path.join(configDir, '.i3-docs.ini');
        log('Configuration file (.i3-docs.ini) path:', configPath);

        var configText = fs.readFileSync(configPath, 'utf-8');
        var config = ini.parse(configText);

        if (config.output_directories === undefined) {
            console.error('The .i3-docs.ini config file needs an output_directories section');
            process.exit(1);
        }

        if (Object.keys(config.output_directories).length < 1) {
            console.error('The .i3-docs.ini output_directories section needs at least one project specified');
            process.exit(1);
        }

        return config;
    };

    var createAbsoluteOutputDirectoryEntries = function (configDir, config) {
        log('Identifying projects in .i3-docs.ini [start]');
        var absoluteOutputDirectoryEntries = {};
        Object.keys(config.output_directories).forEach(function (configProjectName) {
            var relativeOutputDirectory = config.output_directories[configProjectName];
            var absoluteOutputDirectory = path.join(configDir, relativeOutputDirectory);

            try {
                var stats = fs.statSync(absoluteOutputDirectory);

                if (stats.isDirectory() === false) {
                    console.error('The resolved output directory path specified in the following project in not a directory:');
                    console.error(' - Project Name:', configProjectName);
                    console.error(' - Output directory relative to .i3-docs.ini:', relativeOutputDirectory);
                    console.error(' - Resolved output directory path:', absoluteOutputDirectory);
                    process.exit(1);
                }
            } catch (ex) {
                console.error('The resolved output directory path specified in the following project does not exist:');
                console.error(' - Project Name:', configProjectName);
                console.error(' - Output directory relative to .i3-docs.ini:', relativeOutputDirectory);
                console.error(' - Resolved output directory path:', absoluteOutputDirectory);
                process.exit(1);
            }

            absoluteOutputDirectoryEntries[configProjectName] = absoluteOutputDirectory;
            log('Found project:', configProjectName, 'at directory:', absoluteOutputDirectory);
        });
        log('Identifying projects in .i3-docs.ini [end]');

        return absoluteOutputDirectoryEntries;
    };

    var installWebAppToAbsoluteDirectoryEntries = function (webAppFilesRoot, absoluteOutputDirectoryEntries) {
        var webAppFileList = webAppFilesRoot + '*';

        log('Copying web app files to output directories [start]');
        Object.keys(absoluteOutputDirectoryEntries).forEach(function (configProjectName) {
            var absoluteOutputDirectory = absoluteOutputDirectoryEntries[configProjectName];

            if (pathIsInside(absoluteOutputDirectory, webAppFilesRoot)) {
                console.error('Resolved output directory target cannot be inside of web app file root');
                console.error(' - Resolved output directory path:', absoluteOutputDirectory);
                console.error(' - Web app files root:', webAppFilesRoot);
                process.exit(1);
            }

            log('Starting copy of web app files for project', configProjectName);
            shelljs.cp('-R', webAppFileList, absoluteOutputDirectory);
            log('Finish copy of web app files for project', configProjectName);
        });
        log('Copying web app files to output directories [end]');
    };

    var verifyOnlyOneCommand = function (argv) {
        if (argv._.length > 1) {
            console.error('only provide one command at a time');
            process.exit(1);
        }
    };

    var install = function (argv) {
        verifyOnlyOneCommand(argv);
        createLogger(argv.v);

        var cwd = process.cwd();
        log('Current Working Directory:', cwd);

        var webAppFilesRoot = path.join(__dirname, '../build/');
        log('Web App Files Root', webAppFilesRoot);

        var configDir = findI3DocsConfigDir(cwd);
        var config = loadI3DocsConfig(configDir);
        var absoluteOutputDirectoryEntries = createAbsoluteOutputDirectoryEntries(configDir, config);
        installWebAppToAbsoluteDirectoryEntries(webAppFilesRoot, absoluteOutputDirectoryEntries);
    };

    var startOfActualArgs = 2;
    yargs.usage('Usage: $0 <command> [options]')
         .command('install', 'Copy the i3-docs webapp files to the build output directories', {}, install)
         .demandCommand(1)
         .help('h')
         .alias('h', 'help')
         .boolean('v')
         .alias('v', 'verbose')
         .describe('v', 'verbose logging')
         .parse(process.argv.slice(startOfActualArgs));
}());
