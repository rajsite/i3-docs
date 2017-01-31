# i3-docs
Awesome doc generation for LabVIEW projects

i3-docs lets you search, inspect, and link to VIs from your web browser. Documentation is meant to be read!

![i3 docs usage example](http://i.imgur.com/ae4YYSo.gif)

# Features

- Shows VI display name, description, connector pane and block diagram screenshots
- Modern mobile-friendly UI
- Client side text search
- Url parameters to link to specific searches

# Examples

- [i3-docs generated documentation](https://rajsite.github.io/i3-docs)
- [i3-twitter generated documentation](https://rajsite.github.io/i3-twitter)

# Usage

Enter a query in the search field and the page is live filtered to show project items with that search. If the search field is cleared or no result is found the filter is reset and all project items are shown.

The following url parameters can be added:

1. `search-default`: A default search value to filter the page
   
   example: [https://rajsite.github.io/i3-docs/?search-default=Generate](https://rajsite.github.io/i3-docs/?search-default=Generate)

2. `search-hidden`: Will hide the search bar on the page. Together with `search-default` it makes a useful way to embed the documentation for a single VI in an iframe

   example: [https://rajsite.github.io/i3-docs/?search-default=Generate&search-hidden](https://rajsite.github.io/i3-docs/?search-default=Generate&search-hidden)

3. `i3-docs-path`: Intended for development use. Allows one to override the path used to load the i3-docs.json file and resources

# Generating docs (Summary)

## Set-up (one-time)
1. Set-up `package.json` with command: `npm init`
2. Install i3-docs with command: `npm install i3-docs --save-dev`
3. Create `.i3-docs.ini` with command: `node_modules\.bin\i3-docs init`
4. Modify `.i3-docs.ini` with your project specific settings

## Build documentation (after VI changes)
1. Run VI to generate project data and images: `node_modules\i3-docs\lv\Main\Generate JSON Report.vi`
2. Generate HTML with command: `node_modules\.bin\i3-docs install`

# Generating docs (Detailed)
## Prerequisites
- [Node.js](https://nodejs.org/en/) (LTS 6.9 or up recommended)
- LabVIEW 2014 or up
- LabVIEW Project file (.lvproj) that organizes the VIs for your project

## Set-up (one-time)
1. Use the following steps to create a `package.json` file (preferably the root of the project or root of the repository)

   The i3-docs project is managed using the Node Package Manager (npm). A `package.json` file is used to hold configuration settings for use by npm (such as the version of i3-docs being used).

   1. Open a command prompt in the project folder.
   2. Run the command: 
      
      `npm init`
   3. Follow along with the prompt to create the `package.json` file. The defaults are usually good enough.

2. Install the `i3-docs` npm package

   In a command prompt in the folder containing `package.json` run the following command:
   
   `npm install i3-docs --save-dev`

   The `devDependencies` section of `package.json` should be updated to include `i3-docs` at the latest version. You should also see a folder named `node_modules` appear in the directory next to `package.json`.

   Note: If you are using a source code control system you may want to add an entry to *ignore* the `node_modules` folder. For example, on git you would add `/node_modules` to the `.gitignore` file.

3. Use the following steps to create an `.i3-docs.ini` file (in the same folder as the `package.json` file made above).
   The `.i3-docs.ini` file will contain all of the configuration settings for generating the docs.

   1. Open a command prompt in the folder containing the `package.json` file
   2. Run the command:

      `node_modules\.bin\i3-docs init`
   3. This will create an `i3-docs.ini` file in the directory it was run. See the following for how to configure the individual sections of the configuration file.

4. The `.i3-docs.ini` file will have the following sections to modify for your project:
   
   - `[project_files]` a named list of relative paths from .i3-docs.ini to the .lvproj file(s) for your project
   - `[output_directories]` a named list of relative directories where generated output will be placed 
    
      *NOTE: The directories listed under the `[output_directories]` section will be deleted and recreated during runs [due to how files are currently generated](https://github.com/rajsite/i3-docs/issues/6).*

   The names are just used to map values between sections, progress updates, etc. They do not appear in generated content.

   Example `.i3-docs.ini`:
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

## Build documentation (after VI changes)
1. Build `i3-docs.json` and image resources

   There should be a folder named `node_modules` next to the file `package.json`. Open and run the following VI: `node_modules\i3-docs\lv\Main\Generate JSON Report.vi`

   The `Generate JSON Report VI` will search parent directories until it finds a `.i3-docs.ini` file and it will use that file for configuration information.

2. Build `index.html` and web application resources

   In a command prompt in the folder containing `package.json` run the following command:

   `node_modules\.bin\i3-docs install`

   After running `i3-docs install` command, the folders listed in the section `[output_directories]` of the `.i3-docs.ini` file will have the web application resources copied over.
