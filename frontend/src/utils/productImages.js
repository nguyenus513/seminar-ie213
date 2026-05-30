const IGNORED_NAME_PARTS = /\b(?:64|128|256|512)gb\b|\b1tb\b|\b(?:16|32)gb ram\b|\b20\d{2}\b|\bm\d{3,5}\b/gi;

const appleImage = (asset) => `https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/${asset}?wid=640&hei=640&fmt=png-alpha`;
const appleWikiImage = (asset) => `https://theapplewiki.com/images/applewiki/${asset}`;
const samsungImage = (asset) => `https://images.samsung.com/is/image/samsung/${asset}?$Q90_684_547_JPG$`;
const xiaomiImage = (asset) => `https://i02.appmifile.com/${asset}`;

const PRODUCT_IMAGES = [
  {
    pattern: /iphone\s+16\s+pro\s+max/i,
    defaultColor: "natural titanium",
    colors: {
      "black titanium": appleImage("iphone-16-pro-finish-select-202409-6-9inch-blacktitanium"),
      black: appleImage("iphone-16-pro-finish-select-202409-6-9inch-blacktitanium"),
      graphite: appleImage("iphone-16-pro-finish-select-202409-6-9inch-blacktitanium"),
      "white titanium": appleImage("iphone-16-pro-finish-select-202409-6-9inch-whitetitanium"),
      white: appleImage("iphone-16-pro-finish-select-202409-6-9inch-whitetitanium"),
      silver: appleImage("iphone-16-pro-finish-select-202409-6-9inch-whitetitanium"),
      "natural titanium": appleImage("iphone-16-pro-finish-select-202409-6-9inch-naturaltitanium"),
      "desert titanium": appleImage("iphone-16-pro-finish-select-202409-6-9inch-deserttitanium"),
      gold: appleImage("iphone-16-pro-finish-select-202409-6-9inch-deserttitanium")
    }
  },
  {
    pattern: /iphone\s+16\s+pro(?!\s+max)/i,
    defaultColor: "natural titanium",
    colors: {
      "black titanium": appleImage("iphone-16-pro-finish-select-202409-6-3inch-blacktitanium"),
      black: appleImage("iphone-16-pro-finish-select-202409-6-3inch-blacktitanium"),
      graphite: appleImage("iphone-16-pro-finish-select-202409-6-3inch-blacktitanium"),
      "white titanium": appleImage("iphone-16-pro-finish-select-202409-6-3inch-whitetitanium"),
      white: appleImage("iphone-16-pro-finish-select-202409-6-3inch-whitetitanium"),
      silver: appleImage("iphone-16-pro-finish-select-202409-6-3inch-whitetitanium"),
      "natural titanium": appleImage("iphone-16-pro-finish-select-202409-6-3inch-naturaltitanium"),
      "desert titanium": appleImage("iphone-16-pro-finish-select-202409-6-3inch-deserttitanium"),
      gold: appleImage("iphone-16-pro-finish-select-202409-6-3inch-deserttitanium")
    }
  },
  {
    pattern: /iphone\s+16\s+plus/i,
    defaultColor: "black",
    colors: {
      black: appleImage("iphone-16-finish-select-202409-6-7inch-black"),
      white: appleImage("iphone-16-finish-select-202409-6-7inch-white"),
      silver: appleImage("iphone-16-finish-select-202409-6-7inch-white"),
      blue: appleImage("iphone-16-finish-select-202409-6-7inch-ultramarine"),
      teal: appleImage("iphone-16-finish-select-202409-6-7inch-teal"),
      green: appleImage("iphone-16-finish-select-202409-6-7inch-teal"),
      pink: appleImage("iphone-16-finish-select-202409-6-7inch-pink")
    }
  },
  {
    pattern: /iphone\s+16(?!\s+(?:pro|plus))/i,
    defaultColor: "black",
    colors: {
      black: appleImage("iphone-16-finish-select-202409-6-1inch-black"),
      white: appleImage("iphone-16-finish-select-202409-6-1inch-white"),
      silver: appleImage("iphone-16-finish-select-202409-6-1inch-white"),
      blue: appleImage("iphone-16-finish-select-202409-6-1inch-ultramarine"),
      teal: appleImage("iphone-16-finish-select-202409-6-1inch-teal"),
      green: appleImage("iphone-16-finish-select-202409-6-1inch-teal"),
      pink: appleImage("iphone-16-finish-select-202409-6-1inch-pink")
    }
  },
  {
    pattern: /iphone\s+15\s+pro\s+max/i,
    defaultColor: "natural titanium",
    colors: {
      "natural titanium": appleImage("iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium"),
      "white titanium": appleImage("iphone-15-pro-finish-select-202309-6-7inch-whitetitanium"),
      white: appleImage("iphone-15-pro-finish-select-202309-6-7inch-whitetitanium"),
      silver: appleImage("iphone-15-pro-finish-select-202309-6-7inch-whitetitanium"),
      "black titanium": appleImage("iphone-15-pro-finish-select-202309-6-7inch-blacktitanium"),
      black: appleImage("iphone-15-pro-finish-select-202309-6-7inch-blacktitanium"),
      graphite: appleImage("iphone-15-pro-finish-select-202309-6-7inch-blacktitanium"),
      "blue titanium": appleImage("iphone-15-pro-finish-select-202309-6-7inch-bluetitanium"),
      blue: appleImage("iphone-15-pro-finish-select-202309-6-7inch-bluetitanium")
    }
  },
  {
    pattern: /iphone\s+15\s+pro(?!\s+max)/i,
    defaultColor: "natural titanium",
    colors: {
      "natural titanium": appleImage("iphone-15-pro-finish-select-202309-6-1inch-naturaltitanium"),
      "white titanium": appleImage("iphone-15-pro-finish-select-202309-6-1inch-whitetitanium"),
      white: appleImage("iphone-15-pro-finish-select-202309-6-1inch-whitetitanium"),
      silver: appleImage("iphone-15-pro-finish-select-202309-6-1inch-whitetitanium"),
      "black titanium": appleImage("iphone-15-pro-finish-select-202309-6-1inch-blacktitanium"),
      black: appleImage("iphone-15-pro-finish-select-202309-6-1inch-blacktitanium"),
      graphite: appleImage("iphone-15-pro-finish-select-202309-6-1inch-blacktitanium"),
      "blue titanium": appleImage("iphone-15-pro-finish-select-202309-6-1inch-bluetitanium"),
      blue: appleImage("iphone-15-pro-finish-select-202309-6-1inch-bluetitanium")
    }
  },
  {
    pattern: /iphone\s+15\s+plus/i,
    defaultColor: "black",
    colors: {
      black: appleImage("iphone-15-finish-select-202309-6-7inch-black"),
      blue: appleImage("iphone-15-finish-select-202309-6-7inch-blue"),
      green: appleImage("iphone-15-finish-select-202309-6-7inch-green"),
      pink: appleImage("iphone-15-finish-select-202309-6-7inch-pink"),
      yellow: appleImage("iphone-15-finish-select-202309-6-7inch-yellow"),
      white: appleImage("iphone-15-finish-select-202309-6-7inch-blue"),
      silver: appleImage("iphone-15-finish-select-202309-6-7inch-blue")
    }
  },
  {
    pattern: /iphone\s+15(?!\s+(?:pro|plus))/i,
    defaultColor: "black",
    colors: {
      black: appleImage("iphone-15-finish-select-202309-6-1inch-black"),
      blue: appleImage("iphone-15-finish-select-202309-6-1inch-blue"),
      green: appleImage("iphone-15-finish-select-202309-6-1inch-green"),
      pink: appleImage("iphone-15-finish-select-202309-6-1inch-pink"),
      yellow: appleImage("iphone-15-finish-select-202309-6-1inch-yellow"),
      white: appleImage("iphone-15-finish-select-202309-6-1inch-blue"),
      silver: appleImage("iphone-15-finish-select-202309-6-1inch-blue")
    }
  },
  {
    pattern: /iphone\s+14\s+pro\s+max/i,
    defaultColor: "black",
    colors: {
      "space black": appleImage("iphone-14-pro-finish-select-202209-6-7inch-spaceblack"),
      black: appleImage("iphone-14-pro-finish-select-202209-6-7inch-spaceblack"),
      graphite: appleImage("iphone-14-pro-finish-select-202209-6-7inch-spaceblack"),
      silver: appleImage("iphone-14-pro-finish-select-202209-6-7inch-silver"),
      white: appleImage("iphone-14-pro-finish-select-202209-6-7inch-silver"),
      gold: appleImage("iphone-14-pro-finish-select-202209-6-7inch-gold"),
      purple: appleImage("iphone-14-pro-finish-select-202209-6-7inch-deeppurple"),
      blue: appleImage("iphone-14-pro-finish-select-202209-6-7inch-deeppurple")
    }
  },
  {
    pattern: /iphone\s+14\s+pro(?!\s+max)/i,
    defaultColor: "black",
    colors: {
      "space black": appleImage("iphone-14-pro-finish-select-202209-6-1inch-spaceblack"),
      black: appleImage("iphone-14-pro-finish-select-202209-6-1inch-spaceblack"),
      graphite: appleImage("iphone-14-pro-finish-select-202209-6-1inch-spaceblack"),
      silver: appleImage("iphone-14-pro-finish-select-202209-6-1inch-silver"),
      white: appleImage("iphone-14-pro-finish-select-202209-6-1inch-silver"),
      gold: appleImage("iphone-14-pro-finish-select-202209-6-1inch-gold"),
      purple: appleImage("iphone-14-pro-finish-select-202209-6-1inch-deeppurple"),
      blue: appleImage("iphone-14-pro-finish-select-202209-6-1inch-deeppurple")
    }
  },
  {
    pattern: /iphone\s+14\s+plus/i,
    defaultColor: "starlight",
    colors: {
      white: appleImage("iphone-14-finish-select-202209-6-7inch-starlight"),
      silver: appleImage("iphone-14-finish-select-202209-6-7inch-starlight"),
      starlight: appleImage("iphone-14-finish-select-202209-6-7inch-starlight"),
      black: appleImage("iphone-14-finish-select-202209-6-7inch-midnight"),
      graphite: appleImage("iphone-14-finish-select-202209-6-7inch-midnight"),
      blue: appleImage("iphone-14-finish-select-202209-6-7inch-blue"),
      purple: appleImage("iphone-14-finish-select-202209-6-7inch-purple"),
      red: appleImage("iphone-14-finish-select-202209-6-7inch-product-red"),
      yellow: appleImage("iphone-14-finish-select-202209-6-7inch-yellow")
    }
  },
  {
    pattern: /iphone\s+14/i,
    defaultColor: "starlight",
    colors: {
      white: appleImage("iphone-14-finish-select-202209-6-1inch-starlight"),
      silver: appleImage("iphone-14-finish-select-202209-6-1inch-starlight"),
      starlight: appleImage("iphone-14-finish-select-202209-6-1inch-starlight"),
      black: appleImage("iphone-14-finish-select-202209-6-1inch-midnight"),
      graphite: appleImage("iphone-14-finish-select-202209-6-1inch-midnight"),
      blue: appleImage("iphone-14-finish-select-202209-6-1inch-blue"),
      purple: appleImage("iphone-14-finish-select-202209-6-1inch-purple"),
      red: appleImage("iphone-14-finish-select-202209-6-1inch-product-red"),
      yellow: appleImage("iphone-14-finish-select-202209-6-1inch-yellow")
    }
  },
  {
    pattern: /iphone\s+13\s+pro\s+max/i,
    defaultColor: "graphite",
    colors: {
      graphite: appleWikiImage("7/7d/IPhone_13_Pro_Max.png"),
      black: appleWikiImage("7/7d/IPhone_13_Pro_Max.png"),
      silver: appleWikiImage("7/7d/IPhone_13_Pro_Max.png"),
      white: appleWikiImage("7/7d/IPhone_13_Pro_Max.png"),
      blue: appleWikiImage("7/7d/IPhone_13_Pro_Max.png"),
      "sierra blue": appleWikiImage("7/7d/IPhone_13_Pro_Max.png"),
      gold: appleWikiImage("7/7d/IPhone_13_Pro_Max.png"),
      green: appleWikiImage("7/7d/IPhone_13_Pro_Max.png")
    }
  },
  {
    pattern: /iphone\s+13\s+pro(?!\s+max)/i,
    defaultColor: "graphite",
    colors: {
      graphite: appleWikiImage("thumb/4/4e/IPhone_13_Pro.png/640px-IPhone_13_Pro.png"),
      black: appleWikiImage("thumb/4/4e/IPhone_13_Pro.png/640px-IPhone_13_Pro.png"),
      silver: appleWikiImage("thumb/4/4e/IPhone_13_Pro.png/640px-IPhone_13_Pro.png"),
      white: appleWikiImage("thumb/4/4e/IPhone_13_Pro.png/640px-IPhone_13_Pro.png"),
      blue: appleWikiImage("thumb/4/4e/IPhone_13_Pro.png/640px-IPhone_13_Pro.png"),
      "sierra blue": appleWikiImage("thumb/4/4e/IPhone_13_Pro.png/640px-IPhone_13_Pro.png"),
      gold: appleWikiImage("thumb/4/4e/IPhone_13_Pro.png/640px-IPhone_13_Pro.png"),
      green: appleWikiImage("thumb/4/4e/IPhone_13_Pro.png/640px-IPhone_13_Pro.png")
    }
  },
  {
    pattern: /iphone\s+13(?!\s+pro)/i,
    defaultColor: "black",
    colors: {
      black: appleImage("iphone-13-finish-select-202207-6-1inch-midnight"),
      midnight: appleImage("iphone-13-finish-select-202207-6-1inch-midnight"),
      white: appleImage("iphone-13-finish-select-202207-6-1inch-starlight"),
      silver: appleImage("iphone-13-finish-select-202207-6-1inch-starlight"),
      starlight: appleImage("iphone-13-finish-select-202207-6-1inch-starlight"),
      blue: appleImage("iphone-13-finish-select-202207-6-1inch-blue"),
      red: appleImage("iphone-13-finish-select-202207-6-1inch-product-red"),
      pink: appleImage("iphone-13-finish-select-202207-6-1inch-pink"),
      green: appleImage("iphone-13-finish-select-202207-6-1inch-green")
    }
  },
  {
    pattern: /iphone\s+se/i,
    defaultColor: "black",
    colors: {
      black: appleImage("iphone-se-finish-select-202207-midnight"),
      midnight: appleImage("iphone-se-finish-select-202207-midnight"),
      white: appleImage("iphone-se-finish-select-202207-starlight"),
      silver: appleImage("iphone-se-finish-select-202207-starlight"),
      starlight: appleImage("iphone-se-finish-select-202207-starlight"),
      red: appleImage("iphone-se-finish-select-202207-product-red"),
      blue: appleImage("iphone-se-finish-select-202207-midnight")
    }
  },
  {
    pattern: /galaxy\s+s24\s+ultra/i,
    defaultColor: "silver",
    colors: {
      silver: samsungImage("p6pim/es/2401/gallery/es-galaxy-s24-s928-491123-sm-s928bztgeub-539444273"),
      gray: samsungImage("p6pim/es/2401/gallery/es-galaxy-s24-s928-491123-sm-s928bztgeub-539444273"),
      black: samsungImage("p6pim/no/2401/gallery/no-galaxy-s24-s928-sm-s928bzkgeub-thumb-539448193"),
      graphite: samsungImage("p6pim/no/2401/gallery/no-galaxy-s24-s928-sm-s928bzkgeub-thumb-539448193"),
      blue: samsungImage("p6pim/es/2401/gallery/es-galaxy-s24-s928-sm-s928blbgeub-539442825"),
      green: samsungImage("p6pim/es/2401/gallery/es-galaxy-s24-s928-sm-s928blbgeub-539442825"),
      orange: samsungImage("p6pim/es/2401/gallery/es-galaxy-s24-s928-sm-s928blbgeub-539442825")
    }
  },
  {
    pattern: /galaxy\s+s24/i,
    defaultColor: "silver",
    colors: {
      silver: samsungImage("p6pim/es/sm-s921bzageub/gallery/es-galaxy-s24-s921-sm-s921bzageub-thumb-539572937"),
      gray: samsungImage("p6pim/es/sm-s921bzageub/gallery/es-galaxy-s24-s921-sm-s921bzageub-thumb-539572937"),
      black: samsungImage("p6pim/es/sm-s921bzkgeub/gallery/es-galaxy-s24-s921-sm-s921bzkgeub-thumb-539572936"),
      blue: samsungImage("p6pim/es/sm-s921blbgeub/gallery/es-galaxy-s24-s921-sm-s921blbgeub-thumb-539572938")
    }
  },
  {
    pattern: /xiaomi\s+14/i,
    defaultColor: "black",
    colors: {
      black: xiaomiImage("appmifile/products/xiaomi-14/section01-phone-black.png"),
      white: xiaomiImage("appmifile/products/xiaomi-14/section01-phone-white.png"),
      green: xiaomiImage("appmifile/products/xiaomi-14/section01-phone-green.png"),
      blue: xiaomiImage("appmifile/products/xiaomi-14/section01-phone-green.png"),
      silver: xiaomiImage("appmifile/products/xiaomi-14/section01-phone-white.png")
    }
  }
];

function normalize(text = "") {
  return text.replace(IGNORED_NAME_PARTS, " ").replace(/\s+/g, " ").trim().toLowerCase();
}

function findImageConfig(product) {
  const source = `${product?.brand || ""} ${product?.name || ""}`;
  return PRODUCT_IMAGES.find((config) => config.pattern.test(source));
}

function findColorKey(name, colors) {
  const normalized = normalize(name);
  return Object.keys(colors)
    .sort((first, second) => second.length - first.length)
    .find((color) => normalized.includes(color));
}

export function getProductImageUrl(product) {
  const config = findImageConfig(product);
  if (!config) return product?.imageUrl;

  const colorKey = findColorKey(product?.name, config.colors) || config.defaultColor;
  return config.colors[colorKey] || Object.values(config.colors)[0] || product?.imageUrl;
}

export function useProductImageFallback(event) {
  const fallback = event.currentTarget.dataset.fallbackSrc;
  if (fallback && event.currentTarget.src !== fallback) {
    event.currentTarget.src = fallback;
  }
}
