Package.describe({
    name: "presenter"
});

Package.onUse(function (api) {
    api.use([
        'meteor-platform',
        'ecmascript',
        'templating',
        'reactive-var'
    ]);

    api.use([
        'frontend-base',
        'data-base'
    ]);

    // ~~~

    api.addFiles([
        'views/index.html',
        'views/index.js'
    ], ['client']);

    api.addFiles([
        'server.js'
    ], ['server']);
});