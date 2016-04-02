function labelValueToKeywordValue(label, value){
    let result = {
        label: null,
        value: null
    };

    switch(label){
        case "Do wynajęcia przez":
        {
            result.label = "vendorType";

            if(value === "Właściciel")
                result.value = 1;
            else
                result.value = 2;
        }
            break;

        case "Wielkość (m2)":
        {
            result.label = "area";
            result.value = parseInt(value);
        }
            break;

        case "Liczba pokoi":
        {
            result.label = "roomCount";

            switch(value){
                case "Kawalerka lub garsoniera":
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
    "scrap-gumtree": function(){
        let offers = {};

        let data = {
            nextPageLink: "http://www.gumtree.pl/s-mieszkania-i-domy-do-wynajecia/poznan/v1c9008l3200366p1"
        };

        do {
            data = Meteor.call("scrap-gumtree-offers-hub-page", data.nextPageLink);
            data.singleOfferPages.forEach(offer => offers[offer] = offer);
        } while(data.nextPageLink !== undefined);

        offers = Object.keys(offers);

        for(let i = 0; i < offers.length; i++){
            let offerData = Meteor.call("scrap-gumtree-offer-page", offers[i]);
            Meteor.call("handle-offer", offerData);
        }
    },
    "scrap-gumtree-offers-hub-page": function(offerPageUrl){
        console.log("scrap-gumtree-offers-hub-page", offerPageUrl);

        let query = Crawler.get(offerPageUrl);
        let $ = cheerio.load(query.content);

        let links = {};

        $("li.result div.title a.href-link").each((i, v) => {
            let rawLink = $(v).attr('href');
            let link = "http://www.gumtree.pl" + rawLink;
            links[link] = link;
        });

        let nextPageLink = $("div.pagination a.next").attr('href');

        if(nextPageLink !== undefined)
            nextPageLink = "http://www.gumtree.pl" + nextPageLink;

        return {
            nextPageLink,
            singleOfferPages: Object.keys(links)
        };
    },
    "scrap-gumtree-offer-page": function(offerPageUrl){
        console.log("scrap-gumtree-offer-page", offerPageUrl);

        let query = Crawler.get(offerPageUrl);
        let $ = cheerio.load(query.content);

        let title = $("h1").text().trim();
        let description = $($(".description")[0]).text().trim();
        let price = parseInt($($("div.price span.amount")[0]).text().trim().replace(/\u00a0/g, "").replace(" ", ""));
        let coverPicture = $(".vip-gallery .main img").attr('src');

        let offer = {
            url: offerPageUrl,
            title,
            description,
            price,
            pictures: [coverPicture],
            city: "Poznań"
        };

        $("ul.selMenu li").each(function(i, item) {
            let label = $(item).find('span.name').text().trim();
            let value = $(item).find('span.value').text().trim();

            let pair = labelValueToKeywordValue(label, value);

            if(pair !== null)
                offer[pair.label] = pair.value;
        });

        return offer;
    }
});