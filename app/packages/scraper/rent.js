Meteor.methods({
    'find-rent-in-string': function(string, price){
        var splited = string.split(/[\s\.\!-,\/]/);

        var similiarity = 0;
        var numberSimilarity = 0;
        var lastNumber = 0;

        for(var i in splited) {
            var str = stripAccents(splited[i], -1);

            let int = parseInt(str);
            if(!Number.isNaN(int) && int >= 100 && int !== price){
                lastNumber = int;
                numberSimilarity = 1.5;

                if(similiarity > 1)
                    return lastNumber;
            }

            if(howSimilarTheyAre(str, "czynsz") >= 0.9 || howSimilarTheyAre(str, "czynszu") >= 0.9 || howSimilarTheyAre(str, "spoldzielni") >= 0.9){
                similiarity = 1.5;

                if(numberSimilarity > 1){
                    return lastNumber;
                }
            }

            // ~~~

            if(numberSimilarity > 1)
                numberSimilarity -= 0.1;
            else
                numberSimilarity = 0;

            if(similiarity > 1)
                similiarity -= 0.1;
            else
                similiarity = 0;
        }

        return null;
    }
});