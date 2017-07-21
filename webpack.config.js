var webpack = require("webpack");
var config = require('config');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var FaviconsWebpackPlugin = require('favicons-webpack-plugin')
var ManifestPlugin = require('webpack-manifest-plugin');
var fs = require("fs")

var configuration = {
	devtool: 'inline-eval-cheap-source-map',
	//devtools: 'source-map',
	entry: {
		main: ['./src/entry.js'],
		vendor: ['react', 'react-dom']
	},
	output: {
		path: __dirname + '/dist',
		filename: '[name].js',
		sourceMapFilename: "[name].js.map"
	},
	devServer: {
		contentBase: __dirname,
		historyApiFallback: {
			index: 'index.html'
		},
		setup: function(app) {
			app.get('/json/data.json', function(req, res) {
				var file = fs.readFileSync('./json/data.json', 'utf8');
				res.json(JSON.parse(file));
			});
		},
	},
	module: {
		loaders: [
			{
				test: /\.css$/,
				loader: "style-loader!css-loader"
			},
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				loaders: ['style', 'css', 'sass']
			},
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loaders: ["babel-loader"],
			},
			{
				test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: "url-loader?limit=10000&minetype=application/font-woff"
			},
			{
				test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: "file-loader"
			},
			{
				test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: 'url-loader?limit=10000&mimetype=application/font-woff'
			},
			{
				test: /\.(ttf|otf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?|(jpg|gif)$/,
				loader: 'file-loader'
			},
			{
				test: /\.json$/,
				loader: 'json'
			}
		]
	},
	plugins: [
		new ManifestPlugin({
			fileName: 'pwa-manifest.json',
		}),
		//new webpack.optimize.UglifyJsPlugin({ sourceMap: true }),
		new webpack.optimize.CommonsChunkPlugin(
			/* chunkName= */"vendor",
			/* filename= */"vendor.bundle.js"
		),
		new HtmlWebpackPlugin({
			title: 'Scallywag',
			template: 'index.html.tmpl',
			hash:false,
			filename: './index.html',
			favicon: './dist/icons/favicon.ico'
		}),
		new FaviconsWebpackPlugin({
			logo:'./src/images/logo.svg',
			prefix: 'icons/',
			persistentCache: true,
			inject: false,
			title: 'Webpack App',
			icons: {
			  android: false,
			  appleIcon: false,
			  appleStartup: false,
			  coast: false,
			  favicons: true,
			  firefox: false,
			  opengraph: false,
			  twitter: false,
			  yandex: false,
			  windows: true
			}
		}),
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		})
	]
}

module.exports = configuration;