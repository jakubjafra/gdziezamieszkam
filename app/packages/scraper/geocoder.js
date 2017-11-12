let GeocoderResults = new Mongo.Collection("geocoder_results");

Meteor.methods({
    "geocode-address": function(address){
        console.log(address);

        let possibleAddresses = [];

        function pushPossibleAddress(city, importance, query){
            if(query === null)
                return;

            possibleAddresses.push({
                query: query !== undefined ? query + ", " + city : city,
                importance: importance
            });
        }

        pushPossibleAddress(address.city, 4, address.street);
        pushPossibleAddress(address.city, 3, address.housing);
        pushPossibleAddress(address.city, 2, address.district);
        pushPossibleAddress(address.city, 1);

        if(possibleAddresses.length === 0) {
            console.log("* no address found in here....");
            return;
        }

        for(let i = 0; i < possibleAddresses.length; i++){
            try {
                const result = Meteor.call("call-geocoder", possibleAddresses[i].query);

                if(result === null)
                    continue;

                return {
                    cords: result,
                    importance: possibleAddresses[i].importance
                };
            } catch(e) {
                continue;
            }
        }

        // założenie jest takie, że nigdy nie powinno zwrócić null...
        return null;
    },
    "call-geocoder": function(address){
        const result = GeocoderResults.findOne({
            address
        });

        if(result === undefined){
            const geocoded = Crawler.get("http://nominatim.openstreetmap.org/search?format=json&q=" + encodeURIComponent(address));
            const data = getMostAccurateCords(geocoded.data);

            if(data === undefined)
                return null;

            const cords = [ data.lat, data.lon ];

            GeocoderResults.insert({
                address,
                cords
            });

            return cords;
        } else{
            return result.cords;
        }
    }
});

var MapFeature = {
    getImportanceOfClassAndType: function(nodeClass, nodeType){
        var lookupTable = {
            "highway": {
                "motorway": 0.8,
                "trunk": 0.9,
                "primary": 1,
                "secondary": 1,
                "tertiary": 1,
                "unclassified": 1.05,
                "residential": 1.2,
                "service": 1
            },
            "building": 1.1
        };

        if(typeof lookupTable[nodeClass] === "object")
            return lookupTable[nodeClass][nodeType] !== undefined ? lookupTable[nodeClass][nodeType] : 1;
        else
            return lookupTable[nodeClass] !== undefined ? lookupTable[nodeClass] : 1;
    }
};

function getMostAccurateCords(geocoderResponse){
    return geocoderResponse.map(function(response){
        response.importance = parseFloat(response.importance);
        response.importance *= MapFeature.getImportanceOfClassAndType(response.class, response.type);
        return response;
    }).sort(function(a, b){
        return a.importance < b.importance;
    })[0];
}
