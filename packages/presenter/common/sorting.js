let sortingGroups = {
    "price": "Cena",
    "area": "Powierzchnia"
};

let basicSortingOptions = [
    {
        label: "Po cenie, rosnąco",
        group: "price",
        query: ['price.price', 1]
    },
    {
        label: "Po cenie, malejąco",
        group: "price",
        query: ['price.price', -1]
    },
    {
        label: "Po cenie za m², rosnąco",
        group: "price",
        query: ['pricePerArea', 1]
    },
    {
        label: "Po cenie za m², malejąco",
        group: "price",
        query: ['pricePerArea', -1]
    },
    {
        label: "Po powierzchni, rosnąco",
        group: "area",
        query: ['area', 1]
    },
    {
        label: "Po powierzchni, malejąco",
        group: "area",
        query: ['area', -1]
    }
];

Sorting = (function(){
    return {
        labelsByGroup() {
            return Object
                .keys(sortingGroups)
                .map(groupName => {
                    return {
                        label: sortingGroups[groupName],
                        options: Object
                            .keys(basicSortingOptions)
                            .map(index => { return { index: index, value: basicSortingOptions[index] } })
                            .filter(option => option.value.group === groupName)
                            .map(option => { return { label: option.value.label, value: option.index } })
                    };
                });
        },

        constructQuery(basicQuery, isQualityImportant){
            if(typeof basicQuery === "object"){
                isQualityImportant = basicQuery.isQualityImportant;
                basicQuery = basicQuery.basicQuery;
            }

            let query = [];

            if(isQualityImportant){
                query.push(["quality", -1]);
            }

            query.push(basicSortingOptions[basicQuery].query);

            return query;
        }
    }
})();