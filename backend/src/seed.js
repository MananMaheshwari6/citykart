import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDb } from "./config/db.js";
import { User } from "./models/User.js";
import { City } from "./models/City.js";
import { Shop } from "./models/Shop.js";
import { Product } from "./models/Product.js";
import { Cart } from "./models/Cart.js";
import { Order } from "./models/Order.js";

const citiesData = [
  { _id: "dehradun", name: "Dehradun", state: "Uttarakhand", image: "", shopCount: 0 },
  { _id: "mumbai", name: "Mumbai", state: "Maharashtra", image: "", shopCount: 0 },
  { _id: "delhi", name: "Delhi", state: "Delhi", image: "", shopCount: 0 },
  { _id: "bangalore", name: "Bangalore", state: "Karnataka", image: "", shopCount: 0 },
  { _id: "jaipur", name: "Jaipur", state: "Rajasthan", image: "", shopCount: 0 },
  { _id: "kolkata", name: "Kolkata", state: "West Bengal", image: "", shopCount: 0 },
];

const IMG = (id) => `https://images.unsplash.com/${id}?w=600&q=80`;

const dehradunShopsData = [
  {
    _id: "shop_ddn_1",
    name: "Rajpur Road Organics",
    cityId: "dehradun",
    description: "Fresh organic produce sourced directly from Garhwal farms",
    image: IMG("photo-1542838132-92c53300491e"),
    rating: 4.7,
    vendorIndex: 0,
  },
  {
    _id: "shop_ddn_2",
    name: "Sahastradhara Dairy",
    cityId: "dehradun",
    description: "Pure dairy products from our own buffalo and cow farm",
    image: IMG("photo-1550583724-b2692b85b150"),
    rating: 4.8,
    vendorIndex: 1,
  },
  {
    _id: "shop_ddn_3",
    name: "Astley Hall Bakehouse",
    cityId: "dehradun",
    description: "Artisan breads and pastries baked fresh every morning in Dehradun",
    image: IMG("photo-1568471173242-461f0a730452"),
    rating: 4.6,
    vendorIndex: 2,
  },
  {
    _id: "shop_ddn_4",
    name: "Paltan Bazaar Handicrafts",
    cityId: "dehradun",
    description: "Authentic Garhwali handicrafts and traditional Uttarakhand art",
    image: IMG("photo-1513519245088-0e12902e5a38"),
    rating: 4.5,
    vendorIndex: 3,
  },
  {
    _id: "shop_ddn_5",
    name: "Clock Tower Electronics",
    cityId: "dehradun",
    description: "Mobile phones, accessories and repair services near Ghanta Ghar",
    image: IMG("photo-1531297484001-80022131f5a1"),
    rating: 4.3,
    vendorIndex: 4,
  },
  {
    _id: "shop_ddn_6",
    name: "Doon Valley Clothing",
    cityId: "dehradun",
    description: "Traditional and modern clothing for the hills lifestyle",
    image: IMG("photo-1441986300917-64674bd600d8"),
    rating: 4.4,
    vendorIndex: 5,
  },
  {
    _id: "shop_ddn_7",
    name: "Garhwal Tea & Spices",
    cityId: "dehradun",
    description: "Premium Garhwal teas, local honey and mountain spices",
    image: IMG("photo-1556679343-c7306c1976bc"),
    rating: 4.7,
    vendorIndex: 4,
  },
  {
    _id: "shop_ddn_8",
    name: "Mussoorie Diversion Flowers",
    cityId: "dehradun",
    description: "Fresh flowers and plants sourced from the Mussoorie hills",
    image: IMG("photo-1561181286-d3fee7d55364"),
    rating: 4.6,
    vendorIndex: 5,
  },
];

const otherShopsData = [
  {
    _id: "shop_mum_1",
    name: "Mumbai General Store",
    cityId: "mumbai",
    description: "Everyday essentials from the streets of Mumbai",
    image: IMG("photo-1604719312566-8912e9227c6a"),
    rating: 4.3,
    vendorIndex: 0,
  },
  {
    _id: "shop_del_1",
    name: "Delhi Daily Essentials",
    cityId: "delhi",
    description: "Stationery, groceries and home goods for the capital",
    image: IMG("photo-1526243741027-444d633d7365"),
    rating: 4.4,
    vendorIndex: 1,
  },
  {
    _id: "shop_blr_1",
    name: "Bangalore Tech Bazaar",
    cityId: "bangalore",
    description: "Gadgets and accessories from India's tech hub",
    image: IMG("photo-1531297484001-80022131f5a1"),
    rating: 4.2,
    vendorIndex: 2,
  },
  {
    _id: "shop_jpr_1",
    name: "Jaipur Handicrafts",
    cityId: "jaipur",
    description: "Block prints, marble and mojari from the Pink City",
    image: IMG("photo-1513519245088-0e12902e5a38"),
    rating: 4.7,
    vendorIndex: 3,
  },
  {
    _id: "shop_kol_1",
    name: "Kolkata Sweets & Tea",
    cityId: "kolkata",
    description: "Bengali sweets and Darjeeling teas, fresh from the source",
    image: IMG("photo-1556679343-c7306c1976bc"),
    rating: 4.6,
    vendorIndex: 4,
  },
];

const dehradunProductsData = [
  // Shop 1 — Rajpur Road Organics (8 products)
  { name: "Fresh Litchi", price: 120, category: "Fruits", description: "Dehradun's famous seasonal litchis, picked fresh from Rajpur orchards. Sweet, juicy, and pesticide-free.", image: IMG("photo-1601493700631-2b16ec4b4716"), rating: 4.8, shopId: "shop_ddn_1" },
  { name: "Organic Basmati Rice (5kg)", price: 380, category: "Grains", description: "Aromatic long-grain basmati grown in the Doon Valley foothills.", image: IMG("photo-1586201375761-83865001e31c"), rating: 4.7, shopId: "shop_ddn_1" },
  { name: "Fresh Ginger (500g)", price: 60, category: "Vegetables", description: "Pungent and aromatic ginger from Garhwal farms.", image: IMG("photo-1599909533631-1eecf7d0fd5f"), rating: 4.5, shopId: "shop_ddn_1" },
  { name: "Doon Valley Tomatoes (1kg)", price: 45, category: "Vegetables", description: "Firm, ripe tomatoes grown in the fertile Doon Valley soil.", image: IMG("photo-1592924357228-91a4daadcfea"), rating: 4.4, shopId: "shop_ddn_1" },
  { name: "Organic Turmeric Powder (250g)", price: 85, category: "Spices", description: "Stone-ground turmeric from local Garhwali farms, deep yellow and highly potent.", image: IMG("photo-1615484477778-ca3b77940c25"), rating: 4.8, shopId: "shop_ddn_1" },
  { name: "Fresh Spinach (500g)", price: 35, category: "Vegetables", description: "Crisp, dark-leafed spinach harvested this morning.", image: IMG("photo-1576045057995-568f588f82fb"), rating: 4.6, shopId: "shop_ddn_1" },
  { name: "Seasonal Mixed Vegetables (2kg)", price: 110, category: "Vegetables", description: "A curated mix of the day's freshest produce — changes with the season.", image: IMG("photo-1540420773420-3366772f4999"), rating: 4.5, shopId: "shop_ddn_1" },
  { name: "Local Honey (500ml)", price: 220, category: "Organic", description: "Raw wildflower honey from Garhwal mountain beehives. Unfiltered and unheated.", image: IMG("photo-1587049352846-4a222e784d38"), rating: 4.9, shopId: "shop_ddn_1" },

  // Shop 2 — Sahastradhara Dairy (7 products)
  { name: "Fresh Buffalo Milk (1L)", price: 65, category: "Dairy", description: "Rich, creamy buffalo milk delivered fresh from Sahastradhara farms every morning.", image: IMG("photo-1550583724-b2692b85b150"), rating: 4.8, shopId: "shop_ddn_2" },
  { name: "Homemade Desi Ghee (500ml)", price: 320, category: "Dairy", description: "Slow-churned ghee from grass-fed cows. Nutty aroma, golden colour.", image: IMG("photo-1628788902440-ddc28e636f8b"), rating: 4.9, shopId: "shop_ddn_2" },
  { name: "Fresh Paneer (500g)", price: 140, category: "Dairy", description: "Soft, crumbly paneer made fresh daily. No preservatives.", image: IMG("photo-1631452180519-c014fe946bc7"), rating: 4.7, shopId: "shop_ddn_2" },
  { name: "Mango Lassi (500ml)", price: 55, category: "Dairy", description: "Thick homemade lassi blended with Alphonso mango. Seasonal.", image: IMG("photo-1571805341302-f857308690e3"), rating: 4.6, shopId: "shop_ddn_2" },
  { name: "Set Dahi (1kg)", price: 80, category: "Dairy", description: "Thick, creamy curd set in traditional earthen pots.", image: IMG("photo-1571212058849-6cdc4dcec7e9"), rating: 4.7, shopId: "shop_ddn_2" },
  { name: "Butter (200g)", price: 95, category: "Dairy", description: "White butter churned fresh from morning milk. Mildly salted.", image: IMG("photo-1589985270826-4b7bb135bc9d"), rating: 4.5, shopId: "shop_ddn_2" },
  { name: "Shrikhand (250g)", price: 120, category: "Dairy", description: "Strained yoghurt sweetened with sugar and cardamom. A Doon valley favourite.", image: IMG("photo-1576506295286-5cda18df43e7"), rating: 4.6, shopId: "shop_ddn_2" },

  // Shop 3 — Astley Hall Bakehouse (7 products)
  { name: "Whole Wheat Sourdough", price: 85, category: "Bakery", description: "72-hour fermented sourdough with a crispy crust. Baked at 5am daily.", image: IMG("photo-1568471173242-461f0a730452"), rating: 4.8, shopId: "shop_ddn_3" },
  { name: "Plum Cake (500g)", price: 280, category: "Bakery", description: "The Dehradun classic — dense, rum-soaked fruit cake with candied peel.", image: IMG("photo-1571115177098-24ec42ed204d"), rating: 4.9, shopId: "shop_ddn_3" },
  { name: "Chocolate Walnut Brownies (6 pcs)", price: 180, category: "Bakery", description: "Fudgy dark chocolate brownies loaded with Garhwali walnuts.", image: IMG("photo-1606313564200-e75d5e30476c"), rating: 4.8, shopId: "shop_ddn_3" },
  { name: "Butter Croissants (2 pcs)", price: 90, category: "Bakery", description: "Flaky, buttery French-style croissants, laminated over two days.", image: IMG("photo-1555507036-ab1f4038808a"), rating: 4.7, shopId: "shop_ddn_3" },
  { name: "Banana Walnut Loaf", price: 160, category: "Bakery", description: "Moist banana bread with local Garhwali walnuts and a hint of cinnamon.", image: IMG("photo-1583395145045-30ddff6f3635"), rating: 4.6, shopId: "shop_ddn_3" },
  { name: "Multigrain Sandwich Bread", price: 65, category: "Bakery", description: "Soft, nutritious sandwich loaf with sunflower seeds, oats, and flax.", image: IMG("photo-1509440159596-0249088772ff"), rating: 4.5, shopId: "shop_ddn_3" },
  { name: "Almond Biscotti (200g)", price: 140, category: "Bakery", description: "Twice-baked Italian-style biscotti with roasted almonds. Perfect with tea.", image: IMG("photo-1608885898957-91da8a0d3a85"), rating: 4.6, shopId: "shop_ddn_3" },

  // Shop 4 — Paltan Bazaar Handicrafts (7 products)
  { name: "Handwoven Woollen Shawl", price: 850, category: "Handicrafts", description: "Traditional Garhwali shawl handwoven by artisans in Srinagar (Garhwal). Warm and lightweight.", image: IMG("photo-1601924994987-69e26d50dc26"), rating: 4.8, shopId: "shop_ddn_4" },
  { name: "Copper Water Pot (Lota)", price: 420, category: "Handicrafts", description: "Hand-hammered traditional copper pot. Keeps water naturally cool and pure.", image: IMG("photo-1581932811810-9a5dee6c84a1"), rating: 4.7, shopId: "shop_ddn_4" },
  { name: "Ringal Bamboo Basket Set", price: 380, category: "Handicrafts", description: "Set of 3 nesting baskets woven from Ringal bamboo — a Garhwali forest craft tradition.", image: IMG("photo-1604335078846-c5cf03bd0c1c"), rating: 4.6, shopId: "shop_ddn_4" },
  { name: "Garhwali Folk Painting (Framed)", price: 1200, category: "Handicrafts", description: "Original hand-painted Garhwali folk art on handmade paper. Each piece is unique.", image: IMG("photo-1582564286939-400a311013a1"), rating: 4.9, shopId: "shop_ddn_4" },
  { name: "Clay Diyas (Set of 12)", price: 120, category: "Handicrafts", description: "Handmade terracotta diyas from local potters. Perfect for Diwali and daily puja.", image: IMG("photo-1604423787919-89f0a8de50b8"), rating: 4.7, shopId: "shop_ddn_4" },
  { name: "Aipan Wall Art (A3)", price: 650, category: "Handicrafts", description: "Traditional Kumaoni Aipan folk pattern on handmade paper. A Uttarakhand heritage art form.", image: IMG("photo-1578749556568-bc2c40e68b61"), rating: 4.8, shopId: "shop_ddn_4" },
  { name: "Woollen Pahadi Cap", price: 240, category: "Handicrafts", description: "Handknitted Garhwali topi in natural wool. One size fits all.", image: IMG("photo-1576566588028-4147f3842f27"), rating: 4.5, shopId: "shop_ddn_4" },

  // Shop 5 — Clock Tower Electronics (6 products)
  { name: "Boat Airdopes 141 Earbuds", price: 899, category: "Electronics", description: "Wireless earbuds with 42-hour battery, IPX4 water resistance.", image: IMG("photo-1590658268037-6bf12f032f55"), rating: 4.4, shopId: "shop_ddn_5" },
  { name: "USB-C Fast Charger (65W)", price: 649, category: "Electronics", description: "GaN fast charger compatible with laptops, phones, and tablets.", image: IMG("photo-1583394838336-acd977736f90"), rating: 4.5, shopId: "shop_ddn_5" },
  { name: "Phone Stand & Holder", price: 299, category: "Electronics", description: "Adjustable aluminium phone stand. Perfect for video calls and studying.", image: IMG("photo-1574027542338-98e25d39434f"), rating: 4.3, shopId: "shop_ddn_5" },
  { name: "Screen Protector (Universal)", price: 149, category: "Electronics", description: "9H tempered glass screen protector. Fits most smartphone sizes.", image: IMG("photo-1592899677977-9c10ca588bbd"), rating: 4.2, shopId: "shop_ddn_5" },
  { name: "Power Bank 10000mAh", price: 799, category: "Electronics", description: "Slim 10000mAh power bank with dual USB output and LED indicator.", image: IMG("photo-1609692814858-f7cd2f0afa4f"), rating: 4.5, shopId: "shop_ddn_5" },
  { name: "Laptop Sleeve (15 inch)", price: 449, category: "Electronics", description: "Neoprene padded laptop sleeve with accessory pocket. Water-resistant.", image: IMG("photo-1547949003-9792a18a2601"), rating: 4.4, shopId: "shop_ddn_5" },

  // Shop 6 — Doon Valley Clothing (5 products)
  { name: "Handloom Kurta (Men)", price: 680, category: "Clothing", description: "Handloom cotton kurta in natural earthy tones. Comfortable for Doon's climate.", image: IMG("photo-1594938298603-c8148c4dae35"), rating: 4.6, shopId: "shop_ddn_6" },
  { name: "Woollen Jacket (Unisex)", price: 1400, category: "Clothing", description: "Medium-weight wool jacket for Dehradun winters. Traditional cut, modern fit.", image: IMG("photo-1551488831-00ddcb6c6bd3"), rating: 4.7, shopId: "shop_ddn_6" },
  { name: "Pahadi Printed Tote Bag", price: 320, category: "Clothing", description: "Canvas tote with traditional Garhwali mountain print. Eco-friendly and sturdy.", image: IMG("photo-1544816155-12df9643f363"), rating: 4.4, shopId: "shop_ddn_6" },
  { name: "Cotton Salwar Suit (Women)", price: 950, category: "Clothing", description: "Lightweight cotton set in pastel hill-inspired colours. Locally stitched.", image: IMG("photo-1610030469983-98e550d6193c"), rating: 4.5, shopId: "shop_ddn_6" },
  { name: "Kids Woollen Sweater", price: 480, category: "Clothing", description: "Hand-knitted sweater for children in bright mountain colours.", image: IMG("photo-1518831959646-742c3a14ebf7"), rating: 4.6, shopId: "shop_ddn_6" },

  // Shop 7 — Garhwal Tea & Spices (5 products)
  { name: "Garhwal Green Tea (100g)", price: 180, category: "Organic", description: "Single-estate green tea from Pauri Garhwal hills. Light, grassy, and refreshing.", image: IMG("photo-1556679343-c7306c1976bc"), rating: 4.8, shopId: "shop_ddn_7" },
  { name: "Buransh (Rhododendron) Juice (500ml)", price: 150, category: "Organic", description: "Seasonal rhododendron flower juice — a Uttarakhand speciality. Naturally sweet-tart.", image: IMG("photo-1622597467836-f3285f2131b8"), rating: 4.7, shopId: "shop_ddn_7" },
  { name: "Mountain Honey Gift Box", price: 450, category: "Organic", description: "Two 250ml jars of wild Garhwal honey — wildflower and ajwain blossom.", image: IMG("photo-1587049352846-4a222e784d38"), rating: 4.9, shopId: "shop_ddn_7" },
  { name: "Jambu & Timur Spice Mix (100g)", price: 120, category: "Spices", description: "Traditional Garhwali mountain spice blend. Aromatic, earthy, and unique to the region.", image: IMG("photo-1596040033229-a9821ebd058d"), rating: 4.8, shopId: "shop_ddn_7" },
  { name: "Uttarakhand Pahadi Dal Mix (500g)", price: 95, category: "Organic", description: "Mixed local lentils including Gahat, Bhatt, and Tor — nutrient-rich and flavourful.", image: IMG("photo-1567306226416-28f0efdc88ce"), rating: 4.6, shopId: "shop_ddn_7" },

  // Shop 8 — Mussoorie Diversion Flowers (5 products)
  { name: "Fresh Rose Bouquet (12 stems)", price: 180, category: "Flowers", description: "Fragrant fresh-cut roses from Mussoorie gardens. Available in red, pink, and white.", image: IMG("photo-1561181286-d3fee7d55364"), rating: 4.7, shopId: "shop_ddn_8" },
  { name: "Indoor Succulent Set (3 pots)", price: 350, category: "Plants", description: "Low-maintenance succulent trio in terracotta pots. Perfect for desks and windowsills.", image: IMG("photo-1459411552884-841db9b3cc2a"), rating: 4.8, shopId: "shop_ddn_8" },
  { name: "Marigold Plant (Flowering)", price: 80, category: "Plants", description: "Bright marigold in a 6-inch pot. Excellent for balconies and puja.", image: IMG("photo-1597848212624-a19eb35e2651"), rating: 4.5, shopId: "shop_ddn_8" },
  { name: "Money Plant Cutting (Set of 3)", price: 120, category: "Plants", description: "Healthy pothos cuttings ready to root. The classic lucky plant.", image: IMG("photo-1521334884684-d80222895322"), rating: 4.6, shopId: "shop_ddn_8" },
  { name: "Seasonal Flower Arrangement", price: 280, category: "Flowers", description: "Hand-arranged bouquet of whatever is blooming this week in the Mussoorie hills.", image: IMG("photo-1490578474895-699cd4e2cf59"), rating: 4.7, shopId: "shop_ddn_8" },
];

const otherCitiesProductsData = [
  // Mumbai — shop_mum_1 (3 products, vendorIndex 0)
  { _id: "p_mum_1", name: "Cotton Tote Bag", price: 250, category: "Fashion", description: "Eco-friendly canvas tote with hand-painted Mumbai skyline.", image: IMG("photo-1544816155-12df9643f363"), shopId: "shop_mum_1", cityId: "mumbai", rating: 4.3, vendorIndex: 0 },
  { _id: "p_mum_2", name: "Banana Chips (250g)", price: 80, category: "Snacks", description: "Crispy kerala-style banana chips fried in coconut oil.", image: IMG("photo-1505740420928-5e560c06d30e"), shopId: "shop_mum_1", cityId: "mumbai", rating: 4.4, vendorIndex: 0 },
  { _id: "p_mum_3", name: "Mumbai Pav Bread (6 pcs)", price: 60, category: "Bakery", description: "Soft, fluffy pav buns — the bedrock of vada pav and pav bhaji.", image: IMG("photo-1509440159596-0249088772ff"), shopId: "shop_mum_1", cityId: "mumbai", rating: 4.5, vendorIndex: 0 },

  // Delhi — shop_del_1 (3 products, vendorIndex 1)
  { _id: "p_del_1", name: "Notebook Set (3 pcs)", price: 180, category: "Stationery", description: "A5 ruled notebooks with hardcover binding. Recycled paper.", image: IMG("photo-1544816155-12df9643f363"), shopId: "shop_del_1", cityId: "delhi", rating: 4.4, vendorIndex: 1 },
  { _id: "p_del_2", name: "Premium Tea (250g)", price: 220, category: "Groceries", description: "Strong, malty Assam CTC tea — Delhi's favourite chai base.", image: IMG("photo-1556679343-c7306c1976bc"), shopId: "shop_del_1", cityId: "delhi", rating: 4.6, vendorIndex: 1 },
  { _id: "p_del_3", name: "Wooden Coaster Set (6 pcs)", price: 350, category: "Home Decor", description: "Hand-carved sheesham wood coasters with traditional patterns.", image: IMG("photo-1513519245088-0e12902e5a38"), shopId: "shop_del_1", cityId: "delhi", rating: 4.5, vendorIndex: 1 },

  // Bangalore — shop_blr_1 (3 products, vendorIndex 2)
  { _id: "p_blr_1", name: "Wireless Mouse", price: 599, category: "Electronics", description: "Ergonomic wireless mouse with adjustable DPI and silent clicks.", image: IMG("photo-1590658268037-6bf12f032f55"), shopId: "shop_blr_1", cityId: "bangalore", rating: 4.3, vendorIndex: 2 },
  { _id: "p_blr_2", name: "USB Hub (4-port)", price: 449, category: "Electronics", description: "Aluminium 4-port USB 3.0 hub with individual power switches.", image: IMG("photo-1583394838336-acd977736f90"), shopId: "shop_blr_1", cityId: "bangalore", rating: 4.4, vendorIndex: 2 },
  { _id: "p_blr_3", name: "Bluetooth Speaker", price: 1499, category: "Electronics", description: "Portable Bluetooth speaker with 12-hour battery and IPX5 waterproofing.", image: IMG("photo-1608043152269-423dbba4e7e1"), shopId: "shop_blr_1", cityId: "bangalore", rating: 4.5, vendorIndex: 2 },

  // Jaipur — shop_jpr_1 (3 products, vendorIndex 3)
  { _id: "p_jpr_1", name: "Block Print Cushion Cover", price: 320, category: "Handicrafts", description: "Hand-block-printed cotton cushion cover from Sanganer artisans.", image: IMG("photo-1513519245088-0e12902e5a38"), shopId: "shop_jpr_1", cityId: "jaipur", rating: 4.7, vendorIndex: 3 },
  { _id: "p_jpr_2", name: "Marble Coaster Set (4 pcs)", price: 480, category: "Handicrafts", description: "Polished Makrana marble coasters with inlaid floral patterns.", image: IMG("photo-1578749556568-bc2c40e68b61"), shopId: "shop_jpr_1", cityId: "jaipur", rating: 4.6, vendorIndex: 3 },
  { _id: "p_jpr_3", name: "Mojari Slippers (Pair)", price: 650, category: "Clothing", description: "Handcrafted leather mojari with traditional Rajasthani embroidery.", image: IMG("photo-1558618666-fcd25c85f82e"), shopId: "shop_jpr_1", cityId: "jaipur", rating: 4.5, vendorIndex: 3 },

  // Kolkata — shop_kol_1 (3 products, vendorIndex 4)
  { _id: "p_kol_1", name: "Rosogolla Box (12 pcs)", price: 320, category: "Sweets", description: "Soft, spongy syrup-soaked rosogolla from a traditional Bengali sweet shop.", image: IMG("photo-1571115177098-24ec42ed204d"), shopId: "shop_kol_1", cityId: "kolkata", rating: 4.8, vendorIndex: 4 },
  { _id: "p_kol_2", name: "Darjeeling Tea (250g)", price: 280, category: "Organic", description: "Premium first-flush Darjeeling — light, floral, and aromatic.", image: IMG("photo-1556679343-c7306c1976bc"), shopId: "shop_kol_1", cityId: "kolkata", rating: 4.7, vendorIndex: 4 },
  { _id: "p_kol_3", name: "Mishti Doi (500g)", price: 90, category: "Dairy", description: "Sweetened, caramelised yoghurt set in traditional terracotta pots.", image: IMG("photo-1571212058849-6cdc4dcec7e9"), shopId: "shop_kol_1", cityId: "kolkata", rating: 4.6, vendorIndex: 4 },
];

async function seed() {
  await connectDb();
  const hash = await bcrypt.hash("demo123", 10);

  await Order.deleteMany({});
  await Cart.deleteMany({});
  await Product.deleteMany({});
  await Shop.deleteMany({});
  await City.deleteMany({});
  await User.deleteMany({});

  await City.insertMany(citiesData);

  const vendorUsers = [];
  for (let i = 0; i < 6; i += 1) {
    const u = await User.create({
      name: `Demo Vendor ${i + 1}`,
      email: `vendor${i + 1}@citykart.demo`,
      passwordHash: hash,
      role: "vendor",
    });
    vendorUsers.push(u);
  }

  await User.create({
    name: "Demo Buyer",
    email: "buyer@citykart.demo",
    passwordHash: hash,
    role: "buyer",
  });

  const allShops = [...dehradunShopsData, ...otherShopsData].map((s) => {
    const { vendorIndex, ...rest } = s;
    return { ...rest, vendorId: vendorUsers[vendorIndex]._id };
  });
  await Shop.insertMany(allShops);

  const counts = await Shop.aggregate([{ $group: { _id: "$cityId", n: { $sum: 1 } } }]);
  for (const row of counts) {
    await City.updateOne({ _id: row._id }, { $set: { shopCount: row.n } });
  }

  const shopVendorByShopId = new Map(
    [...dehradunShopsData, ...otherShopsData].map((s) => [s._id, s.vendorIndex])
  );

  const dehradunProducts = dehradunProductsData.map((p, idx) => {
    const vendorIndex = shopVendorByShopId.get(p.shopId);
    return {
      _id: `p_ddn_${idx + 1}`,
      name: p.name,
      description: p.description,
      price: p.price,
      image: p.image,
      category: p.category,
      shopId: p.shopId,
      cityId: "dehradun",
      rating: p.rating,
      inStock: true,
      vendorId: vendorUsers[vendorIndex]._id,
      status: "active",
    };
  });

  const otherProducts = otherCitiesProductsData.map((p) => {
    const { vendorIndex, ...rest } = p;
    return {
      ...rest,
      inStock: true,
      vendorId: vendorUsers[vendorIndex]._id,
      status: "active",
    };
  });

  await Product.insertMany([...dehradunProducts, ...otherProducts]);

  console.log("Seed complete.");
  console.log(`  Cities:   ${citiesData.length}`);
  console.log(`  Shops:    ${allShops.length} (${dehradunShopsData.length} in Dehradun)`);
  console.log(`  Products: ${dehradunProducts.length + otherProducts.length} (${dehradunProducts.length} in Dehradun)`);
  console.log("Demo logins (password: demo123):");
  console.log("  buyer@citykart.demo (buyer)");
  for (let i = 0; i < 6; i += 1) {
    console.log(`  vendor${i + 1}@citykart.demo (vendor)`);
  }
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
