const puppeteer = require("puppeteer");
const { delay } = require("./util");
const path = require("path");
const fs = require("fs");

/**
 * Main Controller for bot actions
 * @param {Config} config object with all configurations about bot runtime
 */
const worker = async (config) => {
  const browser = await puppeteer.launch({
    headless: config.window.headless,
    defaultViewport: {
      height: config.window.height,
      width: config.window.width,
    },
  });
  const page = await browser.newPage();
  const dataForExport = [];

  /** open the page and wait for first cold start */
  await page.goto(config.url);
  await delay(500);

  /** repeat the process for n samples */
  for (let i = 0; i < config.sampleSize; i++) {
    await delay(100);
    await page.mouse.click(25, 25);
    /** read data from the webpage about sample dimensions */
    const metadata = await page.evaluate(() => {
      return {
        xMin: document.getElementById("xMin").value,
        yMin: document.getElementById("yMin").value,
        xMax: document.getElementById("xMax").value,
        yMax: document.getElementById("yMax").value,
        label: document.getElementById("label").value,
      };
    });

    metadata.path = `${i}.jpg`;

    /** take a screenshot */
    await page.screenshot({
      path: path.join(__dirname, `../storage/paragraph/${i}.jpg`),
      captureBeyondViewport: true,
      clip: {
        x: 0,
        y: 0,
        width: config.window.width,
        height: 300,
      },
    });

    /** push data for export into array */
    dataForExport.push(metadata);
    console.log(`sample.${i}.processed`);
  }
  /** all operations end, close browser */
  await browser.close();
  await fs.writeFileSync("./report.json", JSON.stringify(dataForExport));
};

/**
 * configuration that defines runtime behavior of bot
 */
const config = {
  sampleSize: 1000,
  url: "http://localhost:5000",
  window: {
    headless: true,
    width: 1366,
    height: 768,
  },
};
worker(config);
