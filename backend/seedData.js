const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
require('dotenv').config();

const products = [
  // Electronics - Smartphones (5 products)
  {
    name: "iPhone 15 Pro Max",
    description: "The most advanced iPhone with titanium design, A17 Pro chip, and revolutionary camera system.",
    price: 1199.99,
    comparePrice: 1299.99,
    category: "Electronics",
    subcategory: "Smartphones",
    brand: "Apple",
    images: [
      { public_id: "iphone15_1", url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80" },
      { public_id: "iphone15_2", url: "https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 45,
    specifications: [
      { key: "Display", value: "6.7-inch Super Retina XDR" },
      { key: "Chip", value: "A17 Pro" },
      { key: "Storage", value: "256GB" }
    ],
    tags: ["premium", "flagship", "5g"],
    isFeatured: true,
    ratings: 4.8,
    numOfReviews: 127
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "Unleash creativity with Galaxy AI, S Pen precision, and 200MP camera technology.",
    price: 1299.99,
    comparePrice: 1399.99,
    category: "Electronics",
    subcategory: "Smartphones",
    brand: "Samsung",
    images: [
      { public_id: "samsung_s24_1", url: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 35,
    specifications: [
      { key: "Display", value: "6.8-inch Dynamic AMOLED" },
      { key: "Processor", value: "Snapdragon 8 Gen 3" }
    ],
    tags: ["android", "s-pen"],
    isFeatured: true,
    ratings: 4.7,
    numOfReviews: 89
  },
  {
    name: "Google Pixel 8 Pro",
    description: "The most helpful Pixel phone with advanced AI features and exceptional photography.",
    price: 999.99,
    category: "Electronics",
    subcategory: "Smartphones",
    brand: "Google",
    images: [
      { public_id: "pixel8_1", url: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 28,
    isFeatured: false,
    ratings: 4.6,
    numOfReviews: 73
  },
  {
    name: "OnePlus 12",
    description: "Flagship performance with OxygenOS, fast charging, and premium build quality.",
    price: 799.99,
    category: "Electronics",
    subcategory: "Smartphones",
    brand: "OnePlus",
    images: [
      { public_id: "oneplus12_1", url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 42,
    isFeatured: false,
    ratings: 4.5,
    numOfReviews: 65
  },
  {
    name: "Xiaomi 14 Ultra",
    description: "Professional photography smartphone with Leica camera system and flagship specs.",
    price: 899.99,
    category: "Electronics",
    subcategory: "Smartphones",
    brand: "Xiaomi",
    images: [
      { public_id: "xiaomi14_1", url: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 38,
    isFeatured: false,
    ratings: 4.4,
    numOfReviews: 52
  },

  // Electronics - Laptops (5 products)
  {
    name: "MacBook Pro 16-inch M3 Max",
    description: "Professional laptop with M3 Max chip, stunning Liquid Retina XDR display.",
    price: 3499.99,
    comparePrice: 3699.99,
    category: "Electronics",
    subcategory: "Laptops",
    brand: "Apple",
    images: [
      { public_id: "macbook_pro_1", url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 15,
    isFeatured: true,
    ratings: 4.9,
    numOfReviews: 43
  },
  {
    name: "HP Spectre x360",
    description: "Premium 2-in-1 laptop with OLED display and all-day battery life.",
    price: 1299.99,
    category: "Electronics",
    subcategory: "Laptops",
    brand: "HP",
    images: [
      { public_id: "hp_spectre_1", url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 22,
    isFeatured: false,
    ratings: 4.6,
    numOfReviews: 31
  },
  {
    name: "Dell XPS 13",
    description: "Ultra-portable laptop with InfinityEdge display and premium build quality.",
    price: 999.99,
    category: "Electronics",
    subcategory: "Laptops",
    brand: "Dell",
    images: [
      { public_id: "dell_xps_1", url: "https://images.unsplash.com/photo-1484788984921-03950022c9ef?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 18,
    isFeatured: false,
    ratings: 4.5,
    numOfReviews: 28
  },
  {
    name: "Lenovo ThinkPad X1 Carbon",
    description: "Business laptop with enterprise security and legendary ThinkPad reliability.",
    price: 1499.99,
    category: "Electronics",
    subcategory: "Laptops",
    brand: "Lenovo",
    images: [
      { public_id: "thinkpad_1", url: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 25,
    isFeatured: false,
    ratings: 4.7,
    numOfReviews: 37
  },
  {
    name: "ASUS ROG Zephyrus G14",
    description: "Gaming laptop with AMD Ryzen processor and NVIDIA RTX graphics.",
    price: 1799.99,
    category: "Electronics",
    subcategory: "Laptops",
    brand: "ASUS",
    images: [
      { public_id: "asus_rog_1", url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 20,
    isFeatured: true,
    ratings: 4.8,
    numOfReviews: 45
  },

  // Electronics - Audio (5 products)
  {
    name: "Sony WH-1000XM5",
    description: "Industry-leading noise cancellation with premium sound quality.",
    price: 349.99,
    category: "Electronics",
    subcategory: "Audio",
    brand: "Sony",
    images: [
      { public_id: "sony_wh1000_1", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 55,
    isFeatured: true,
    ratings: 4.8,
    numOfReviews: 156
  },
  {
    name: "Apple AirPods Pro 2",
    description: "Personalized spatial audio with adaptive transparency mode.",
    price: 249.99,
    category: "Electronics",
    subcategory: "Audio",
    brand: "Apple",
    images: [
      { public_id: "airpods_pro_1", url: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 75,
    isFeatured: false,
    ratings: 4.7,
    numOfReviews: 203
  },
  {
    name: "Bose QuietComfort Earbuds",
    description: "True wireless earbuds with world-class noise cancellation.",
    price: 279.99,
    category: "Electronics",
    subcategory: "Audio",
    brand: "Bose",
    images: [
      { public_id: "bose_qc_1", url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 40,
    isFeatured: false,
    ratings: 4.6,
    numOfReviews: 89
  },
  {
    name: "Sennheiser HD 660S",
    description: "Open-back audiophile headphones with reference sound quality.",
    price: 499.99,
    category: "Electronics",
    subcategory: "Audio",
    brand: "Sennheiser",
    images: [
      { public_id: "sennheiser_1", url: "https://images.unsplash.com/photo-1558756520-22cfe5d382ca?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 15,
    isFeatured: false,
    ratings: 4.9,
    numOfReviews: 67
  },
  {
    name: "JBL Charge 5",
    description: "Portable Bluetooth speaker with powerful sound and long battery life.",
    price: 179.99,
    category: "Electronics",
    subcategory: "Audio",
    brand: "JBL",
    images: [
      { public_id: "jbl_charge_1", url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 60,
    isFeatured: false,
    ratings: 4.5,
    numOfReviews: 124
  },

  // Clothing - Men's Fashion (5 products)
  {
    name: "Levi's 501 Original Jeans",
    description: "The original blue jean with straight fit and classic styling.",
    price: 89.50,
    comparePrice: 98.00,
    category: "Clothing",
    subcategory: "Men's Fashion",
    brand: "Levi's",
    images: [
      { public_id: "levis_501_1", url: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 85,
    isFeatured: false,
    ratings: 4.5,
    numOfReviews: 234
  },
  {
    name: "Nike Dri-FIT Running Shirt",
    description: "Lightweight performance shirt with moisture-wicking technology.",
    price: 35.99,
    category: "Clothing",
    subcategory: "Men's Fashion",
    brand: "Nike",
    images: [
      { public_id: "nike_shirt_1", url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 120,
    isFeatured: false,
    ratings: 4.3,
    numOfReviews: 87
  },
  {
    name: "Ralph Lauren Polo Shirt",
    description: "Classic polo shirt with signature embroidered pony logo.",
    price: 89.99,
    category: "Clothing",
    subcategory: "Men's Fashion",
    brand: "Ralph Lauren",
    images: [
      { public_id: "polo_shirt_1", url: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 65,
    isFeatured: false,
    ratings: 4.6,
    numOfReviews: 98
  },
  {
    name: "Tommy Hilfiger Chinos",
    description: "Tailored fit chino pants with contemporary styling.",
    price: 79.99,
    category: "Clothing",
    subcategory: "Men's Fashion",
    brand: "Tommy Hilfiger",
    images: [
      { public_id: "chinos_1", url: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 55,
    isFeatured: false,
    ratings: 4.2,
    numOfReviews: 67
  },

  // Clothing - Women's Fashion (5 products)
  {
    name: "Zara Floral Dress",
    description: "Elegant floral print dress perfect for any occasion.",
    price: 79.99,
    category: "Clothing",
    subcategory: "Women's Fashion",
    brand: "Zara",
    images: [
      { public_id: "zara_dress_1", url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 45,
    isFeatured: true,
    ratings: 4.5,
    numOfReviews: 123
  },
  {
    name: "H&M Casual Blouse",
    description: "Versatile blouse in soft fabric with modern cut.",
    price: 29.99,
    category: "Clothing",
    subcategory: "Women's Fashion",
    brand: "H&M",
    images: [
      { public_id: "hm_blouse_1", url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 90,
    isFeatured: false,
    ratings: 4.1,
    numOfReviews: 76
  },
  {
    name: "Forever 21 Skinny Jeans",
    description: "High-waisted skinny jeans with stretch for comfort.",
    price: 24.99,
    category: "Clothing",
    subcategory: "Women's Fashion",
    brand: "Forever 21",
    images: [
      { public_id: "f21_jeans_1", url: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 110,
    isFeatured: false,
    ratings: 4.0,
    numOfReviews: 189
  },
  {
    name: "Mango Leather Jacket",
    description: "Classic leather jacket with timeless appeal and quality craftsmanship.",
    price: 199.99,
    category: "Clothing",
    subcategory: "Women's Fashion",
    brand: "Mango",
    images: [
      { public_id: "mango_jacket_1", url: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 25,
    isFeatured: true,
    ratings: 4.7,
    numOfReviews: 54
  },
  {
    name: "Uniqlo Cashmere Sweater",
    description: "Luxurious cashmere sweater with soft texture and elegant design.",
    price: 99.99,
    category: "Clothing",
    subcategory: "Women's Fashion",
    brand: "Uniqlo",
    images: [
      { public_id: "uniqlo_sweater_1", url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 35,
    isFeatured: false,
    ratings: 4.6,
    numOfReviews: 89
  },

  // Shoes (5 products)
  {
    name: "Nike Air Max 270",
    description: "Comfortable lifestyle shoe with visible Air Max technology.",
    price: 150.00,
    comparePrice: 180.00,
    category: "Clothing",
    subcategory: "Shoes",
    brand: "Nike",
    images: [
      { public_id: "nike_air_max_1", url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 95,
    isFeatured: false,
    ratings: 4.6,
    numOfReviews: 342
  },
  {
    name: "Adidas Ultraboost 22",
    description: "Running shoes with responsive Boost cushioning technology.",
    price: 180.00,
    category: "Clothing",
    subcategory: "Shoes",
    brand: "Adidas",
    images: [
      { public_id: "adidas_ultraboost_1", url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 70,
    isFeatured: false,
    ratings: 4.7,
    numOfReviews: 198
  },
  {
    name: "Converse All Star High-Top",
    description: "Classic canvas sneakers with timeless style and comfort.",
    price: 65.00,
    category: "Clothing",
    subcategory: "Shoes",
    brand: "Converse",
    images: [
      { public_id: "converse_1", url: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 120,
    isFeatured: false,
    ratings: 4.4,
    numOfReviews: 276
  },
  {
    name: "Vans Old Skool",
    description: "Iconic skate shoe with signature side stripe and durable construction.",
    price: 65.00,
    category: "Clothing",
    subcategory: "Shoes",
    brand: "Vans",
    images: [
      { public_id: "vans_oldskool_1", url: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 85,
    isFeatured: false,
    ratings: 4.5,
    numOfReviews: 234
  },
  

  // Books (5 products)
  {
    name: "The Pragmatic Programmer",
    description: "Essential guide for software developers with practical programming techniques.",
    price: 39.95,
    category: "Books",
    subcategory: "Programming",
    brand: "Addison-Wesley",
    images: [
      { public_id: "programming_book_1", url: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 150,
    isFeatured: false,
    ratings: 4.7,
    numOfReviews: 456
  },
  {
    name: "Clean Code",
    description: "A handbook of agile software craftsmanship by Robert C. Martin.",
    price: 44.99,
    category: "Books",
    subcategory: "Programming",
    brand: "Prentice Hall",
    images: [
      { public_id: "clean_code_1", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 125,
    isFeatured: false,
    ratings: 4.6,
    numOfReviews: 389
  },
  {
    name: "Atomic Habits",
    description: "An easy and proven way to build good habits and break bad ones.",
    price: 18.99,
    category: "Books",
    subcategory: "Self-Help",
    brand: "Avery",
    images: [
      { public_id: "atomic_habits_1", url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 200,
    isFeatured: true,
    ratings: 4.8,
    numOfReviews: 1234
  },
  {
    name: "Dune",
    description: "Epic science fiction novel by Frank Herbert, a masterpiece of imagination.",
    price: 16.99,
    category: "Books",
    subcategory: "Fiction",
    brand: "Ace Books",
    images: [
      { public_id: "dune_1", url: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 75,
    isFeatured: false,
    ratings: 4.5,
    numOfReviews: 567
  },
  {
    name: "The 7 Habits of Highly Effective People",
    description: "Powerful lessons in personal change by Stephen R. Covey.",
    price: 17.99,
    category: "Books",
    subcategory: "Self-Help",
    brand: "Free Press",
    images: [
      { public_id: "7habits_1", url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 110,
    isFeatured: false,
    ratings: 4.4,
    numOfReviews: 789
  },

  // Home & Garden - Kitchen (5 products)
  {
    name: "Instant Pot Duo 7-in-1",
    description: "Multi-functional pressure cooker that replaces 7 kitchen appliances.",
    price: 99.95,
    category: "Home & Garden",
    subcategory: "Kitchen Appliances",
    brand: "Instant Pot",
    images: [
      { public_id: "instant_pot_1", url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 45,
    isFeatured: true,
    ratings: 4.6,
    numOfReviews: 2345
  },
  {
    name: "Ninja Foodi Personal Blender",
    description: "Powerful personal blender for smoothies and protein shakes.",
    price: 79.99,
    comparePrice: 99.99,
    category: "Home & Garden",
    subcategory: "Kitchen Appliances",
    brand: "Ninja",
    images: [
      { public_id: "ninja_blender_1", url: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 65,
    isFeatured: true,
    ratings: 4.4,
    numOfReviews: 876
  },
  {
    name: "KitchenAid Stand Mixer",
    description: "Professional stand mixer with 10-speed settings and multiple attachments.",
    price: 379.99,
    category: "Home & Garden",
    subcategory: "Kitchen Appliances",
    brand: "KitchenAid",
    images: [
      { public_id: "kitchenaid_1", url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 25,
    isFeatured: false,
    ratings: 4.8,
    numOfReviews: 567
  },
  {
    name: "Cuisinart Food Processor",
    description: "14-cup food processor with multiple blades and attachments.",
    price: 199.99,
    category: "Home & Garden",
    subcategory: "Kitchen Appliances",
    brand: "Cuisinart",
    images: [
      { public_id: "cuisinart_1", url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 35,
    isFeatured: false,
    ratings: 4.5,
    numOfReviews: 234
  },
  {
    name: "Keurig K-Elite Coffee Maker",
    description: "Single-serve coffee maker with strong brew button and iced coffee setting.",
    price: 169.99,
    category: "Home & Garden",
    subcategory: "Kitchen Appliances",
    brand: "Keurig",
    images: [
      { public_id: "keurig_1", url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 55,
    isFeatured: false,
    ratings: 4.3,
    numOfReviews: 678
  },

  // Home & Garden - Furniture (5 products)
  {
    name: "IKEA MALM Bed Frame",
    description: "Modern bed frame with clean lines and adjustable bed sides.",
    price: 179.99,
    category: "Home & Garden",
    subcategory: "Furniture",
    brand: "IKEA",
    images: [
      { public_id: "ikea_bed_1", url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 15,
    isFeatured: false,
    ratings: 4.2,
    numOfReviews: 345
  },
  {
    name: "Ashley Furniture Sofa",
    description: "Comfortable 3-seater sofa with durable fabric upholstery.",
    price: 899.99,
    category: "Home & Garden",
    subcategory: "Furniture",
    brand: "Ashley",
    images: [
      { public_id: "ashley_sofa_1", url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 8,
    isFeatured: true,
    ratings: 4.4,
    numOfReviews: 123
  },
  {
    name: "Wayfair Dining Table",
    description: "Solid wood dining table that seats 6 people comfortably.",
    price: 649.99,
    category: "Home & Garden",
    subcategory: "Furniture",
    brand: "Wayfair",
    images: [
      { public_id: "wayfair_table_1", url: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 12,
    isFeatured: false,
    ratings: 4.3,
    numOfReviews: 89
  },
  {
    name: "Herman Miller Office Chair",
    description: "Ergonomic office chair with lumbar support and adjustable height.",
    price: 1299.99,
    category: "Home & Garden",
    subcategory: "Furniture",
    brand: "Herman Miller",
    images: [
      { public_id: "herman_chair_1", url: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 6,
    isFeatured: false,
    ratings: 4.7,
    numOfReviews: 67
  },
  

  // Sports & Fitness (5 products)
  {
    name: "Premium Yoga Mat",
    description: "Non-slip yoga mat with superior grip for all types of yoga practice.",
    price: 29.99,
    category: "Sports",
    subcategory: "Fitness",
    brand: "Gaiam",
    images: [
      { public_id: "yoga_mat_1", url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 150,
    isFeatured: true,
    ratings: 4.5,
    numOfReviews: 456
  },
  {
    name: "Bowflex SelectTech Dumbbells",
    description: "Adjustable dumbbells that replace 15 sets of weights (5-52.5 lbs).",
    price: 349.99,
    comparePrice: 399.99,
    category: "Sports",
    subcategory: "Fitness Equipment",
    brand: "Bowflex",
    images: [
      { public_id: "bowflex_dumbbells_1", url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 25,
    isFeatured: true,
    ratings: 4.7,
    numOfReviews: 789
  },
  {
    name: "NordicTrack Treadmill",
    description: "Commercial-grade treadmill with iFit integration and incline training.",
    price: 1999.99,
    category: "Sports",
    subcategory: "Fitness Equipment",
    brand: "NordicTrack",
    images: [
      { public_id: "nordictrack_1", url: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 5,
    isFeatured: false,
    ratings: 4.4,
    numOfReviews: 234
  },
  {
    name: "Wilson Tennis Racket",
    description: "Professional tennis racket with enhanced power and control.",
    price: 179.99,
    category: "Sports",
    subcategory: "Team Sports",
    brand: "Wilson",
    images: [
      { public_id: "wilson_tennis_1", url: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 45,
    isFeatured: false,
    ratings: 4.6,
    numOfReviews: 123
  },
  {
    name: "Spalding Basketball",
    description: "Official size basketball with superior grip and durability.",
    price: 24.99,
    category: "Sports",
    subcategory: "Team Sports",
    brand: "Spalding",
    images: [
      { public_id: "spalding_ball_1", url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 85,
    isFeatured: false,
    ratings: 4.3,
    numOfReviews: 345
  },

  // Beauty & Personal Care (5 products)
  {
    name: "The Ordinary Skincare Set",
    description: "Complete skincare routine with hyaluronic acid and niacinamide.",
    price: 49.99,
    category: "Beauty",
    subcategory: "Skincare",
    brand: "The Ordinary",
    images: [
      { public_id: "ordinary_skincare_1", url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 95,
    isFeatured: true,
    ratings: 4.6,
    numOfReviews: 567
  },
  {
    name: "Urban Decay Eyeshadow Palette",
    description: "12-shade eyeshadow palette with long-lasting, highly pigmented colors.",
    price: 54.99,
    category: "Beauty",
    subcategory: "Makeup",
    brand: "Urban Decay",
    images: [
      { public_id: "urbandecay_palette_1", url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 65,
    isFeatured: false,
    ratings: 4.7,
    numOfReviews: 234
  },
  {
    name: "Dyson Hair Dryer",
    description: "Professional hair dryer with intelligent heat control technology.",
    price: 399.99,
    category: "Beauty",
    subcategory: "Haircare",
    brand: "Dyson",
    images: [
      { public_id: "dyson_dryer_1", url: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 15,
    isFeatured: true,
    ratings: 4.8,
    numOfReviews: 345
  },
  {
    name: "Chanel No. 5 Perfume",
    description: "Iconic fragrance with timeless elegance and sophisticated scent.",
    price: 132.99,
    category: "Beauty",
    subcategory: "Fragrance",
    brand: "Chanel",
    images: [
      { public_id: "chanel_perfume_1", url: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 35,
    isFeatured: false,
    ratings: 4.9,
    numOfReviews: 789
  },
  {
    name: "Fenty Beauty Foundation",
    description: "Full-coverage foundation with 40 shades for all skin tones.",
    price: 36.99,
    category: "Beauty",
    subcategory: "Makeup",
    brand: "Fenty Beauty",
    images: [
      { public_id: "fenty_foundation_1", url: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80" }
    ],
    stock: 125,
    isFeatured: false,
    ratings: 4.5,
    numOfReviews: 1234
  }
];

const adminUser = {
  name: "Admin User",
  email: "admin@ecommerce.com",
  password: "admin123456",
  role: "admin"
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://commiavikalp:ecommercepass123@cluster1.ulk89u2.mongodb.net/ecommerce?retryWrites=true&w=majority');
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Product.deleteMany({});
    await User.deleteMany({});

    // Create admin user
    console.log('👤 Creating admin user...');
    const admin = new User(adminUser);
    await admin.save();
    console.log('✅ Admin user created successfully');

    // Add createdBy field to products
    const productsWithCreator = products.map(product => ({
      ...product,
      createdBy: admin._id
    }));

    // Insert products in batches for better performance
    console.log('📦 Inserting products...');
    const batchSize = 10;
    for (let i = 0; i < productsWithCreator.length; i += batchSize) {
      const batch = productsWithCreator.slice(i, i + batchSize);
      await Product.insertMany(batch);
      console.log(`✅ Inserted products ${i + 1}-${Math.min(i + batchSize, productsWithCreator.length)}`);
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log(`📊 Total products added: ${products.length}`);
    console.log('🔑 Admin credentials:');
    console.log('   Email: admin@ecommerce.com');
    console.log('   Password: admin123456');
    console.log('\n📂 Categories seeded:');
    
    const categoryStats = {};
    products.forEach(product => {
      categoryStats[product.category] = (categoryStats[product.category] || 0) + 1;
    });
    
    Object.entries(categoryStats).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} products`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// Add this to handle process termination
process.on('SIGINT', () => {
  console.log('\n⚠️  Process interrupted. Closing database connection...');
  mongoose.connection.close(() => {
    console.log('✅ Database connection closed.');
    process.exit(0);
  });
});

seedDatabase();
