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
        'accounts-always',
        'data-base'
    ]);

    api.use([
        'rgnevashev:bootstrap-slider'
    ]);

    api.use([
        'tmeasday:publish-counts'
    ], ['server', 'client']);

    // ~~~

    api.addFiles([
        'views/index.html',
        'views/index.js'
    ], ['client']);

    api.addFiles([
        'server.js'
    ], ['server']);
});