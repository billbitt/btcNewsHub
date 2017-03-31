# BTC News Hub
This website aggregates news articles regarding bitcoin, and creates a forum for users to post comments and replies on the news.

Check out the live application [here](), and if you have any suggestions, pull requests are welcome!

## project goals
My goal with this project was to learn how to use a web scraper to populate content for a site.  

## application architecture
For this project, I used the npm package cheerio to scrape a bitcoin website, 'the merkle', for recent news articles.  I then store the scraped information (headline, link, etc.) for the articles in a mongo database.  The application displays these news articles as linked headings, and it also allows users to comment and reply to comments.  Comments and replies are stored in the mongod database in a separate collection.

## tech used
+ handlebars (to display the view)
+ mongodb and mongoose (database and ORM)
+ cheerio (web scraping)
+ HTML/CSS/Javascript
