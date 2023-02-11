import puppeteer from "puppeteer";

export default defineEventHandler(async (e) => {
  const query = getQuery(e);

  const browser = await puppeteer.launch();
  const page = await browser.newPage({ headless: false });

  await page.goto(query.link);

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  let texts = await page.evaluate(() => {
    let data = [];

    const element = document.getElementsByClassName(
      "grid tm-player-transfer-history-grid"
    );
    element.forEach((e, i) => {
      const newclubElement = e.querySelector(
        ".tm-player-transfer-history-grid__new-club"
      );

      if (i > 0) {
        const textElem = newclubElement.querySelector(
          ".tm-player-transfer-history-grid__club-link"
        );
        const text = textElem.textContent;
        const trimmedText = text.trim();
        if (
          !trimmedText.includes("U13") &&
          !trimmedText.includes("U14") &&
          !trimmedText.includes("U15") &&
          !trimmedText.includes("U16") &&
          !trimmedText.includes("U17") &&
          !trimmedText.includes("U18") &&
          !trimmedText.includes("U19") &&
          !trimmedText.includes("U20") &&
          !trimmedText.includes("U21") &&
          !trimmedText.includes("U22") &&
          !trimmedText.includes("U23") &&
          !trimmedText.includes("II") &&
          !trimmedText.includes("Yth.") &&
          !trimmedText.includes("Yout") &&
          !trimmedText.includes("Youth") &&
          !trimmedText.includes("Jug.")
        ) {
          data.push(text.trim());
        }
      }
    });

    return { data };
  });

  await browser.close();

  return {
    api: "scrap",
    data: texts.data,
  };
});
