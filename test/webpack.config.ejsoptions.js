const { join, resolve } = require('path')
const XMLWebpackPlugin = require('..')

const PATHS = {
	app: resolve(__dirname, 'src'),
	build: resolve(__dirname, 'www')
}

const xmlFiles = [
	{
		template: join(__dirname, 'test1ejsoptions.ejs'),
		filename: 'test1ejsoptions.xml',
		writeToContext: true,
		data: {
			a: 'aaa',
			b: 'bbb'
		}
	},
	{
		template: join(__dirname, 'test2ejsoptions.ejs'),
		filename: 'test2ejsoptions.xml',
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
			files: xmlFiles,
			options: {
				delimiter: '?',
				openDelimiter: '[',
				closeDelimiter: ']'
			}
		})
	]
}

module.exports = config
