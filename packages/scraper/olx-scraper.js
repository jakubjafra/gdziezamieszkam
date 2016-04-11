function labelValueToKeywordValue(label, value){
    let result = {
        label: null,
        value: null
    };

    switch(label){
        case "Oferta od":
            {
                result.label = "vendorType";

                if(value === "Osoby prywatnej")
                    result.value = 1;
                else
                    result.value = 2;
            }
            break;

        case "Powierzchnia":
            {
                result.label = "area";
                result.value = parseInt(value);
            }
            break;

        case "Liczba pokoi":
            {
                result.label = "roomCount";

                switch(value){
                    case "Kawalerka":
                        result.value = 1;
                        break;

                    default:
                        result.value = parseInt(value);
                        break;
                }
            }
            break;

        default:
            return null;
    }

    return result;
}

Meteor.methods({
    "scrap-olx": function(){
        let offers = {};

        let data = {
            nextPageLink: "http://olx.pl/nieruchomosci/mieszkania/wynajem/q-Pozna%C5%84/"
        };

        do {
            data = Meteor.call("scrap-olx-offers-hub-page", data.nextPageLink);
            data.singleOfferPages.forEach(offer => offers[offer] = offer);
        } while(data.nextPageLink !== undefined);

        offers = Object.keys(offers);

        for(let i = 0; i < offers.length; i++){
            let offerData = Meteor.call("scrap-olx-offer-page", offers[i]);
            Meteor.call("handle-offer", offerData);
        }
    },
    "scrap-olx-offers-hub-page": function(offerPageUrl){
        console.log("scrap-olx-offers-hub-page", offerPageUrl);

        let query = Crawler.get(offerPageUrl);
        let $ = cheerio.load(query.content);

        let links = {};

        $("a.detailsLink").each((i, v) => {
            let linkWithHash = $(v).attr('href');
            let linkWithoutHash = linkWithHash.substring(0, linkWithHash.indexOf('#'));
            links[linkWithoutHash] = linkWithoutHash;
        });

        let nextPageLink = $(".next .pageNextPrev").attr('href');

        return {
            nextPageLink,
            singleOfferPages: Object.keys(links)
        };
    },
    "scrap-olx-offer-page": function(offerPageUrl){
        console.log("scrap-olx-offer-page", offerPageUrl);

        let query = Crawler.get(offerPageUrl);
        let $ = cheerio.load(query.content);

        let title = $("h1").text().trim();
        let description = $("#textContent").text().trim();
        let price = parseInt($(".pricelabel strong").text().trim().replace(" ", ""));
        let coverPicture = $(".photo-handler img").attr('src');

        let offer = {
            url: offerPageUrl,
            title,
            description,
            price,
            pictures: [coverPicture],
            city: "Poznań"
        };

        $("table.details table.item").each(function(i, item){
            let label = $(item).find('th').text().trim();
            let value = $(item).find('td').text().trim();

            let pair = labelValueToKeywordValue(label, value);

            if(pair !== null)
                offer[pair.label] = pair.value;
        });

        return offer;
    }
});

SyncedCron.add({
    name: 'scrap-olx',
    schedule: function(parser){
        return parser.text('at 9:00 am');
    },
    job: function() {
        Meteor.call("scrap-olx")
    }
});