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

    let mineQuery = {
        'users.accepted': { $in: [ this.userId ] }
    };

    Counts.publish(this, "offers-mine", Offers.find(mineQuery));

    return [];
});

Meteor.publish("offers", function(filters, sorting, limit){
    let query = basicQuery();

    query.$and.push({
        $and: [
            { 'users.accepted': { $not: { $in: [ this.userId ] } } },
            { 'users.declined': { $not: { $in: [ this.userId ] } } }
        ]
    });

    if(filters.localization !== undefined) query.$and.push({ 'region': filters.localization });
    if(!(filters.includeMisleadingAddress !== undefined)) query.$and.push({ 'cordsImportance': { $gte: 2}});

    if(filters.price !== undefined) query.$and.push({ 'price': filters.price });
    if(filters.roomCount !== undefined) query.$and.push({ 'roomCount': filters.roomCount });
    if(filters.area !== undefined) query.$and.push({ 'area': filters.area });
    if(filters.pricePerArea !== undefined){
        query.$and.push({ 'pricePerArea': filters.pricePerArea });
        query.$and.push({ 'pricePerArea': { $ne: NaN } });
    }

    if(filters.hideEstateAgency === true) query.$and.push({ 'vendorType': { $ne: 2 } });
    if(filters.hideNoPictures === true) query.$and.push({ 'pictures.0': { $ne: null } });

    Counts.publish(this, "offers-filtered", Offers.find(query));

    return Offers.find(query, {
        limit: limit,
        sort: sorting
    });
});

Meteor.publish("offers-mine", function(sorting, limit){
    let query = {
        $and: []
    };

    query.$and.push({ 'users.accepted': { $in: [ this.userId ] } });

    Counts.publish(this, "offers-mine", Offers.find(query));

    return Offers.find(query, {
        limit: limit,
        sort: sorting
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