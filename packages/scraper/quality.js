function getOfferQuality(offer){
    let quality = 0;

    // czy jest dokładny adres?
    if(offer.address.street !== null || offer.address.housing !== null)
        quality += 2;
    else if(offer.address.district !== null)
        quality += 1;

    // czy opis jest wyczerpujący?
    if(offer.description.length < 100)
        quality -= 1;
    else if(offer.description.length >= 600)
        quality += 1;

    // czy cena nie budzi wątpliwości?
    if(offer.pricePerArea <= 20)
        quality -= 1;
    else if(offer.pricePerArea >= 30)
        quality += 1;

    // czy oferta ma zdjęcie?
    if(offer.pictures[0] !== null)
        quality += 1;

    // ocena jest wyrażona w jednostce przedziale <1..5>
    return ((quality + 2) / (2 + 5)) * 5;
}

Meteor.methods({
    'get-offer-quality': function(offer){
        return getOfferQuality(offer);
    },
    'quality-all-offers': function(){
        Offers.find({}).fetch().forEach(offer => {
            let quality = Meteor.call('get-offer-quality', offer);

            Offers.update(offer._id, {
                $set: {
                    'quality': quality
                }
            });
        });
    }
});