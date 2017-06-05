function generateFunnyName(){
    let firstWordPossibilites = [
        "Anonimowy",
        "Nieznany",
        "Tajemniczy",
        "Enigmatyczny",
        "Bezimienny"
    ];

    let secondWordPossibilites = [
        "Lis",
        "Wilk",
        "Orzeł",
        "Gołąmb",
        "Krokodyl",
        "Jastrząb"
    ];

    return Random.choice(firstWordPossibilites) + " " + Random.choice(secondWordPossibilites);
}

Accounts.registerLoginHandler("alwaysToken", function(options){
    if(options.method !== "alwaysToken")
        return undefined;

    let token = options.token;

    function createNewUser(){
        function generateUniqueId(){
            let uniqueId = Random.secret();

            let foundUser = Meteor.users.findOne({
                'services.alwaysToken.id': uniqueId
            });

            if(foundUser === undefined)
                return uniqueId;
            else
                return generateUniqueId();
        }

        let uniqueId = generateUniqueId();

        let userId = Meteor.users.insert({
            'name': generateFunnyName(),
            'services': {
                'alwaysToken': {
                    id: uniqueId
                }
            }
        });

        return {
            userId: userId
        };
    }

    if(token === undefined){
        return createNewUser();
    }
    else {
        let foundUser = Meteor.users.findOne({
            'services.alwaysToken.id': token
        });

        if(foundUser === undefined)
            return createNewUser();

        return {
            userId: foundUser._id
        };
    }
});

Meteor.publish("alwaysToken", function(){
    return Meteor.users.find(this.userId, {
        'fields': {
            'name': 1,
            'services.alwaysToken.id': 1
        }
    });
});