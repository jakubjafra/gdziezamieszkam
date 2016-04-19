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
        'percolate:synced-cron'
    ]);

    api.imply([
        'ongoworks:security'
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