// Source: https://jizzaxhotel.uz/en-gb/ and /en-gb/contacts/, checked 2026-10-30.
// Preserve these destination URLs, including each room-type identifier.
export const hotel = {
  name: "Jizzax Hotel",
  website: "https://jizzaxhotel.uz",
  booking: "https://jizzaxhotel.uz/en-gb/booking/",
  phone: "+998 55 520 00 11",
  phoneHref: "tel:+998555200011",
  email: "jizzaxhotel@gmail.com",
  address:
    "Milliy Bog Street 80/6, Mirzo Ulugbek district, Tashkent, Uzbekistan",
  maps: "https://www.google.com/maps/search/?api=1&query=41.330337%2C69.444573",
} as const;

export const rooms = [
  {
    name: "Standard King Size Room",
    shortName: "Standard King",
    category: "Standard",
    bed: "King bed",
    balcony: false,
    image: "bc2a80b581396a4b",
    bookingUrl: "https://jizzaxhotel.uz/en-gb/booking/?room-type=5066922",
  },
  {
    name: "Standard Twin Room",
    shortName: "Standard Twin",
    category: "Standard",
    bed: "Twin beds",
    balcony: false,
    image: "4b2e09b705016f46",
    bookingUrl: "https://jizzaxhotel.uz/en-gb/booking/?room-type=5066923",
  },
  {
    name: "Standard King Size Room with Balcony",
    shortName: "Standard King with Balcony",
    category: "Standard",
    bed: "King bed",
    balcony: true,
    image: "f0c21258d47fdbbb",
    bookingUrl: "https://jizzaxhotel.uz/en-gb/booking/?room-type=5066931",
  },
  {
    name: "Standard Twin Room with Balcony",
    shortName: "Standard Twin with Balcony",
    category: "Standard",
    bed: "Twin beds",
    balcony: true,
    image: "c7677ad85ced3d3e",
    bookingUrl: "https://jizzaxhotel.uz/en-gb/booking/?room-type=5066934",
  },
  {
    name: "Deluxe King Size Room with Balcony",
    shortName: "Deluxe King with Balcony",
    category: "Deluxe",
    bed: "King bed",
    balcony: true,
    image: "8622a179a5251e21",
    bookingUrl: "https://jizzaxhotel.uz/en-gb/booking/?room-type=5066941",
  },
  {
    name: "Deluxe Twin Room",
    shortName: "Deluxe Twin",
    category: "Deluxe",
    bed: "Twin beds",
    balcony: false,
    image: "09260cd0f524d366",
    bookingUrl: "https://jizzaxhotel.uz/en-gb/booking/?room-type=5066940",
  },
  {
    name: "Junior Twin Suite with Balcony",
    shortName: "Junior Twin Suite",
    category: "Suites",
    bed: "Twin beds",
    balcony: true,
    image: "dc37521878c2d8a9",
    bookingUrl: "https://jizzaxhotel.uz/en-gb/booking/?room-type=5066946",
  },
  {
    name: "Senior King Size Suite with Balcony",
    shortName: "Senior King Suite",
    category: "Suites",
    bed: "King bed",
    balcony: true,
    image: "2c10cb74b517fcc4",
    bookingUrl: "https://jizzaxhotel.uz/en-gb/booking/?room-type=5066947",
  },
] as const;

export const photo = (id: string) => `/img/${id}.webp`;
