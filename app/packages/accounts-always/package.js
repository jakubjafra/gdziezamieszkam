Package.describe({
    name: "accounts-always"
});

Package.onUse(function (api) {
    api.use([
        'meteor-platform',
        'ecmascript',
        'accounts-base',
        'random'
    ]);

    api.imply([
        'accounts-base'
    ]);

    // ~~~

    api.addFiles([
        'common.js'
    ], ['client', 'server']);

    api.addFiles([
        'client.js'
    ], ['client']);

    api.addFiles([
        'server.js'
    ], ['server']);
});