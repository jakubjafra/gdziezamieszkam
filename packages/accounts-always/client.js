Meteor.autorun(function(){
    Meteor.loginWithToken(undefined);

    Meteor.subscribe("alwaysToken");

    let autorun = Meteor.autorun(function(){
        let user = Meteor.users.findOne(Meteor.userId());

        if(user === undefined || user.services === undefined || user.services.alwaysToken === undefined)
            return;

        if(user.services.alwaysToken.id !== undefined) {
            window.localStorage.setItem("AlwaysToken", user.services.alwaysToken.id);
            autorun.stop();
        }
    });
});