UI.registerHelper('niceInt', function(number){
    number = parseInt(number, 10);

    if(Number.isNaN(number))
        return null;
    else
        return number;
});

UI.registerHelper('niceFloat', function(number){
    if(typeof number !== "number")
        number = parseFloat(number.replace(",", "."));

    return parseFloat(Math.round(number * 100) / 100).toFixed(2).replace(".", ",");
});
