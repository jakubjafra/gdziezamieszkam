Meteor.methods({
    "handle-offer": function(offerData){
        console.log("handle-offer", offerData.url);

        let currDate = moment().startOf('day').valueOf();

        let offerDuplicate = Offers.findOne({
            title: offerData.title
        });

        if(offerDuplicate === undefined){
            offerDuplicate = Offers.findOne({
                description: offerData.description
            });
        }

        if(offerDuplicate !== undefined){
            console.log("found duplicate of offer", offerDuplicate._id);

            Offers.update(offerDuplicate._id, {
                $push: {
                    'lastSeen': {
                        $each: [currDate],
                        $position: 0
                    }
                }
            });

            return;
        }

        console.log("calling AI address scripts...");

        let titleAddress = {
            street: Meteor.call("find-street-in-string", offerData.title, 0.9),
            housing: Meteor.call("find-housing-in-string", offerData.title, 0.9),
            district: Meteor.call("find-district-in-string", offerData.title, 0.9),
            city: offerData.city
        };

        let descriptionAddress = {
            street: Meteor.call("find-street-in-string", offerData.description, 1.05),
            housing: Meteor.call("find-housing-in-string", offerData.description, 1),
            district: Meteor.call("find-district-in-string", offerData.description, 1),
            city: offerData.city
        };

        let address = (function(address1, address2){
            let returnAddress = address1;

            Object.keys(address2).forEach(key => {
                let value = address2[key];
                if(value !== null)
                    returnAddress[key] = value;
            });

            return returnAddress;
        })(descriptionAddress, titleAddress);

        delete offerData["city"];
        offerData.address = address;

        offerData.lastSeen = [currDate];

        console.log("calling geocode service...");

        let geocodedRegion = Meteor.call("geocode-address", address);

        offerData.cords = Cords.a2o(geocodedRegion.cords);
        offerData.cordsImportance = geocodedRegion.importance;

        console.log("calling other services...");

        offerData.price.rent = Meteor.call("find-rent-in-string", offerData.description, offerData.price.price);
        if(offerData.price.rent !== null)
            offerData.price.price += offerData.price.rent;

        if(offerData.area !== undefined)
            offerData.pricePerArea = (offerData.price.price / offerData.area);

        offerData.price.deposit = Meteor.call("find-deposit-in-string", offerData.description);
        offerData.region = Cords.getAmbientRegionId(offerData.cords);
        offerData.quality = Meteor.call("get-offer-quality", offerData);

        offerData.users = {
            accepted: [],
            declined: []
        };

        console.log("inserting offer...");

        Offers.insert(offerData);
    },

    // tmp methods:

    'userify-all-offers': function(){
        Offers.find({}).fetch().forEach(offer => {
            let users = {
                accepted: [],
                declined: []
            };

            Offers.update(offer._id, {
                $set: {
                    'users': users
                }
            });
        });
    },
    'generate-regions-for-all-offers': function(){
        Offers.find({}).fetch().forEach(offer => {
            if(offer.cords.constructor === Array) {
                offer.cords = Cords.a2o(offer.cords);
                offer.cordsImportance = 3;
            }

            offer.region = Cords.getAmbientRegionId(offer.cords);

            Offers.update(offer._id, {
                $set: {
                    'cords': offer.cords,
                    'cordsImportance': offer.cordsImportance,
                    'region': offer.region
                }
            });
        });
    }
});