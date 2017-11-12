gdziezamieszkam
===============

"Gdziezamieszkam" is a small scrapper and frontend for searching apartments for renting in Poznań, Poland. **Created out of frustration due to poor user experience while searching flats for rent** using OLX or Gumtree - for example price listed there is not full price, but only money for flat owner - but while renting there're more fixed fees. It's still usable, and offer some adventages over scraped sites with offers (like OLX or Gumtree), like:
* finding **real street address** out of offer description text
* finding **real rent price** including monthly payment to the owner, housing cooperative listed separately; and deposit out of description text
* providing searchable fields like **total rent price**, **districts** or **total rent price per area**
* nice, fully responsive user interface integrated into SPA (no more waiting for offers!)

Most of the improvements are made only due to some simple algorythms parsing offer description and/or title - I really don't understand why those bits of information are not provided by those giants.

Legal notice
------------

Both OLX and Gumtree's Terms of use specify that using bots to scrap their data - without their consent - is **forbidden**. However, under - at least - Polish law scraping publicly available data for **personal use only** is **not forbidden**. This code was created for educational purposes only, and should not be used in any other way - especially commercially. Be safe!

Usage
-----

![Usage gif](https://github.com/khronedev/gdziezamieszkam/raw/master/showcase/gdziezamieszkam-v3.gif)

```
docker-compose up -d mongo
docker-compose up app
```
Go to `http://0.0.0.0/mieszkania/poznan`.

In developer's console run:
```
Meteor.call("scrap-olx");
// AND/OR
Meteor.call("scrap-gumtree");
```

Currently software interface is in Polish, and the only scraped city is Poznań, Poland. There're no plans for further development.

License
-------

MIT
