Package.describe({
    name: "frontend-base"
});

Package.onUse(function (api) {
    api.use([
        'meteor-platform',
        'ecmascript',
        'templating',
        'less',
        'iron:router@1.0.11',
        'nemo64:bootstrap'
    ]);

    api.imply([
        'iron:router@1.0.11'
    ]);

    // ~~~

    api.addFiles([
        'config/routing.js',
        'config/head.html',

        'styles/bootstrap/custom.bootstrap.json',
        'styles/bootstrap/custom.bootstrap.import.less',
        'styles/bootstrap/custom.bootstrap.mixins.import.less',
        'styles/bootstrap/custom.bootstrap.less',
        'styles/custom.less'
    ], ['client']);
});