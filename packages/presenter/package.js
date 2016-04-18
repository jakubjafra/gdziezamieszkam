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
        'common/sorting.js',
        'common/cords.js'
    ], ['client', 'server']);

    api.addFiles([
        'views/common/offer.html',
        'views/common/offer.js',
        'views/common/sorting.html',
        'views/common/sorting.js',
        'views/common/filters.html',
        'views/common/filters.js',

        'views/offersList.html',
        'views/offersList.js',
        'views/offersMine.html',
        'views/offersMine.js'
    ], ['client']);

    api.addFiles([
        'server.js'
    ], ['server']);
});