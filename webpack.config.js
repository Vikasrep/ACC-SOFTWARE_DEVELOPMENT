const CompressionPlugin = require('compression-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const path = require('path');
const packageJson = require('./package.json');
const envFile = path.resolve(__dirname, '.env-example.json');
const envLocalFile = path.resolve(__dirname, '.env.json');

if (process.env.NODE_ENV === 'none') {
	require('dotenv-json')({ path: envLocalFile });
} else {
	require('dotenv-json')({ path: envFile });
}

module.exports = {
	entry: {
		'pcu-software': ['whatwg-fetch', path.resolve(__dirname, 'src/index.js')]
	},

	output: {
		clean: true,
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].[contenthash].js',
		publicPath: process.env.BASE_URL
	},

	resolve: {
		alias: {
			'@apis': path.resolve(__dirname, 'src/apis'),
			'@assets': path.resolve(__dirname, 'src/assets'),
			'@components': path.resolve(__dirname, 'src/components'),
			'@constants': path.resolve(__dirname, 'src/constants'),
			'@reducers': path.resolve(__dirname, 'src/store/reducers'),
			'@store': path.resolve(__dirname, 'src/store'),
			'@utilities': path.resolve(__dirname, 'src/utilities')
		}
	},

	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: ['babel-loader']
			},
			{
				test: /\.m?js/,
				resolve: {
					fullySpecified: false
				}
			},
			{
				test: /\.(scss|css)$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
			},
			{
				test: /\.(png|svg|jpg|gif|pdf)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: 'assets/[ext]/[contenthash].[ext]'
						}
					}
				]
			}
		]
	},

	optimization: {
		runtimeChunk: 'single',
		splitChunks: {
			chunks: 'all',
			maxInitialRequests: Infinity,
			minSize: 0,
			cacheGroups: {
				reactBootstrap: {
					test: /[\\/]node_modules[\\/]react-bootstrap[\\/]/,
					name: 'react-bootstrap.bundle',
					priority: 90
				},
				reactIcons: {
					test: /[\\/]node_modules[\\/]react-icons[\\/]/,
					name: 'react-icons.bundle',
					priority: 80
				},
				react: {
					test: /[\\/]node_modules[\\/]react.*[\\/]/,
					name: 'react.bundle',
					priority: 70
				},
				redux: {
					test: /[\\/]node_modules[\\/]*.redux.*[\\/]/,
					name: 'redux.bundle',
					priority: 60
				},
				materialUI: {
					test: /[\\/]node_modules[\\/]@material-ui[\\/]/,
					name: 'material-ui.bundle',
					priority: 50
				},
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendor.bundle',
					priority: 10
				}
			}
		},
		minimizer: [new CssMinimizerPlugin()]
	},

	devtool: 'eval-source-map',

	devServer: {
		historyApiFallback: true
	},

	plugins: [
		new webpack.EnvironmentPlugin(process.env),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'src/index.html'),
			base: process.env.BASE_URL,
			meta: {
				author: packageJson.author,
				description: packageJson.description,
				'theme-color': 'rgb(130, 200, 232)',
				timestamp: new Date()
					.toLocaleString('en-US', {
						year: 'numeric',
						month: '2-digit',
						day: '2-digit',
						hour: '2-digit',
						minute: '2-digit',
						second: '2-digit'
					})
					.replace(', ', ' - '),
				viewport: 'width=device-width, initial-scale=1.0'
			},
			templateParameters: {
				favicon: `${process.env.CDN_URL}/images/tango_5_9.png`
			}
		}),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: 'web.config',
					to: 'web.config'
				}
			]
		}),
		new MiniCssExtractPlugin(),
		new CompressionPlugin()
	]
};
