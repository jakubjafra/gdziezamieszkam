sorting = new ReactiveVar({
    basicQuery: 0,
    isQualityImportant: true
});

Template.sorting.onCreated(function(){
    sorting.set({
        basicQuery: 0,
        isQualityImportant: true
    });
});

Template.sorting.onRendered(function(){
    let instance = Template.instance();
    
    this.autorun(function(){
        let data = sorting.get();

        if(data.__mineChanged === undefined){
            instance.$("#sorting").val(data.basicQuery);
            instance.$("#qualityImportant").attr("checked", data.isQualityImportant);
        }
    });
});

Template.sorting.helpers({
    'sortingOptions': () => Sorting.labelsByGroup()
});

Template.sorting.events({
    'change #sorting': function(event){
        let data = sorting.get();

        data.basicQuery = $(event.currentTarget).val();
        data.__mineChanged = true;

        sorting.set(data);
    },
    'change #qualityImportant': function(event){
        let data = sorting.get();

        data.isQualityImportant = $(event.currentTarget).is(':checked') === true;
        data.__mineChanged = true;

        sorting.set(data);
    }
});