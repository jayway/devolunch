import { Page } from 'puppeteer';
import pdf from 'pdf-parse';

export const meta = {
  title: 'Lokal 17',
  url: 'https://lokal17.se/',
  imgUrl: 'https://lokal17.se/app/uploads/sites/2/2018/01/bg-22.jpg',
  googleMapsUrl: 'https://goo.gl/maps/eMsNxGK743oQVj8D9',
  latitude: 55.612111673032366,
  longitude: 12.995311427220344,
  pdf: true,
};

export const browserScrapeFunction = async (page: Page) =>
  page.evaluate(async () => {
    const lunchNode = [...document.querySelectorAll('a')].find((a) =>
      a?.innerText?.toLowerCase()?.includes('lunchmeny'),
    );
    const url = lunchNode?.getAttribute('href');

    if (!url) {
      return [];
    }

    return url;
  });

export const pdfScrapeFunction = async (url: string) => {
  const todaySwedishFormat = new Date()
    .toLocaleString('sv-SE', {
      weekday: 'long',
    })
    .toLowerCase();

  const f = await fetch(url);
  const buffer = await f.arrayBuffer();
  const pdfData = await pdf(Buffer.from(buffer));

  const raw = pdfData.text
    .split('\n')
    .map((a: string) =>
      a
        .replace(/ {2}|\r\n|\n|\r/gm, '')
        .replace('│', '')
        .replace(',', '')
        .trim(),
    )
    .filter((a: string) => a && !a.startsWith('Warning'));

  const todayMeatIndex = raw.findIndex((a: string) => a.toLowerCase().includes(todaySwedishFormat));
  const vegIndex = raw.findIndex((a: string) => a.toLowerCase().includes('vegetarisk'));
  const alwaysIndex = raw.findIndex((a: string) => a.toLowerCase().includes('alltid hos lokal'));

  const todayMeat = {
    type: 'meat' as const,
    description: raw[todayMeatIndex + 1],
  };

  const veg = {
    type: 'veg' as const,
    description: raw[vegIndex + 1],
  };

  const alwaysMeat = {
    type: 'meat' as const,
    description: raw[alwaysIndex + 1],
  };

  const alwaysVeg = {
    type: 'veg' as const,
    description: raw[alwaysIndex + 4],
  };

  const alwaysFish = {
    type: 'fish' as const,
    description: raw[alwaysIndex + 7],
  };

  return [todayMeat, veg, alwaysMeat, alwaysVeg, alwaysFish];
};