Meteor.methods({
    'find-deposit-in-string': function(string){
        var splited = string.split(/[\s\.\!-,\/]/);

        var similiarity = 0;

        for(var i in splited) {
            var str = stripAccents(splited[i], -1);

            if(howSimilarTheyAre(str, "kaucja") >= 0.9 || howSimilarTheyAre(str, "kaucje") >= 0.9)
                similiarity = 1.5;

            let int = parseInt(str);
            if(!Number.isNaN(int) && similiarity > 1 && int >= 100) {
                return int;
            }

            if(similiarity > 1)
                similiarity -= 0.1;
            else
                similiarity = 0;
        }

        return null;
    }
});