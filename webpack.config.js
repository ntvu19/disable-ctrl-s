import path from 'node:path';
import { fileURLToPath } from 'node:url';
import CopyPlugin from 'copy-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function webpackConfig(env, argv) {
  return {
    // Enable source maps only in development mode
    devtool: argv.mode === 'production' ? false : 'cheap-module-source-map',
    entry: {
      background: './src/background/background.ts',
      popup: './src/popup/popup.ts',
      options: './src/options/options.ts',
      content: './src/content/content.ts'
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      filename: '[name]/[name].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: 'manifest.json', to: 'manifest.json' },
          { from: 'src/popup/popup.html', to: 'popup/popup.html' },
          { from: 'src/popup/popup.css', to: 'popup/popup.css' },
          { from: 'src/options/options.html', to: 'options/options.html' },
          { from: 'src/options/options.css', to: 'options/options.css' },
          { from: 'icons', to: 'icons' },
        ],
      }),
    ],
    optimization: {
      minimize: false, // Easier debugging
    },
  };
}

