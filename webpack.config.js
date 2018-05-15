let Encore = require('@symfony/webpack-encore');

Encore
    // directory where all compiled assets will be stored
    .setOutputPath('web/build/')

    // what's the public path to this directory (relative to your project's document root dir)
    .setPublicPath('/build')

    // empty the outputPath dir before each build
    .cleanupOutputBeforeBuild()

    .configureBabel(function(babelConfig) {
//        babelConfig.presets.push('babel-preset-es2018');
        babelConfig.plugins.push('transform-runtime')
        babelConfig.plugins.push('transform-object-rest-spread')
    })

    // will output as web/build/app.js
    .addEntry('main', './app/Resources/frontend/index.js')
    .addEntry('logo', './app/Resources/frontend/assets/logo.svg')

    // allow sass/scss files to be processed
    .enableSassLoader()

    // allow legacy applications to use $/jQuery as a global variable
    .autoProvidejQuery()

    .enableSourceMaps(!Encore.isProduction())

    // Enable react
    .enableReactPreset()
;

// export the final configuration
module.exports = Encore.getWebpackConfig();
