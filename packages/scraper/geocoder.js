let GeocoderResults = new Mongo.Collection("geocoder_results");

Meteor.methods({
    "geocode-address": function(address){
        let possibleAddresses = [];

        function pushPossibleAddress(query, importance){
            possibleAddresses.push({
                query: query,
                importance: importance
            });
        }

        pushPossibleAddress(address.street + ", " + address.city, 4);
        pushPossibleAddress(address.housing + ", " + address.city, 3);
        pushPossibleAddress(address.district + ", " + address.city, 2);
        pushPossibleAddress(address.city, 1);

        for(let i = 0; i < possibleAddresses.length; i++){
            let result = Meteor.call("call-geocoder", possibleAddresses[i].query);

            if(result === null)
                continue;

            return result;
        }

        return null;
    },
    "call-geocoder": function(address){
        let result = GeocoderResults.findOne({
            address
        });

        if(result === undefined){
            let geocoded = Crawler.get("http://nominatim.openstreetmap.org/search?format=json&q=" + address);
            let data = getMostAccurateCords(geocoded.data);

            if(data === undefined)
                return null;

            let cords = [ data.lat, data.lon ];

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