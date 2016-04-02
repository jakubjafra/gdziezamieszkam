let STREET_DEF_URL = "https://docs.google.com/spreadsheets/d/14LG8pjXy6wcFF4l4KTkYuE0AcH198zd5blxF4ibXt0s/pubhtml";
let HOUSING_DEF_URL = "https://docs.google.com/spreadsheets/d/1hYQkmOYcBlrxtILLf9vC2hog37Upaj8yTSQ-KXEFXyA/pubhtml";
let DISTRICT_DEF_URL = "https://docs.google.com/spreadsheets/d/1Ond0ebXxebvnJzHmNn5BQfKTUVSXLQJTtrQ7EDnM0pc/pubhtml";

let StreetNames = new Mongo.Collection("street_names");
let HousingNames = new Mongo.Collection("housing_names");
let DistrictNames = new Mongo.Collection("district_names");

Meteor.methods({
    'update-dictionaries': function(){
        StreetNames.remove({});
        parseDefinitionFile(STREET_DEF_URL, StreetNames);
        HousingNames.remove({});
        parseDefinitionFile(HOUSING_DEF_URL, HousingNames);
        DistrictNames.remove({});
        parseDefinitionFile(DISTRICT_DEF_URL, DistrictNames);
    },
    'find-street-in-string': function(string, minSimiliarity){
        var splited = string.split(/[\s\.\!-,\/]/);

        var streetName = "";
        var similarity = 0;
        var nextModifier = 0;

        for(var i in splited){
            var str = stripAccents(splited[i], -1);

            if(str == "os" || howSimilarTheyAre(str, "osiedle") >= 0.9 || howSimilarTheyAre(str, "osiedlu") >= 0.9){
                nextModifier -= 1;
                continue;
            }

            if(str == "przy"){
                nextModifier += 0.1;
                continue;
            }

            if(str == "na"){
                nextModifier += 0.1;
                continue;
            }

            if(str == "ul" || howSimilarTheyAre(str, "ulicy") >= 0.9){
                nextModifier += 0.25;
                continue;
            }

            if(str.length <= 4)
                continue;

            StreetNames.find({}).forEach(function(street){
                var sim = howSimilarTheyAre(str, street.keywords[0].latinKeyword) + nextModifier;
                if(similarity < sim && sim >= 1){
                    similarity = sim;
                    streetName = street.name;
                }
            });

            nextModifier = 0;
        }

        if(similarity >= minSimiliarity)
            return streetName;
        else
            return null;
    },
    'find-district-in-string': function(string, minSimiliarity){
        var splited = string.split(/[\s\.\!-,\/]/);

        var streetName = "";
        var similarity = 0;
        var nextModifier = 0;

        for(var i in splited){
            var str = stripAccents(splited[i], -1);

            if(str == "na"){
                nextModifier += 0.15;
                continue;
            }

            if(str.length <= 4)
                continue;

            DistrictNames.find({}).forEach(function(district){
                var sim = howSimilarTheyAre(str, district.keywords[0].latinKeyword) + nextModifier;
                if(similarity < sim && sim >= 1){
                    similarity = sim;
                    streetName = district.name;
                }
            });

            nextModifier = 0;
        }

        if(similarity >= minSimiliarity)
            return streetName;
        else
            return null;
    },
    'find-housing-in-string': function(string, minSimiliarity){
        var splited = string.split(/[\s\.\!-,\/]/);

        var streetName = "";
        var similarity = 0;
        var nextModifier = 0;

        for(var i in splited){
            var str = stripAccents(splited[i], -1);

            if(str == "na"){
                nextModifier += 0.1;
                continue;
            }

            if(str == "os" || howSimilarTheyAre(str, "osiedle") >= 0.9 || howSimilarTheyAre(str, "osiedlu") >= 0.9){
                nextModifier += 0.25;
                continue;
            }

            if(str.length <= 4)
                continue;

            HousingNames.find({}).forEach(function(district){
                var sim = howSimilarTheyAre(str, district.keywords[0].latinKeyword) + nextModifier;
                if(similarity < sim && sim >= 1){
                    similarity = sim;
                    streetName = district.name;
                }
            });

            nextModifier = 0;
        }

        if(similarity >= minSimiliarity)
            return streetName;
        else
            return null;
    }
});

stripAccents = function (s, c){
    var $acc, $str, o, r, i

    // if character case for output string is not set set it to -1 (lowercase)
    if (typeof(c)=='undefined'){
        c = -1;
    }

    // convertion table. It can be copied from PHP source.
    $acc =	'É	Ê	Ë	š	Ì	Í	ƒ	œ	µ	Î	Ï	ž	Ð	Ÿ	Ñ	Ò	Ó	Ô	Š	£	Õ	Ö	Œ	¥	Ø	Ž	§	À	Ù	Á	Ú	Â	Û	Ã	Ü	Ä	Ý	';
    $str =	'E	E	E	s	I	I	f	o	m	I	I	z	D	Y	N	O	O	O	S	L	O	O	O	Y	O	Z	S	A	U	A	U	A	U	A	U	A	Y	';
    $acc+=	'Å	Æ	ß	Ç	à	È	á	â	û	Ĕ	ĭ	ņ	ş	Ÿ	ã	ü	ĕ	Į	Ň	Š	Ź	ä	ý	Ė	į	ň	š	ź	å	þ	ė	İ	ŉ	Ţ	Ż	æ	ÿ	';
    $str+=	'A	A	S	C	a	E	a	a	u	E	i	n	s	Y	a	u	e	I	N	S	Z	a	y	E	i	n	s	z	a	p	e	I	n	T	Z	a	y	';
    $acc+=	'Ę	ı	Ŋ	ţ	ż	ç	Ā	ę	Ĳ	ŋ	Ť	Ž	è	ā	Ě	ĳ	Ō	ť	ž	é	Ă	ě	Ĵ	ō	Ŧ	ſ	ê	ă	Ĝ	ĵ	Ŏ	ŧ	ë	Ą	ĝ	Ķ	ŏ	';
    $str+=	'E	l	n	t	z	c	A	e	I	n	T	Z	e	a	E	i	O	t	z	e	A	e	J	o	T	i	e	a	G	j	O	t	e	A	g	K	o	';
    $acc+=	'Ũ	ì	ą	Ğ	ķ	Ő	ũ	í	Ć	ğ	ĸ	ő	Ū	î	ć	Ġ	Ĺ	Œ	ū	ï	Ĉ	ġ	ĺ	œ	Ŭ	ð	ĉ	Ģ	Ļ	Ŕ	ŭ	ñ	Ċ	ģ	ļ	ŕ	Ů	';
    $str+=	'U	i	a	G	k	O	u	i	C	g	k	o	U	i	c	G	L	O	u	i	C	g	l	o	U	o	c	G	L	R	u	n	C	g	l	r	U	';
    $acc+=	'ò	ċ	Ĥ	Ľ	Ŗ	ů	ó	Č	ĥ	ľ	ŗ	Ű	ô	č	Ħ	Ŀ	Ř	ű	õ	Ď	ħ	ŀ	ř	Ų	ö	ď	Ĩ	Ł	Ś	ų	Đ	ĩ	ł	ś	Ŵ	ø	đ	';
    $str+=	'o	c	H	L	R	u	o	C	h	l	r	U	o	c	H	L	R	u	o	D	h	l	r	U	o	d	I	L	S	c	D	i	l	s	W	o	d	';
    $acc+=	'Ī	Ń	Ŝ	ŵ	ù	Ē	ī	ń	ŝ	Ŷ	Ə	ú	ē	Ĭ	Ņ	Ş	ŷ	 	:	;	.	,';
    $str+=	'I	N	S	w	u	E	i	n	s	Y	e	u	e	I	N	S	y	 	:	;	.	,';

    // If charactes wasn't in convertion table and it is not a [a-zA-z0-9_-] convert it to this char
    o = '';

    // convert convertion tables into arrays
    var ta = $acc.split("\t");
    var ts = $str.split("\t");

    // iterate over convertion tables and replace every char in string
    for (i = 0; i < ta.length; i++){
        r = new RegExp('[' + ta[i] + ']', 'g');
        s = s.replace(r, ts[i]);
    }

    // remove every character not found in convertion table
    s = s.replace(/[^a-zA-Z0-9_ -]/gi, o);

    // some optimization - you can change it if you change conversion tables
    // here I replace multiple underscores into one undercore and strip
    // underscores at begining and ehd of string
    s = s.replace(/[_]*/, '_');
    s = s.replace(/^_*(.*?)_*$/gi, '$1')

    // return converted string
    if(c == -1){
        return s.toLowerCase();
    }else if(c == 1){
        return s.toUpperCase();
    }else{
        return s;
    }
};

howSimilarTheyAre = function(word, streetName){
    word = word.toLowerCase();
    streetName = streetName.toLowerCase();

    var longest = Math.max(word.length, streetName.length);
    var shorter = Math.min(word.length, streetName.length);

    var similar = 0;
    for(var i = 0; i < shorter; i++){
        if(word[i] === streetName[i])
            similar++;
        else
            break;
    }

    return (similar / longest);
};

parseDefinitionFile = function(url, table){
    Crawler.get(
        url,
        {},
        function(error, result){
            console.log("[name-street] * Got definition file!");

            var streets = cheerio.load(result.content);

            table.remove({});
            streets('tbody tr').each(function(i, v){
                var name = streets("td.s0", v).get(0).children[0].data;

                var keywords = [];

                for(var i = 1; i < streets("td.s0", v).length; i++){
                    if(streets("td.s0", v).get(i).children[0] == undefined)
                        continue;

                    var keyword = streets("td.s0", v).get(i).children[0].data.trim();
                    var latinKeyword = stripAccents(keyword, -1);

                    keywords.push({
                        keyword: keyword,
                        latinKeyword: latinKeyword
                    });
                }

                table.insert({
                    name: name,
                    keywords: keywords
                });
            });

            console.log("[name-street] * ...Done.");
        }
    );
};