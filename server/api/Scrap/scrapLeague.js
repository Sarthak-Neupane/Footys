// import { clubModel } from "../../schema";

import puppeteer from "puppeteer";

export default defineEventHandler(async (event) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage({ headless: false });

  await page.goto(
    "https://www.transfermarkt.com/campeonato-brasileiro-serie-a/tabelle/wettbewerb/BRA1/saison_id/2022"
  );

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  let texts = await page.evaluate(() => {
    let data = [];
    let names = [];
    let titles = [];
    const element = document.getElementById("yw1");
    const anchorTag = element.querySelectorAll("a");

    anchorTag.forEach((e, i) => {
      if (e.textContent) {
        titles.push(e.title)
        names.push(e.textContent.trim());
      }
    });

    names.forEach((e, i) => {
      data.push({
        id: i + 135,
        name: e,
        fullName: titles[i],
        league: 'Campeonato Brasileiro Série A',
        country: 'Brazil',
        squad: [],
      });
    });

    return { data, names, titles };
  });

  await browser.close();

  return {
    api: "scrap",
    data: texts.data,
  };
});
