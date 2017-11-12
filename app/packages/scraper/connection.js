Crawler = (function(){
    let proxyList = [];

    return {
        makeProxyList(){
            let result = this.get("http://www.proxymarket.pl/api/getanonim/aa78e8bbdb95081c8ec560febb6383ec6e1fe1b8/", true);

            let body = result.content;
            let lines = body.split('\r\n');

            if(lines.length === 1) {
                console.log("PROXY ERROR", body);

                Meteor.sleep(30000);
                return this.makeProxyList();
            } else {
                for(let i = 0; i < 10; i++){
                    proxyList.push('http://' + lines[i] + '/');
                }

                console.log("PROXY UPDATED");
            }
        },

        get(url, noProxy){
            noProxy = noProxy || false;

            try {
                Meteor.sleep(100);

                let options = {
                    timeout: 3000,
                    encoding: "utf8"
                };

                if(!noProxy){
                    options['proxy'] = Random.choice(proxyList);
                }

                return HTTP.call("GET", url, options);
            } catch(error){
                Meteor.sleep(400);
                console.log("CONNECTION ERROR", error);
                return this.get(url);
            }
        }
    };
})();

SyncedCron.add({
    name: 'proxy',
    schedule: function(parser){
        return parser.text('every 1 hour');
    },
    job: function() {
        Crawler.makeProxyList();
    }
});

// ~~~

Meteor.startup(function(){
    SyncedCron.start();

    Meteor.call("update-dictionaries");
});
