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
        'views/common/offer.html',
        'views/common/offer.js',
        'views/offersList.html',
        'views/offersList.js',
        'views/offersMine.html',
        'views/offersMine.js'
    ], ['client']);

    api.addFiles([
        'server.js'
    ], ['server']);
});