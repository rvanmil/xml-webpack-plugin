const { join, resolve } = require('path')
const XMLWebpackPlugin = require('..')

const PATHS = {
	app: resolve(__dirname, 'src'),
	build: resolve(__dirname, 'www')
}

const xmlFiles = [
	{
		template: join(__dirname, 'test1.ejs'),
		filename: 'test1.xml',
		writeToContext: true,
		data: {
			a: 'aaa',
			b: 'bbb'
		}
	},
	{
		template: join(__dirname, 'test2.ejs'),
		filename: 'test2.xml',
		writeToContext: false,
		data: {
			c: 'ccc',
			d: 'ddd'
		}
	}
]

const config = {
	mode: 'production',

	entry: {
		app: [
			PATHS.app
		]
	},

	output: {
		filename: '[name].js',
		path: PATHS.build
	},

	devtool: 'hidden-source-map',

	module: {
		rules: []
	},

	plugins: [
		new XMLWebpackPlugin({
			files: xmlFiles
		})
	]
}

module.exports = config
