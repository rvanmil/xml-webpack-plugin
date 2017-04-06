var ejs = require('ejs')
var fs = require('fs')
var path = require('path')

function XMLWebpackPlugin(options) {
	this.options = options
}

XMLWebpackPlugin.prototype.apply = function(compiler) {
	var self = this
	var compileFailed = false

	compiler.plugin('emit', function(compilation, callback) {
		var files = self.options.files || []

		// Compile all templates
		Promise.all(
			files.map(function(file) {
				return new Promise(function(resolve) {
					ejs.renderFile(file.template, file.data, {}, function(err, templateString) {
						if (err) {
							compilation.errors.push(err)
							compileFailed = true
						}
						file.templateString = templateString
						resolve()
					})
				})
			})
		)
		.then(function() {
			// Only continue when compiling templates did not fail
			if (compileFailed) {
				return callback()
			}
			// Split into assets and files to be written to context folder
			var xmlFilesForContext = []
			files.forEach(function(file) {
				if (!file.filename) {
					compilation.errors.push('XMLWebpackPlugin filename missing', file)
					return
				}
				var xmlPath = file.path || ''
				var xmlFilename = path.join(xmlPath, file.filename)
				var xmlContent = file.templateString
				if (file.writeToContext) {
					// File must be written inside context
					xmlFilename = path.join(compiler.context, xmlFilename)
					xmlFilesForContext.push({
						filename: xmlFilename,
						content: xmlContent
					})
				} else {
					// Regular asset
					compilation.assets[xmlFilename] = {
						source: function() {
							return xmlContent
						},
						size: function() {
							return xmlContent.length
						}
					}
				}
			})
			// Write files to context folder
			if (xmlFilesForContext.length == 0) {
				// Nothing to write to context folder, we're done
				return callback()
			}
			Promise.all(
				xmlFilesForContext.map(function(xmlFile) {
					return new Promise(function(resolve) {
						fs.writeFile(xmlFile.filename, xmlFile.content, function(err) {
							if (err) {
								compilation.errors.push(err)
							}
							resolve()
						})
					})
				})
			)
			.then(function() {
				return callback()
			})
		})
	})
}

module.exports = XMLWebpackPlugin
