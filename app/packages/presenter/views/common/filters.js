filters = new ReactiveVar({});

let map = null;

Template.filters.onCreated(function(){
    Cords.subscribe(this);
});

Template.filters.onRendered(function(){
    // let mapOptions = {
    //     zoom: 10,
    //     center: new google.maps.LatLng(52.40637, 16.92517),
    //     mapTypeId: google.maps.MapTypeId.ROADMAP,
    //     disableDefaultUI: true
    // };
    //
    // map = new google.maps.Map(
    //     document.getElementById('small-map-container'),
    //     mapOptions
    // );

    // ~~~

    $("#price").slider({
        min: 400,
        max: 4000,
        step: 100,
        value: [400, 4000],
        scale: 'logarithmic',
        tooltip: 'always',
        tooltip_split: false,
        formatter: str => {
            if(str[0] === 400 && str[1] === 4000)
                return "wszystkie";
            else {
                if(str[0] === str[1]) {
                    if(str[0] === 400)
                        return "<= " + str[0] + " zł";
                    else
                        return ">= " + str[1] + " zł";
                }
                else {
                    if (str[0] === 400)
                        return "<= " + str[1] + " zł";
                    else if (str[1] === 4000)
                        return ">= " + str[0] + " zł";
                    else
                        return str[0] + " zł - " + str[1] + " zł";
                }
            }
        }
    });

    $("#roomCount").slider({
        min: 1,
        max: 6,
        step: 1,
        value: [1, 6],
        scale: 'linear',
        tooltip: 'always',
        tooltip_split: false,
        formatter: str => {
            function getNameFor(str){
                switch(str){
                    case 1: return "kawalerka";
                    case 6: return "6+ pokoi";
                    default: return `${str} pokojowe`;
                }
            }

            if(str[0] === 1 && str[1] === 6)
                return "wszystkie";
            else {
                if(str[0] === str[1])
                    return getNameFor(str[0]);
                else {
                    if (str[0] === 1)
                        return "<= " + getNameFor(str[1]);
                    else if (str[1] === 6)
                        return ">= " + getNameFor(str[0]);
                    else
                        return str[0] + " do " + str[1] + " pokoi";
                }
            }
        }
    });

    $("#area").slider({
        min: 20,
        max: 120,
        step: 10,
        value: [20, 120],
        scale: 'linear',
        tooltip: 'always',
        tooltip_split: false,
        formatter: str => {
            if(str[0] === 20 && str[1] === 120)
                return "wszystkie";
            else {
                if(str[0] === str[1]){
                    if(str[0] === 20)
                        return "<= " + str[0] + " m²";
                    else
                        return ">= " + str[1] + " m²";
                }
                else {
                    if (str[0] === 20)
                        return "<= " + str[1] + " m²";
                    else if (str[1] === 120)
                        return ">= " + str[0] + " m²";
                    else
                        return str[0] + " m² - " + str[1] + " m²";
                }
            }
        }
    });

    $("#pricePerArea").slider({
        min: 10,
        max: 70,
        step: 5,
        value: [10, 70],
        scale: 'linear',
        tooltip: 'always',
        tooltip_split: false,
        formatter: str => {
            if(str[0] === 10 && str[1] === 70)
                return "wszystkie";
            else {
                if(str[0] === str[1]){
                    if(str[0] === 10)
                        return "<= " + str[0] + " zł/m²";
                    else
                        return ">= " + str[1] + " zł/m²";
                }
                else {
                    if (str[0] === 10)
                        return "<= " + str[1] + " zł/m²";
                    else if (str[1] === 70)
                        return ">= " + str[0] + " zł/m²";
                    else
                        return str[0] + " zł/m² - " + str[1] + " zł/m²";
                }
            }
        }
    });
});

Template.filters.helpers({
    'districts': () => Cords.all()
});

Template.filters.events({
    'change #localization': function(event){
        let district = $(event.currentTarget).val();

        let actualFilters = filters.get();

        if (district === "__all")
            delete actualFilters["localization"];
        else
            actualFilters["localization"] = parseInt(district);

        filters.set(actualFilters);
    },
    'change #includeMisleadingAddress': function(event){
        let isToggled = $(event.currentTarget).is(":checked");

        let actualFilters = filters.get();

        if(isToggled)
            actualFilters.includeMisleadingAddress = true;
        else
            delete actualFilters['includeMisleadingAddress'];

        filters.set(actualFilters);
    },
    'change #price': function(event) {
        let prices = $(event.currentTarget).val().split(",").map(number => parseInt(number, 10));
        let cursor = null;

        if (prices[0] === 400 && prices[1] === 4000)
            cursor = null;
        else {
            if (prices[0] === prices[1])
                cursor = { $eq: prices[0] };
            else {
                if (prices[0] === 400) {
                    cursor = { $lte: prices[1] };
                } else if (prices[1] === 4000) {
                    cursor = { $gte: prices[0] }
                } else {
                    cursor = {
                        $gte: prices[0],
                        $lte: prices[1]
                    };
                }
            }
        }

        let actualFilters = filters.get();

        if (cursor === null)
            delete actualFilters["price"];
        else
            actualFilters["price"] = cursor;

        filters.set(actualFilters);
    },
    'change #roomCount': function(event) {
        let prices = $(event.currentTarget).val().split(",").map(number => parseInt(number, 10));
        let cursor = null;

        if (prices[0] === 1 && prices[1] === 6)
            cursor = null;
        else {
            if (prices[0] === prices[1])
                cursor = { $eq: prices[0] };
            else {
                if (prices[0] === 1) {
                    cursor = { $lte: prices[1] };
                } else if (prices[1] === 6) {
                    cursor = { $gte: prices[0] }
                } else {
                    cursor = {
                        $gte: prices[0],
                        $lte: prices[1]
                    };
                }
            }
        }

        let actualFilters = filters.get();

        if (cursor === null)
            delete actualFilters["roomCount"];
        else
            actualFilters["roomCount"] = cursor;

        filters.set(actualFilters);
    },
    'change #area': function(event) {
        let prices = $(event.currentTarget).val().split(",").map(number => parseInt(number, 10));
        let cursor = null;

        if (prices[0] === 20 && prices[1] === 120)
            cursor = null;
        else {
            if (prices[0] === prices[1])
                cursor = { $eq: prices[0] };
            else {
                if (prices[0] === 20) {
                    cursor = { $lte: prices[1] };
                } else if (prices[1] === 120) {
                    cursor = { $gte: prices[0] }
                } else {
                    cursor = {
                        $gte: prices[0],
                        $lte: prices[1]
                    };
                }
            }
        }

        let actualFilters = filters.get();

        if (cursor === null)
            delete actualFilters["area"];
        else
            actualFilters["area"] = cursor;

        filters.set(actualFilters);
    },
    'change #pricePerArea': function(event) {
        let prices = $(event.currentTarget).val().split(",").map(number => parseInt(number, 10));
        let cursor = null;

        if (prices[0] === 10 && prices[1] === 70)
            cursor = null;
        else {
            if (prices[0] === prices[1])
                cursor = { $eq: prices[0] };
            else {
                if (prices[0] === 10) {
                    cursor = { $lte: prices[1] };
                } else if (prices[1] === 70) {
                    cursor = { $gte: prices[0] }
                } else {
                    cursor = {
                        $gte: prices[0],
                        $lte: prices[1]
                    };
                }
            }
        }

        let actualFilters = filters.get();

        if (cursor === null)
            delete actualFilters["pricePerArea"];
        else
            actualFilters["pricePerArea"] = cursor;

        filters.set(actualFilters);
    },
    'change #hideEstateAgency': function(event){
        let isToggled = $(event.currentTarget).is(":checked");

        let actualFilters = filters.get();

        if(isToggled)
            actualFilters.hideEstateAgency = true;
        else
            delete actualFilters['hideEstateAgency'];

        filters.set(actualFilters);
    },
    'change #hideNoPictures': function(event){
        let isToggled = $(event.currentTarget).is(":checked");

        let actualFilters = filters.get();

        if(isToggled)
            actualFilters.hideNoPictures = true;
        else
            delete actualFilters['hideNoPictures'];

        filters.set(actualFilters);
    }
});

Template.filters.helpers({
    'counts': () => {
        return {
            filtered: Counts.get("offers-filtered"),
            total: Counts.get("offers-all")
        };
    }
});

// (function(){
//     let map = null;
//
//     Template.mapModal.onCreated(function(){
//         Cords.subscribe(this);
//     });
//
//     Template.mapModal.onRendered(function(){
//         $("#mapModal").on('shown.bs.modal', function(){
//             var mapOptions = {
//                 zoom: 12,
//                 center: new google.maps.LatLng(52.40637, 16.92517),
//                 mapTypeId: google.maps.MapTypeId.ROADMAP,
//                 disableDefaultUI: true
//             };
//
//             map = new google.maps.Map(
//                 document.getElementById('big-map'),
//                 mapOptions
//             );
//
//             Cords.all().forEach(feature => {
//                 var marker = new MarkerWithLabel({
//                     icon: {
//                         path: google.maps.SymbolPath.CIRCLE,
//                         scale: 0
//                     },
//                     position: feature.center,
//                     draggable: false,
//                     labelContent: "" + feature.count,
//                     labelAnchor: new google.maps.Point(20, 20),
//                     labelClass: "map-label",
//                     labelStyle: { opacity: 1 }
//                 });
//
//                 marker.setMap(map);
//
//                 var polygon = new google.maps.Polygon({
//                     paths: feature.coordinates,
//                     strokeColor: '#888',
//                     strokeOpacity: 1,
//                     strokeWeight: 1,
//                     fillColor: '#FFAE1A',
//                     fillOpacity: 0
//                 });
//
//                 polygon.setMap(map);
//
//                 google.maps.event.addListener(polygon, 'mouseover', function() {
//                     this.setOptions({
//                         fillOpacity: 0.35
//                     });
//                 });
//
//                 google.maps.event.addListener(polygon, 'mouseout', function() {
//                     this.setOptions({
//                         fillOpacity: 0
//                     });
//                 });
//             })
//         });
//     })
// })();