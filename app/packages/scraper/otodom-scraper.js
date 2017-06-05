Meteor.methods({
    "scrap-otodom": function(){
        let offers = {};

        let data = {
            nextPageLink: "http://otodom.pl/wynajem/mieszkanie/poznan/?search%5Bdist%5D=0"
        };

        do {
            data = Meteor.call("scrap-otodom-offers-hub-page", data.nextPageLink);
            data.singleOfferPages.forEach(offer => offers[offer] = offer);
        } while(data.nextPageLink !== undefined);

        offers = Object.keys(offers);

        for(let i = 0; i < offers.length; i++){
            let offerData = Meteor.call("scrap-otodom-offer-page", offers[i]);
            Meteor.call("handle-offer", offerData);
        }
    },
    "scrap-otodom-offers-hub-page": function(offerPageUrl){
        console.log("scrap-otodom-offers-hub-page", offerPageUrl);

        let query = Crawler.get(offerPageUrl);
        let $ = cheerio.load(query.content);

        let links = {};

        $(".listing .row article.offer-item header a").each((i, v) => {
            let rawLink = $(v).attr('href');
            links[link] = rawLink;
        });

        let nextPageLink = $("#pagerForm .pager li:last-child a").attr('href');

        return {
            nextPageLink,
            singleOfferPages: Object.keys(links)
        };
    },
    "scrap-otodom-offer-page": function(offerPageUrl){
        console.log("scrap-otodom-offer-page", offerPageUrl);

        let query = Crawler.get(offerPageUrl);
        let $ = cheerio.load(query.content);

        let title = $("h1").text().trim();
        let description = $($(".section-offer-text .col-md-offer-content")[0]).text().trim();
        let price = parseInt($(".params-list ul.main-list li:first-child span").replace(/\u00a0/g, "").replace(" ", ""));

        let pictures = [];
        $("#gallery-box .rsContainer div").forEach(function(i, v){
            pictures.push($(i).find('img').attr('src'));
        });

        let offer = {
            url: offerPageUrl,
            title,
            description,
            price: {
                price
            },
            pictures: pictures,
            city: "Poznań"
        };

        offer.vendorType = $(".box-brand").length === 1 ? 2 : 1;
        offer.area = parseInt($(".params-list ul.main-list li:first-child span").replace(/\u00a0/g, "").replace(" ", ""));

        return offer;
    }
});

SyncedCron.add({
    name: 'scrap-otodom',
    schedule: function(parser){
        return parser.text('at 3:00 am');
    },
    job: function() {
        Meteor.call("scrap-otodom")
    }
});