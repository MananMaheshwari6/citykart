import type { City, Product, Shop } from "../types";

export const cities: City[] = [
  { id: "mumbai", name: "Mumbai", state: "Maharashtra", image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80", shopCount: 42 },
  { id: "delhi", name: "Delhi", state: "Delhi", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80", shopCount: 38 },
  { id: "bangalore", name: "Bangalore", state: "Karnataka", image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&q=80", shopCount: 35 },
  { id: "jaipur", name: "Jaipur", state: "Rajasthan", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80", shopCount: 28 },
  { id: "kolkata", name: "Kolkata", state: "West Bengal", image: "https://images.unsplash.com/photo-1558431382-27e303142255?w=600&q=80", shopCount: 31 },
  { id: "chennai", name: "Chennai", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80", shopCount: 25 },
];

export const shops: Shop[] = [
  { id: "shop1", name: "Urban Threads", cityId: "mumbai", description: "Trendy fashion and accessories", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80", rating: 4.5, vendorId: "v1" },
  { id: "shop2", name: "Spice Route", cityId: "mumbai", description: "Organic spices and groceries", image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&q=80", rating: 4.8, vendorId: "v2" },
  { id: "shop3", name: "TechHub", cityId: "bangalore", description: "Latest gadgets and electronics", image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&q=80", rating: 4.3, vendorId: "v3" },
  { id: "shop4", name: "Craft Corner", cityId: "jaipur", description: "Handmade crafts and décor", image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80", rating: 4.7, vendorId: "v4" },
  { id: "shop5", name: "Book Barn", cityId: "delhi", description: "Books, stationery, and gifts", image: "https://images.unsplash.com/photo-1526243741027-444d633d7365?w=600&q=80", rating: 4.6, vendorId: "v5" },
  { id: "shop6", name: "Green Grocer", cityId: "kolkata", description: "Farm-fresh produce daily", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80", rating: 4.4, vendorId: "v6" },
];

export const products: Product[] = [
  { id: "p1", name: "Cotton Kurta Set", description: "Handwoven cotton kurta with intricate block print patterns. Perfect for casual and festive occasions.", price: 1499, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80", category: "Fashion", shopId: "shop1", cityId: "mumbai", rating: 4.5, inStock: true },
  { id: "p2", name: "Kashmiri Saffron", description: "Premium Grade-1 Kashmiri saffron, hand-picked and sun-dried for the finest flavor.", price: 899, image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80", category: "Groceries", shopId: "shop2", cityId: "mumbai", rating: 4.9, inStock: true },
  { id: "p3", name: "Wireless Earbuds Pro", description: "Active noise cancellation, 30-hour battery life, and crystal-clear audio quality.", price: 3999, image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=600&q=80", category: "Electronics", shopId: "shop3", cityId: "bangalore", rating: 4.3, inStock: true },
  { id: "p4", name: "Blue Pottery Vase", description: "Authentic Jaipur blue pottery vase, handcrafted by local artisans using traditional techniques.", price: 2200, image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&q=80", category: "Home Decor", shopId: "shop4", cityId: "jaipur", rating: 4.8, inStock: true },
  { id: "p5", name: "Leather Journal", description: "Hand-stitched leather journal with 200 pages of premium recycled paper.", price: 650, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80", category: "Stationery", shopId: "shop5", cityId: "delhi", rating: 4.6, inStock: true },
  { id: "p6", name: "Organic Honey", description: "Raw, unprocessed honey from the Sundarbans. Rich in antioxidants and natural enzymes.", price: 450, image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80", category: "Groceries", shopId: "shop6", cityId: "kolkata", rating: 4.7, inStock: true },
  { id: "p7", name: "Silk Scarf", description: "Pure Banarasi silk scarf with gold zari work. An exquisite accessory for any outfit.", price: 1899, image: "https://images.unsplash.com/photo-1601924921557-45e3c8e35bff?w=600&q=80", category: "Fashion", shopId: "shop1", cityId: "mumbai", rating: 4.4, inStock: true },
  { id: "p8", name: "Smart Watch", description: "Fitness tracking, heart rate monitor, and notifications on your wrist.", price: 5499, image: "https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=600&q=80", category: "Electronics", shopId: "shop3", cityId: "bangalore", rating: 4.2, inStock: false },
  { id: "p9", name: "Rajasthani Puppet Set", description: "Colorful handmade string puppets depicting traditional Rajasthani characters.", price: 1100, image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80", category: "Home Decor", shopId: "shop4", cityId: "jaipur", rating: 4.6, inStock: true },
  { id: "p10", name: "Darjeeling Tea Collection", description: "Premium first-flush Darjeeling tea in a beautifully crafted gift box.", price: 780, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80", category: "Groceries", shopId: "shop6", cityId: "kolkata", rating: 4.8, inStock: true },
  { id: "p11", name: "Canvas Tote Bag", description: "Eco-friendly canvas tote with hand-painted Indian art motifs.", price: 550, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80", category: "Fashion", shopId: "shop1", cityId: "mumbai", rating: 4.3, inStock: true },
  { id: "p12", name: "Portable Speaker", description: "Waterproof Bluetooth speaker with 360° surround sound and 12-hour battery.", price: 2799, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80", category: "Electronics", shopId: "shop3", cityId: "bangalore", rating: 4.5, inStock: true },
];

