Meteor.loginWithToken = function(token, callback){
    // można wziąć login z localStorage (jeśli istnieje)
    if(token === undefined && Meteor.isClient){
        token = window.localStorage.getItem("AlwaysToken") || undefined;
    }

    let loginRequest = {
        method: "alwaysToken",
        token
    };

    Accounts.callLoginMethod({
        methodArguments: [loginRequest],
        userCallback: callback
    });
};