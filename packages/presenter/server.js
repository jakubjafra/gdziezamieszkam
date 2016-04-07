Meteor.publish("offers", function(filters, limit){
    let query = {
        $and: [
            { 'lastSeen.0': { $gte: moment().startOf('day').subtract(1, 'days').valueOf() } },
            { 'address.city': "Poznań" }
        ]
    };

    Counts.publish(this, "offers-all-count", Offers.find(query));

    if(filters.price !== undefined) query.$and.push({ 'price': filters.price });
    if(filters.roomCount !== undefined) query.$and.push({ 'roomCount': filters.roomCount });
    if(filters.area !== undefined) query.$and.push({ 'area': filters.area });

    if(filters.hideEstateAgency === true) query.$and.push({ 'vendorType': { $ne: 2 } });
    if(filters.hideNoPictures === true) query.$and.push({ 'pictures.0': { $ne: null } });

    Counts.publish(this, "offers-filtered-count", Offers.find(query));

    return Offers.find(query, {
        limit: limit
    });
});

Meteor.publish("markers", function(){
    return Offers.find({
        $and: [
            { 'lastSeen.0': { $gte: moment().startOf('day').subtract(1, 'days').valueOf() } },
            { $or: [
                { 'address.street': { $ne: null } },
                { 'address.housing': { $ne: null } },
                { 'address.district': { $ne: null } }
            ]},
            { 'address.city': "Poznań" }
        ]
    }, {
        fields: {
            'cords': 1
        }
    });
})