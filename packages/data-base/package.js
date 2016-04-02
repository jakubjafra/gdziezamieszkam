Package.describe({
    name: "data-base"
});

Package.onUse(function (api) {
    api.use([
        'meteor-platform',
        'ecmascript'
    ]);

    // ~~~

    api.addFiles([
        'common.js'
    ], ['client', 'server']);

    api.export([
        'Offers'
    ], ['client', 'server']);
});