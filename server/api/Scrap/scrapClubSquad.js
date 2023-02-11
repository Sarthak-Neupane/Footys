import puppeteer from "puppeteer";

const run = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage({ headless: false });

  await page.goto(
    "https://www.transfermarkt.com/afc-bournemouth/kader/verein/989/saison_id/2022/plus/1"
  );

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  let texts = await page.evaluate(() => {
    let data = [];
    let container = document.querySelector("#yw1");
    let tableItems = document.querySelectorAll(".posrela");

    tableItems.forEach((e, i) => {
      let element = e.querySelector(".inline-table");
      let shirtNumber = container.querySelectorAll(".rn_nummer");
      const nameElem = element.rows[0].cells[1];
      const positionElem = element.rows[1].cells[0];
      const name = nameElem.textContent;
      const position = positionElem.textContent;

      const playerLink = nameElem.querySelector("a");
      data.push({
        link: playerLink.href,
        name: name.trim(),
        position: position.trim(),
        shirtNumber: shirtNumber[i].textContent,
      });
    });

    return { data };
  });

  await browser.close();
  return {
    api: "scrap",
    data: texts.data,
  };
};

export default defineEventHandler(run);
