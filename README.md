# i3-docs
[![Readme Link](https://img.shields.io/badge/Link-README-green.svg)](https://github.com/rajsite/i3-docs)
[![Example Link](https://img.shields.io/badge/Link-Example-green.svg)](https://rajsite.github.io/i3-docs/apidocs/)

i3-docs lets you search, inspect, and link to LabVIEW VIs from your web browser. Documentation is meant to be seen!

[![i3 docs usage example](http://i.imgur.com/ae4YYSo.gif)](https://rajsite.github.io/i3-docs/apidocs/)

# Features
- Shows VI display name, description, connector pane and block diagram screenshots
- Modern mobile-friendly UI
- Client side text search
- Url parameters to link to specific searches

# Examples
- [i3-docs generated documentation](https://rajsite.github.io/i3-docs/apidocs)

# Quick Start

## Prerequisites
- [Node.js](https://nodejs.org/en/) (LTS 6.9 or up recommended)
- LabVIEW 2014 or up
- LabVIEW Project file (.lvproj) that organizes the VIs for your project

## Setup
1. With the above prerequisites installed open a command-line in the folder with your `.lvproj` file and run the following command:

   `npm install -g i3-docs`

   This will globally install the i3-docs package and dependencies on your system.

   *Note: If you are familiar with npm and the `package.json` format it is recommended that you make a npm package for your project and install i3-docs locally as a `devDependency` instead of globally.*

2. With the i3-docs tools installed run the following command to create your `.i3-docs.ini` configuration file:

   `i3-docs init`

   This will create a file named `.i3-docs.ini` in your folder with the following content:

   ```ini
   ;Two projects using the names awesome_project1 and awesome_project2
   ;Remember that the paths are relative to the location of the .i3-docs.ini file
   [project_files]
   awesome_project1=i3-docs.lvproj
   awesome_project2=../other_awesome_project/awesome.lvproj

   ;The output directories where docs will be placed relative to this file (.i3-docs.ini)
   ;NOTE: These directories and their contents will be deleted between every run
   [output_directories]
   awesome_project1=docs
   awesome_project2=../other_awesome_project/docs

   ;By default a warning is displayed before each output directory is deleted
   ;You can prevent these warnings by uncommenting the following lines
   ;[warnings]
   ;disable_output_directory_delete_warning=true
   ```

3. Modify the following sections of the generated `.i3-docs.ini` for your project:

   `[project_files]` a named list of relative paths from .i3-docs.ini to the .lvproj file(s) for your project

   `[output_directories]` a named list of relative paths from .i3-docs.ini to directories where generated output will be placed

   NOTE: The directories listed under the `[output_directories]` section __will be deleted and recreated__ during documentation generation.

## Generate Documentation

1. With all instances of LabVIEW closed and from the folder containing your customized `.i3-docs.ini` file or a subfolder run the following command:

   `i3-docs generate`

   This will launch LabVIEW (usually the last version of LabVIEW that was opened) and generate documentation for your project based on the `.i3-docs.ini` configuration.

   NOTE: It is highly recommended that any open LabVIEW instances are closed prior to running the `i3-docs generate` command.

2. Once LabVIEW has generated its output files you can apply the i3-docs HTML, JavaScript, and CSS to the output directories using the following command:

   `i3-docs apply`

   NOTE: Due to security restrictions of Web Browsers you cannot open an HTML file locally from disk that attempts to access other files in a directory. 

   To view the generated HTML you will need to copy the output directory to a static file server or use a browser with less restrictive security such as Mozilla Firefox

# Advanced Usage
Enter a query in the search field and the page is live filtered to show project items with that search. If the search field is cleared or no result is found the filter is reset and all project items are shown.

The following url parameters can be added:

1. `search-default`: A default search value to filter the page
   
   example: [https://rajsite.github.io/i3-docs/apidocs/?search-default=Generate](https://rajsite.github.io/i3-docs/apidocs/?search-default=Generate)

2. `search-hidden`: Will hide the search bar on the page. Together with `search-default` it makes a useful way to embed the documentation for a single VI in an iframe

   example: [https://rajsite.github.io/i3-docs/apidocs/?search-default=Generate&search-hidden](https://rajsite.github.io/i3-docs/apidocs/?search-default=Generate&search-hidden)

3. `i3-docs-path`: Intended for development use. Allows one to override the path used to load the i3-docs.json file and resources
