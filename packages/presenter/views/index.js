(function(){
    let itemsLimit = new ReactiveVar(10);

    Template.offersList.onCreated(function(){
        this.autorun(() => {
            this.subscribe("offers", itemsLimit.get());
        });
    });

    Template.offersList.helpers({
        'offers': () => Offers.find({})
    });

    Template.offersList.events({
        'click #loadMore': function(){
            itemsLimit.set(itemsLimit.get() + 10);
        }
    })
})();

(function(){
    Template.offer.helpers({
        'firstPicture': function(){
            return this.pictures[0];
        }
    });
})();

(function(){
    let markersSS = null;
    let map;
    let markers = [];

    Template.map.onCreated(function(){
        markersSS = this.subscribe("markers");
    });

    Template.map.onRendered(function(){
        var mapOptions = {
            zoom: 12,
            center: new google.maps.LatLng(52.40637, 16.92517),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(
            document.getElementById('map-container'),
            mapOptions
        );

        this.autorun(function(){
            if(!markersSS.ready())
                return;

            markers.forEach(function(marker){
                marker.setMap(null);
            });

            markers.length = 0;

            Offers.find({}).fetch().forEach(offer => {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(offer.cords[0], offer.cords[1]),
                    icon: "http://maps.google.com/intl/en_us/mapfiles/ms/micons/green-dot.png"
                });

                markers.push(marker);
            });

            var markerCluster = new MarkerClusterer(map, markers);
        });
    });
})();