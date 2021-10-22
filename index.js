const ejs = require('ejs')
const fs = require('fs')
const { join } = require('path')
// eslint-disable-next-line import/no-extraneous-dependencies
const { version } = require('webpack')

const processAssets = (files, options, compiler, compilation, callback) => {
	let compileFailed = false
	// Compile all templates
	Promise.all(
		files.map(file => new Promise((resolve) => {
			ejs.renderFile(file.template, file.data, options, (err, templateString) => {
				if (err) {
					compilation.errors.push(err)
					compileFailed = true
				}
				file.templateString = templateString
				resolve()
			})
		}))
	).then(() => {
		// Only continue when compiling templates did not fail
		if (compileFailed) {
			callback()
			return
		}
		// Split into assets and files to be written to context folder
		const xmlFilesForContext = []
		files.forEach((file) => {
			if (!file.filename) {
				compilation.errors.push('XMLWebpackPlugin filename missing', file)
				return
			}
			const xmlPath = file.path || ''
			let xmlFilename = join(xmlPath, file.filename)
			const xmlContent = file.templateString
			if (file.writeToContext) {
				// File must be written inside context
				xmlFilename = join(compiler.context, xmlFilename)
				xmlFilesForContext.push({
					filename: xmlFilename,
					content: xmlContent
				})
			} else {
				// Regular asset
				compilation.assets[xmlFilename] = {
					source: () => xmlContent,
					size: () => xmlContent.length
				}
			}
		})
		// Write files to context folder
		if (xmlFilesForContext.length === 0) {
			// Nothing to write to context folder, we're done
			callback()
			return
		}
		Promise.all(
			xmlFilesForContext.map(xmlFile => new Promise((resolve) => {
				fs.writeFile(xmlFile.filename, xmlFile.content, (err) => {
					if (err) {
						compilation.errors.push(err)
					}
					resolve()
				})
			}))
		).then(() => {
			callback()
		})
	}).catch(() => {
		callback()
	})
}

class XMLWebpackPlugin {
	constructor(params) {
		this.files = params.files || []
		this.options = params.options || {}
	}

	apply(compiler) {
		if (version[0] === '4') {
			compiler.hooks.emit.tapAsync(
				'XMLWebpackPlugin',
				(compilation, callback) => processAssets(this.files, this.options, compiler, compilation, callback)
			)
		} else {
			compiler.hooks.compilation.tap(
				'XMLWebpackPlugin',
				(compilation) => {
					compilation.hooks.additionalAssets.tapAsync(
						'XMLWebpackPlugin',
						callback => processAssets(this.files, this.options, compiler, compilation, callback)
					)
				}
			)
		}
	}
}

module.exports = XMLWebpackPlugin
