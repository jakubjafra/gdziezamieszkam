Crawler = (function(){
    return {
        get(url){
            try {
                Meteor.sleep(100);
                return HTTP.get(url, {
                    timeout: 3000
                });
            } catch(error){
                Meteor.sleep(400);
                console.log("CONNECTION ERROR", error);
                return this.get(url);
            }
        }
    };
})();