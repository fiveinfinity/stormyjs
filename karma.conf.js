module.exports = function (config) {
    config.set({
        basePath: '.',
        frameworks: ['jasmine'],
        files: [
            "https://cdn.jsdelivr.net/lodash/4.13.1/lodash.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/datejs/1.0/date.min.js",
            "https://ajax.googleapis.com/ajax/libs/angularjs/1.5.6/angular.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.3.1/angular-ui-router.min.js",
            'https://maps.googleapis.com/maps/api/js?key=AIzaSyDoHFpligHoNQ_2WZudFcGJqBVbWBWFqns',
            'node_modules/angular-simple-logger/angular-simple-logger.js',
            "https://cdnjs.cloudflare.com/ajax/libs/angular-google-maps/2.3.2/angular-google-maps.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js",
            "https://use.fontawesome.com/37fae591b3.js",
            'tests/angular-mocks.js',
            'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.1.3/ui-bootstrap.min.js',
            'js/*.js',
            'js/**/*.js',
            'tests/*.spec.js'
        ],
        exclude: [],
        plugins: [
            require("karma-chrome-launcher"),
            require("karma-jasmine"),
            require("karma-spec-reporter")
        ],
        preprocessors: {},
        reporters: ['spec'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['Chrome'],
        singleRun: true,
        concurrency: Infinity
    })
}
