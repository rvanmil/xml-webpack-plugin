const fs = require('fs')
const { join } = require('path')
const webpack = require('webpack')
const configuration = require('./webpack.config')
const configurationejsoptions = require('./webpack.config.ejsoptions')

test('Generates two XML files', (done) => {
	const compiler = webpack(configuration)
	compiler.run((err, stats) => {
		expect(err).toBeFalsy()
		expect(stats.hasErrors()).toBe(false)
		expect(stats.hasWarnings()).toBe(false)
		fs.readFile(join(__dirname, '../test1.xml'), 'utf-8', (readFileErr1, data1) => {
			expect(readFileErr1).toBeFalsy()
			expect(data1).toBe('<?xml version=\'1.0\' encoding=\'utf-8\'?>\n<root>\n    <a>aaa</a>\n    <b>bbb</b>\n</root>')
			fs.readFile(join(__dirname, '/www/test2.xml'), 'utf-8', (readFileErr2, data2) => {
				expect(readFileErr2).toBeFalsy()
				expect(data2).toBe('<?xml version=\'1.0\' encoding=\'utf-8\'?>\n<root>\n    <c>ccc</c>\n    <d>ddd</d>\n</root>')
				done()
			})
		})
	})
})

test('Generates two XML files with EJS options', (done) => {
	const compiler = webpack(configurationejsoptions)
	compiler.run((err, stats) => {
		expect(err).toBeFalsy()
		expect(stats.hasErrors()).toBe(false)
		expect(stats.hasWarnings()).toBe(false)
		fs.readFile(join(__dirname, '../test1ejsoptions.xml'), 'utf-8', (readFileErr1, data1) => {
			expect(readFileErr1).toBeFalsy()
			expect(data1).toBe('<?xml version=\'1.0\' encoding=\'utf-8\'?>\n<root>\n    <a>aaa</a>\n    <b>bbb</b>\n</root>')
			fs.readFile(join(__dirname, '/www/test2ejsoptions.xml'), 'utf-8', (readFileErr2, data2) => {
				expect(readFileErr2).toBeFalsy()
				expect(data2).toBe('<?xml version=\'1.0\' encoding=\'utf-8\'?>\n<root>\n    <c>ccc</c>\n    <d>ddd</d>\n</root>')
				done()
			})
		})
	})
})
