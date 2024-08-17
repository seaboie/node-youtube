import puppeteer from "puppeteer";
import fs from 'fs';
import path from 'path';

const scrape = async () => {
  const baseUrl = "https://books.toscrape.com/";
  // launch web page
  const browser = await puppeteer.launch();
  try {
    // new page
    const page = await browser.newPage();

    // Go to url
    await page.goto(baseUrl);

    // Evaluate function for run javascript in context of the page
    const books = await page.evaluate(() => {
        const url = "https://books.toscrape.com/";
        const bookElements = document.querySelectorAll(".product_pod");
        return Array.from(bookElements).map((book) => {
            const title = book.querySelector('h3 a').getAttribute('title');
            const price = book.querySelector('.price_color').textContent;
            const stock = book.querySelector('.instock.availability') ? 'In Stock' : 'Out of stock';
            const rating = book.querySelector('.star-rating').className.split(' ')[1];

            const linkUrl = book.querySelector('.image_container a').getAttribute('href');
            const link = url + linkUrl;

            const imageLink = book.querySelector('img').getAttribute('src');
            const imageUrl = url + imageLink
            return {
                title,
                price,
                stock,
                rating,
                link,
                imageUrl,
            };
        });
    });

    fs.writeFileSync('./books.json', JSON.stringify(books, null, 2))

    console.log(`🔨 🔨 🔨` + `Data of books is saved to : book.json file`);
    
  } catch (err) {
    console.error(`🔥 🔥 🔥 🔥 🔥 Oops !!! : Have error `, err);
  } finally {
    await browser.close();
  }
};

scrape();
