declare namespace App {
  interface Scrape {
    date: Date;
    restaurants: Restaurant[];
  }

  interface Restaurant {
    title: string;
    url: string;
    imgUrl: string;
    dishCollection: DishCollection[];
    longitude: number;
    latitude: number;
    distance: number;
    googleMapsUrl: string;
  }

  interface DishCollection {
    language: string;
    dishes: Dish[];
  }

  interface Dish {
    type: DishType;
    description: string | null | undefined;
  }

  type DishType = 'meat' | 'fish' | 'veg' | 'misc';
}
