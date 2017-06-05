Package.describe({
    name: "data-base"
});

Package.onUse(function (api) {
    api.use([
        'meteor-platform',
        'ecmascript'
    ]);

    api.use([
        'ongoworks:security',
        'percolate:synced-cron',
        'aldeed:collection2@2.9.1'
    ]);

    api.imply([
        'ongoworks:security',
        'aldeed:collection2'
    ]);

    // ~~~

    api.addFiles([
        'common.js',
        'cords.js'
    ], ['client', 'server']);

    api.export([
        'Offers',
        'Cords'
    ], ['client', 'server']);
});