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

        offerData.pricePerArea = (offerData.price / offerData.area);
        
        offerData.cords = Meteor.call("geocode-address", address);
        offerData.quality = Meteor.call("get-offer-quality", offerData);

        console.log("inserting offer...");

        Offers.insert(offerData);
    }
});