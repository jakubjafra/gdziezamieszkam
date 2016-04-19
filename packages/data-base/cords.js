let cords = [
    {
        city: "Poznań",
        name: "Wilda",
        center: { lat: 52.377324, lng: 16.917012 },
        coordinates: [
            { lat: 52.403487, lng: 16.911082 },
            { lat: 52.398178, lng: 16.940590 },
            { lat: 52.352568, lng: 16.917537 },
            { lat: 52.358697, lng: 16.866539 }
        ]
    },
    {
        city: "Poznań",
        name: "Grunwald",
        center: { lat: 52.388685, lng: 16.850709 },
        coordinates: [
            { lat: 52.403487, lng: 16.911082 },
            { lat: 52.406492, lng: 16.911649 },
            { lat: 52.414384, lng: 16.798409 },
            { lat: 52.385669, lng: 16.807822 },
            { lat: 52.376764, lng: 16.789938 },
            { lat: 52.377913, lng: 16.825235 },
            { lat: 52.346012, lng: 16.841236 },
            { lat: 52.358697, lng: 16.866539 }
        ]
    },
    {
        city: "Poznań",
        name: "Jeżyce",
        center: { lat: 52.436260, lng: 16.850731 },
        coordinates: [
            { lat: 52.406492, lng: 16.911649 },
            { lat: 52.414384, lng: 16.798409 },
            { lat: 52.466535, lng: 16.778529 },
            { lat: 52.455294, lng: 16.751969 },
            { lat: 52.464498, lng: 16.729997 },
            { lat: 52.483319, lng: 16.783555 },
            { lat: 52.465753, lng: 16.895478 },
            { lat: 52.419303, lng: 16.922016 }
        ]
    },
    {
        city: "Poznań",
        name: "Windogrady",
        center: { lat: 52.446595, lng: 16.933900 },
        coordinates: [
            { lat: 52.398178, lng: 16.940590 },
            { lat: 52.403487, lng: 16.911082 },
            { lat: 52.406492, lng: 16.911649 },
            { lat: 52.419303, lng: 16.922016 },
            { lat: 52.465753, lng: 16.895478 },
            { lat: 52.494698, lng: 16.887895 },
            { lat: 52.509118, lng: 16.969606 },
            { lat: 52.440527, lng: 16.975785 },
            { lat: 52.415196, lng: 16.947290 }
        ]
    },
    {
        city: "Poznań",
        name: "Nowe miasto",
        center: { lat: 52.381942, lng: 16.984640 },
        coordinates: [
            { lat: 52.352568, lng: 16.917537 },
            { lat: 52.398178, lng: 16.940590 },
            { lat: 52.415196, lng: 16.947290 },
            { lat: 52.440527, lng: 16.975785 },
            { lat: 52.427073, lng: 17.071025 },
            { lat: 52.292943, lng: 16.995151 }
        ]
    }
];

let regions = new Meteor.Collection("regions");

Cords = (function(){
    function isPointInPolygon(point, vs) {
        // ray-casting algorithm based on
        // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

        var x = point.lat, y = point.lng;

        var inside = false;
        for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            var xi = vs[i].lat, yi = vs[i].lng;
            var xj = vs[j].lat, yj = vs[j].lng;

            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }

        return inside;
    }

    return {
        subscribe(template){
            if(!Meteor.isClient)
                return;

            template = template || Meteor;

            return template.subscribe("regions");
        },

        updateRegions(){
            if(!Meteor.isServer)
                return;

            regions.remove({});

            Object
                .keys(this.raw())
                .map(index => { return { index, region: this.raw()[index] }})
                .forEach(pair => {
                    let region = pair.region;
                    region.index = parseInt(pair.index);
                    
                    region.count = Offers.find({
                        'lastSeen.0': { $gte: moment().startOf('day').subtract(2, 'days').valueOf() },
                        'address.city': "Poznań",
                        'region': region.index,
                        'cordsImportance': { $gte: 2 }
                    }).count();

                    regions.insert(region);
                })
        },

        all() {
            return regions.find({});
        },

        raw(){
            return cords;
        },

        a2o(arr){
            return { lat: arr[0], lng: arr[1] };
        },

        o2a(obj){
            return [ obj.lat, obj.lng ]
        },

        getAmbientRegionId(point){
            // można to otestować tak btw

            point.lat = parseFloat(point.lat);
            point.lng = parseFloat(point.lng);

            let foundRegionId = null;

            for(let i = 0; i < cords.length; i++){
                let region = cords[i];

                if(isPointInPolygon(point, region.coordinates)){
                    foundRegionId = i;
                    break;
                }
            }

            return foundRegionId;
        }
    }
})();

if(Meteor.isServer) {
    Meteor.publish("regions", function(){
        return regions.find({});
    });

    SyncedCron.add({
        name: 'update-regions',
        schedule: function (parser) {
            return parser.text('every 6 hours');
        },
        job: function () {
            Cords.updateRegions();
        }
    });
}