# i3-docs
Awesome doc generation for LabVIEW projects

i3-docs lets you search, inspect, and link to VIs from your web browser. Documentation is meant to be read!

![i3 docs usage example](http://i.imgur.com/5OigokZ.gif)

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
1. Create an .i3-docs.ini
2. Create a package.json
3. Run command: `npm install i3-docs --save-dev`

## Build documentation (after VI changes)
1. Run VI: `node_modules\i3-docs\lv\Main\Generate JSON Report.vi`
2. Run command: `node_modules\.bin\i3-docs install`

# Generating docs (Detailed)
## Prerequisites
- Node.js (recommend LTS 6.9 or up)
- LabVIEW 2014 or up
- LabVIEW Project file (.lvproj) that organizes the VIs for your project

## Set-up (one-time)
1. In a directory create an `.i3-docs.ini` file (preferably the root of the project or root of the repository)
   
   The `.i3-docs.ini` file will have the following sections:
   
   - `[project_files]` a named list of relative paths from .i3-docs.ini to the .lvproj file(s) for your project
   - `[output_directories]` a named list of relative directories where generated output will be placed

   The names are just used to map values between sections; they don't have any other significance.

   Example `.i3-docs.ini`:
   ```ini
   ;Two projects using the names awesome_project1 and awesome_project2
   ;Remember that the paths are relative to the location of the .i3-docs.ini file
   [project_files]
   awesome_project1=i3-docs.lvproj
   awesome_project2=../other_awesome_project/awesome.lvproj

   [output_directories]
   awesome_project1=docs
   awesome_project2=../other_awesome_project/docs
   ```
2. Create a `package.json` file if one has not been made

   The i3-docs project is managed using the Node Package Manager (npm). A `package.json` file is used to hold configuration settings for use by npm (such as the version of i3-docs being used).

   1. Open a command prompt in the project folder (preferably in the same folder as the `.i3-docs.ini` file made above).
   2. Run the command: 
      
      `npm init`
   3. Follow along with the prompt to create the package.json file. The defaults are usually good enough.

3. Install the `i3-docs` npm package

   In a command prompt in the folder containing `package.json` run the following command:
   
   `npm install i3-docs --save-dev`

   The `devDependencies` section of `package.json` should be updated to include `i3-docs` at the latest version. You should also see a folder named `node_modules` appear in the directory next to `package.json`.

   Note: If you are using a source code control system you may want to add an entry to *ignore* the `node_modules` folder. For example, on git you would add `/node_modules` to the `.gitignore` file.

## Build documentation (after VI changes)
1. Build `i3-docs.json` and image resources

   After installing the `i3-docs` package you should be able to locate the following VI installed in the `node_modules` folder: `node_modules\i3-docs\lv\Main\Generate JSON Report.vi`

   Open and run `Generate JSON Report.vi`. The VI will search parent directories until it finds a `.i3-docs.ini` file and it will use that file for configuration information.

   This is why it is recommended that `.i3-docs.ini` and `project.json` be located in the same directory (ideally at the root of the project).

2. Build `index.html` and web application resources

   In a command prompt in the folder containing `package.json` run the following command:

   `node_modules\.bin\i3-docs install`

   After running, the folders listed in the section `[output_directories]` of the `.i3-docs.ini` file will have the web application resources copied over.
