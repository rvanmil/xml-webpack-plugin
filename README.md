# XML Webpack Plugin

This is a [webpack](https://webpack.js.org) plugin that allows you to generate XML files based on [ejs](http://ejs.co) templates.

Maintainer: René van Mil


## Installation

Install the plugin with npm:
```shell
$ npm install xml-webpack-plugin --save-dev
```


## Usage


### Example - browserconfig.xml

This example will generate a `browserconfig.xml` file inside the output path of your webpack bundle.

__browserconfig.ejs__

```text
<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square70x70logo src="<%= square70x70logo %>"/>
            <square150x150logo src="<%= square150x150logo %>"/>
            <wide310x150logo src="<%= wide310x150logo %>"/>
            <square310x310logo src="<%= square310x310logo %>"/>
            <TileColor><%= tileColor %></TileColor>
        </tile>
    </msapplication>
</browserconfig>
```


__webpack.config.js__

```javascript
var XMLWebpackPlugin = require('xml-webpack-plugin')

var xmlFiles = [
    {
        template: path.join(__dirname, 'browserconfig.ejs'),
        filename: 'browserconfig.xml',
        data: {
            square70x70logo: 'images/icon70.png',
            square150x150logo: 'images/icon150.png',
            wide310x150logo: 'images/icon310x150.png',
            square310x310logo: 'images/icon310.png',
            tileColor: '#ffffff'
        }
    }
]

var webpackConfig = {
    entry: 'index.js',
    output: {
        path: 'dist',
        filename: 'index_bundle.js'
    },
    plugins: [
        new XMLWebpackPlugin({
            files: xmlFiles
        })
    ]
}
```


### Example - Cordova config.xml

This example will generate a `config.xml` file inside the context path of your webpack project, which means the file will not be part of your webpack bundle but becomes part of your project folder instead. This is especially useful for e.g. generating a Cordova configuration file, which will be used by the Cordova compilation step after you generate your webpack bundle.


__cordovaConfig.ejs__

```text
<?xml version="1.0" encoding="utf-8"?>
<widget id="com.example.hello" version="<%= version %>" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
    <name><%= name %></name>
    <description>
        <%= description %>
    </description>
    <content src="index.html" />
    <plugin name="cordova-plugin-whitelist" spec="1" />
    <access origin="*" />
    <%_ allowIntents.forEach(function(allowIntent) { _%>
    <allow-intent href="<%= allowIntent %>" />
    <%_ }) _%>
    <platform name="android">
        <allow-intent href="market:*" />
    </platform>
    <platform name="ios">
        <allow-intent href="itms:*" />
        <allow-intent href="itms-apps:*" />
    </platform>
</widget>
```


__webpack.config.js__

```javascript
var pkg = require('./package.json')
var XMLWebpackPlugin = require('xml-webpack-plugin')

var xmlFiles = [
    {
        template: path.join(__dirname, 'cordovaConfig.ejs'),
        filename: 'config.xml',
        writeToContext: true,
        data: {
            version: pkg.version,
            name: 'myApp',
            description: 'This is the description of my app',
            allowIntents: [
                'http://*/*',
                'https://*/*',
                'tel:*',
                'sms:*',
                'mailto:*',
                'geo:*'
            ]
        }
    }
]

var webpackConfig = {
    entry: 'index.js',
    output: {
        path: 'dist',
        filename: 'index_bundle.js'
    },
    plugins: [
        new XMLWebpackPlugin({
            files: xmlFiles
        })
    ]
}
```


## XML File Options

The `files` array passed to the plugin must contain objects with these values:


- `template`: *required* - Path to the ejs template file which will be used to generate the XML output file.
- `filename`: *required* - The file to write the XML to.
- `path`: *optional* - The relative folder path to write the file to. When `writeToContext` is set to `true` you have to make sure this folder already exists inside your project folder.
- `writeToContext`: *optional* - When set to `true` the file will not be written to the webpack bundle output, but to the webpack project folder instead.
- `data`: *optional* - An object containing the data which will be passed to the ejs compiler.


## Contribution

You're free to contribute to this project by submitting [issues](https://github.com/rvanmil/xml-webpack-plugin/issues) and/or [pull requests](https://github.com/rvanmil/xml-webpack-plugin/pulls).


## License

This project is licensed under [MIT](https://github.com/rvanmil/xml-webpack-plugin/blob/master/LICENSE).
