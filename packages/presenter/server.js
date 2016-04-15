function basicQuery(){
    return {
        $and: [
            { 'lastSeen.0': { $gte: moment().startOf('day').subtract(1, 'days').valueOf() } },
            { 'address.city': "Poznań" }
        ]
    };
}

Meteor.publish("offers-counts", function(){
    let query = basicQuery();

    Counts.publish(this, "offers-all", Offers.find(query));
    // TODO: Counts.publish(this, "offers-mine", Offers.find(???));

    return [];
});

Meteor.publish("offers", function(filters, limit){
    let query = basicQuery();

    if(filters.price !== undefined) query.$and.push({ 'price': filters.price });
    if(filters.roomCount !== undefined) query.$and.push({ 'roomCount': filters.roomCount });
    if(filters.area !== undefined) query.$and.push({ 'area': filters.area });

    if(filters.hideEstateAgency === true) query.$and.push({ 'vendorType': { $ne: 2 } });
    if(filters.hideNoPictures === true) query.$and.push({ 'pictures.0': { $ne: null } });

    Counts.publish(this, "offers-filtered", Offers.find(query));

    return Offers.find(query, {
        limit: limit,
        sort: {
            quality: -1,
            price: 1
        }
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