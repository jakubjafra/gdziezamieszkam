Package.describe({
    name: "scraper"
});

Npm.depends({
    'cheerio': '0.20.0'
});

Package.onUse(function (api) {
    api.use([
        'meteor-platform',
        'ecmascript',
        'http',
        'momentjs:moment',
        'froatsnook:sleep'
    ]);

    api.use([
        'data-base'
    ]);

    // ~~~

    api.addFiles([
        'connection.js',
        'server-commons.js',
        'olx-scraper.js',
        'gumtree-scraper.js',
        'offer-handlers.js',
        'scrap-names.js',
        'geocoder.js'
    ], ['server']);
});