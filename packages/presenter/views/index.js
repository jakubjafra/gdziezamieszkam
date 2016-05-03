(function(){
    Template.subscribeModal.events({
        'submit form#subscribeForm': function(event){
            event.stopPropagation();

            let email = $("#email").val();

            Subscriptions.insert({
                email,
                reason: {
                    type: "new_cities",
                    estateType: $("#type").val(),
                    city: $("#city").val()
                }
            });

            $("#subscribeModal").modal('hide');
            return false;
        }
    })
})();

(function(){
    Template.callToActionForm.events({
        'submit form#callToAction': function(event){
            event.stopPropagation();

            let type = $("#type").val();
            let city = $("#city").val();
            
            if(type === "flat" && city === "poznan")
                Router.go("offersList");
            else
                $("#subscribeModal").modal('show');

            return false;
        }
    })
})();