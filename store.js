/**
 * The Apothecary's Cabinet — Storefront & E-Commerce Engine
 * Features:
 * - Reactive Catalog & Category Filtering
 * - Real-time Stock Tracking & Low-Stock Alerts
 * - Cart Management (persistent in localStorage)
 * - Hybrid Direct-Checkout (Stripe, PayPal, Local Pickup)
 * - Automated Printable & Downloadable Invoices & Receipts
 * - WebStudio Live Synchronization Bridge
 */

(function () {
  'use strict';

  // ── Default Store Configuration ───────────────────────────────────────────
  const DEFAULT_CONFIG = {
    storeName: "The Apothecary's Cabinet",
    tagline: "Our wide variety of products offers a natural way to meet the body's needs from head to toe, and everything in between.",
    address: "The Apothecary's Cabinet Sanctuary",
    cityStateZip: "Cadillac, MI & Beyond",
    phone: "(231) 884-4212",
    email: "hello@theapothecaryscabinet.com",
    facebook: "facebook.com/Theapothecariancabinet",
    instagram: "@The_Apothecarys_Cabinet",
    taxRate: 0.05,
    freeShippingThreshold: 65.0,
    shippingRates: {
      standard: { name: "Standard Ground (3-5 days)", cost: 5.50 },
      express: { name: "Expedited Courier (1-2 days)", cost: 14.00 },
      pickup: { name: "Local Studio Pickup", cost: 0.00 }
    },
    promoCodes: {
      "HERBAL10": { type: "percent", value: 10, label: "10% Welcome to the Cabinet" },
      "SOAPLOVE": { type: "percent", value: 15, label: "15% Handcrafted Soap Special" },
      "FREESHIP": { type: "shipping", value: 0, label: "Complimentary Shipping" }
    }
  };

  // ── Default Product Catalog (From Lynn's Actual Printed Menus) ───────────
  const DEFAULT_PRODUCTS = [
  {
    "id": "prod-lotion-beads",
    "sku": "AC-SPA-001",
    "title": "Lavish Lotion Bar Beads (In Reusable Glass Nightstand Jar)",
    "category": "Spa & Skincare",
    "categorySlug": "spa",
    "size": "Reusable Glass Jar",
    "price": 16.0,
    "comparePrice": null,
    "stock": 35,
    "lowStockThreshold": 8,
    "image": "assets/prod-lotion-beads-clean.png",
    "fulfillmentType": "studio",
    "description": "A new spin on a shop favorite! Lynn has taken her beloved Lavish Lotion Bars and transformed them into mini beads \u2014 perfect for on-the-go hydration or keeping right beside your nightstand. The same deeply moisturizing formula you love, shrunk into bite-sized minis that melt on contact. No more messy chunks to fight with! Packaged in a charming reusable keepsake glass jar.",
    "ingredients": "Pure Local Beeswax, Organic Unrefined Shea Butter, Cold-Pressed Coconut Oil, Golden Jojoba Oil, Sweet Almond Oil, Vitamin E, Gentle Essential Oils.",
    "usage": "Take 1-2 mini beads, press into warm palms, and massage directly into dry hands, cuticles, elbows, or legs. Melts smoothly with body heat.",
    "badge": "Shop Favorite"
  },
  {
    "id": "prod-herbal-face-serum",
    "sku": "AC-SPA-002",
    "title": "Herbal Face Serum (Rose, Chamomile & Hyaluronic Acid)",
    "category": "Spa & Skincare",
    "categorySlug": "spa",
    "size": "30 ml / 1 fl oz Dropper",
    "price": 28.0,
    "comparePrice": 34.0,
    "stock": 24,
    "lowStockThreshold": 6,
    "image": "assets/prod-face-serum-clean.svg",
    "fulfillmentType": "studio",
    "description": "A gentle, plant-powered serum crafted by Lynn to hydrate, soothe, and balance the skin. Made with distilled rose, chamomile, and rosemary hydrosols for a light herbal freshness that calms irritation while supporting a radiant glow. Pure vegetable glycerin and hyaluronic acid draw in lasting moisture without clogging pores, leaving skin soft, dewy, and plump. Formulated completely without oils, alcohol, or harsh chemicals.",
    "ingredients": "Distilled Rose Hydrosol, Chamomile Flower Water, Rosemary Hydrosol, Botanical Hyaluronic Acid, Organic Vegetable Glycerin, Radish Root Ferment (natural preservative).",
    "usage": "Apply 3 to 5 drops to freshly cleansed skin morning and night, or whenever your skin needs a quick botanical refresh. Gentle for all skin types, especially sensitive or mature skin.",
    "badge": "Oil-Free Glow"
  },
  {
    "id": "prod-starts-with-rub",
    "sku": "AC-SLV-003",
    "title": "Starts With a Rub (Cramp, Joint & Endometriosis Muscle Rub)",
    "category": "Salves & Rubs",
    "categorySlug": "salves",
    "size": "2 oz Amber Glass Jar",
    "price": 18.0,
    "comparePrice": null,
    "stock": 40,
    "lowStockThreshold": 10,
    "image": "assets/salve.svg",
    "fulfillmentType": "studio",
    "description": "One of Lynn's top best-selling formulations. Handcrafted lubricating and muscle-comfort rub specifically developed to ease painful cramps, abdominal tightness, discomfort associated with Endometriosis, overworked joints, and muscle inflammation.",
    "ingredients": "Solar-Infused Arnica Blossoms, St. John's Wort, Organic Olive Oil, Local Beeswax, Magnesium-Rich Botanical Extracts, Pure Cramp Bark Extract, Essential Oils of Clary Sage, Sweet Birch & Lavender.",
    "usage": "Warm a generous nickel-sized amount between palms and massage deeply into lower abdomen, lower back, aching knees, or tense muscles. Reapply as needed.",
    "badge": "Best Seller"
  },
  {
    "id": "prod-comfrey-salve",
    "sku": "AC-SLV-004",
    "title": "Comfrey Healing Salve (Bumps, Scrapes, Bites & Bruises)",
    "category": "Salves & Rubs",
    "categorySlug": "salves",
    "size": "2 oz Metal Workshop Tin",
    "price": 15.0,
    "comparePrice": null,
    "stock": 50,
    "lowStockThreshold": 12,
    "image": "assets/salve.svg",
    "fulfillmentType": "studio",
    "description": "Traditional garden comfrey (Symphytum officinale) leaf and root slow-infused into organic oils to support rapid tissue repair. Known in folk medicine as 'knitbone', this all-purpose family salve is indispensable for outdoor scrapes, bug bites, minor burns, and bruised skin.",
    "ingredients": "Organic Comfrey Leaf & Root Infusion, Calendula Petals, Cold-Pressed Extra Virgin Olive Oil, Raw Beeswax, Tea Tree & Lavender Essential Oils.",
    "usage": "Cleanse affected skin and apply a thin soothing layer 2-3 times daily. Not for use on deep open puncture wounds.",
    "badge": "Outdoor Staple"
  },
  {
    "id": "prod-all-buzz-lip-balm",
    "sku": "AC-LIP-005",
    "title": "All the Buzz Botanical Lip Balm",
    "category": "Spa & Skincare",
    "categorySlug": "spa",
    "size": "0.15 oz Eco-Tube",
    "price": 3.5,
    "comparePrice": null,
    "stock": 90,
    "lowStockThreshold": 20,
    "image": "assets/salve.svg",
    "fulfillmentType": "studio",
    "description": "Silky, long-lasting moisture formulated with raw local beeswax, organic sweet almond oil, and raw honey. Protects against harsh winds, cold weather, and dry cracked lips without waxy buildup.",
    "ingredients": "Local BC Beeswax, Organic Shea Butter, Sweet Almond Oil, Raw Unpasteurized Honey, Peppermint Essential Oil, Vitamin E.",
    "usage": "Glide generously across lips as often as needed throughout the day and before bedtime.",
    "badge": "Customer Love"
  },
  {
    "id": "prod-sugar-scrub",
    "sku": "AC-SPA-006",
    "title": "Coffee, Vanilla & Skin Soft Aromatic Sugar Scrub",
    "category": "Spa & Skincare",
    "categorySlug": "spa",
    "size": "5 oz Resealable Glass Jar",
    "price": 10.0,
    "comparePrice": null,
    "stock": 32,
    "lowStockThreshold": 8,
    "image": "assets/soap.svg",
    "fulfillmentType": "studio",
    "description": "Lynn's top-selling body scrub! A rich, intoxicating aromatic blend of freshly roasted coffee grounds, warm vanilla bean, raw turbinado sugar, and skin-softening plant oils. Gently sloughs away dull, dry skin while leaving a silky protective barrier.",
    "ingredients": "Fair-Trade Dark Roasted Ground Coffee, Raw Cane Sugar, Golden Jojoba Oil, Sweet Almond Oil, Madagascar Vanilla Infusion, Vitamin E.",
    "usage": "Stir gently before use. Scoop into clean hands and buff onto wet skin in circular motions in the shower or bath, focusing on elbows, heels, and legs. Rinse thoroughly.",
    "badge": "Top Seller"
  },
  {
    "id": "prod-mens-beard-kit",
    "sku": "AC-BRD-007",
    "title": "Men's Complete Beard Care Kit (Soap, Oil & Styling Balm)",
    "category": "Spa & Skincare",
    "categorySlug": "spa",
    "size": "3-Piece Boxed Set",
    "price": 30.0,
    "comparePrice": 36.0,
    "stock": 20,
    "lowStockThreshold": 5,
    "image": "assets/giftbox.svg",
    "fulfillmentType": "studio",
    "description": "Keep the beard clean, sexy, and healthy with this complete handcrafted kit. Contains: 1 full-size clarifying Cedar & Sage beard soap bar, 1 bottle of conditioning botanical beard oil, and 1 tin of natural beeswax shaping balm.",
    "ingredients": "Handcrafted Beer & Pine Tar Soap Bar, Golden Argan & Jojoba Beard Oil with Frankincense & Atlas Cedarwood, Beeswax Shaping Balm with Organic Shea Butter.",
    "usage": "Wash beard with the soap bar, pat damp, apply 3-4 drops of oil down into facial skin, and shape with a pea-sized dab of balm.",
    "badge": "Gift Set"
  },
  {
    "id": "prod-botanical-bath-bags",
    "sku": "AC-BTH-008",
    "title": "Botanical Herbal Bath Soak Bags",
    "category": "Spa & Skincare",
    "categorySlug": "spa",
    "size": "Twin-Pack Unbleached Steeping Bags",
    "price": 15.0,
    "comparePrice": null,
    "stock": 38,
    "lowStockThreshold": 10,
    "image": "assets/bundle.svg",
    "fulfillmentType": "studio",
    "description": "Transform your bath into an apothecary sanctuary. Whole botanical blossoms and therapeutic salts encased in mess-free unbleached steeping bags. 'Perfect to help you relax the day away as you heal your mind and body with nature's perfect blends.'",
    "ingredients": "Dead Sea Salt, Epsom Magnesium Crystals, Organic French Lavender, Chamomile Blossoms, Rose Petals, Calendula, Eucalyptus Essential Oil.",
    "usage": "Toss 1 bag directly into hot running bath water. Squeeze gently to release rich botanical milky extracts, and soak for 20-30 minutes.",
    "badge": "Relax & Restore"
  },
  {
    "id": "prod-elderberry-kit",
    "sku": "AC-PRE-009",
    "title": "All-Natural Elderberry Wellness Syrup Kit",
    "category": "Botanical Preparations",
    "categorySlug": "botanicals",
    "size": "Dry Botanical Kit (Makes 16-24 oz)",
    "price": 25.0,
    "comparePrice": null,
    "stock": 28,
    "lowStockThreshold": 6,
    "image": "assets/elixir.svg",
    "fulfillmentType": "studio",
    "description": "A seasonal household essential. Organic dried black elderberries (Sambucus nigra) combined with cinnamon bark, whole cloves, star anise, and ginger root. Just simmer with water and stir in your local raw honey to produce rich, immune-supporting syrup.",
    "ingredients": "Organic Dried Black Elderberries, Organic Ceylon Cinnamon Bark, Organic Ginger Root, Organic Whole Cloves, Star Anise Pods.",
    "usage": "Simmer contents of kit with 3.5 cups of water for 45 minutes. Strain berries, let cool to lukewarm, and stir in 1 cup raw honey. Store in refrigerator up to 3 months.",
    "badge": "Family Essential"
  },
  {
    "id": "prod-nipple-butt-balm",
    "sku": "AC-MOM-010",
    "title": "Momma's Organic Nipple & Butt Botanical Balm",
    "category": "Botanical Preparations",
    "categorySlug": "botanicals",
    "size": "4 oz Amber Glass Jar",
    "price": 12.0,
    "comparePrice": null,
    "stock": 30,
    "lowStockThreshold": 8,
    "image": "assets/salve.svg",
    "fulfillmentType": "studio",
    "description": "Formulated with the purest organic edible-grade ingredients for nursing mommas and precious babies. An organic, no-wipe nipple balm that soothes cracked, tender nursing nipples without needing to be washed off before latching. Also miraculous for clearing up infant cradle cap, chapped cheeks, and stubborn diaper rash.",
    "ingredients": "Organic Extra Virgin Olive Oil, Marshmallow Root Infusion, Organic Calendula Petals, Raw Unbleached Beeswax, Organic Shea Butter, Non-GMO Vitamin E.",
    "usage": "Apply a pea-sized amount to nipples after nursing. Smooth onto baby's scalp for cradle cap 15 minutes before gentle bathing, or apply generously at diaper changes.",
    "badge": "Safe for Nursing"
  },
  {
    "id": "prod-smoke-blend",
    "sku": "AC-SMK-011",
    "title": "Sacred Herbal Smoke & Facial Steam Blend",
    "category": "Botanical Preparations",
    "categorySlug": "botanicals",
    "size": "Aromatic Tin / Gift Box",
    "price": 15.0,
    "comparePrice": null,
    "stock": 42,
    "lowStockThreshold": 10,
    "image": "assets/bundle.svg",
    "fulfillmentType": "studio",
    "description": "An exquisite ancestral blend of organic non-addictive herbs crafted for mindful smoking rituals, ceremonial pipe blends, or aromatic herbal facial steaming. Clean, smooth, and grounding.",
    "ingredients": "Organic Mullein Leaf (Verbascum thapsus), Mugwort (Artemisia vulgaris), Damiana, Red Raspberry Leaf, Blue Cornflower, Lavender Florets.",
    "usage": "Use in ceremonial pipe, rolling papers, or scoop 2 tablespoons into a bowl of steaming water for a pore-opening herbal face bath.",
    "badge": "Old World Ritual"
  },
  {
    "id": "prod-cayenne-rub",
    "sku": "AC-SLV-012",
    "title": "Warming Deep Heat Cayenne & Ginger Rub",
    "category": "Salves & Rubs",
    "categorySlug": "salves",
    "size": "2 oz Amber Glass Jar",
    "price": 15.0,
    "comparePrice": null,
    "stock": 26,
    "lowStockThreshold": 6,
    "image": "assets/salve.svg",
    "fulfillmentType": "studio",
    "description": "Stimulates local circulation and brings deep soothing warmth to stubborn winter aches, cold feet, frozen shoulders, and stiff lower back knots.",
    "ingredients": "Infused Organic Cayenne Pepper (Capsicum annuum), Fresh Ginger Root, Mustard Seed, Pure Olive Oil, Beeswax, Wintergreen & Black Pepper Essential Oils.",
    "usage": "Apply sparingly to unbroken skin and massage until warming sensation takes hold. Wash hands thoroughly with soap after application. Avoid contact with eyes and sensitive areas.",
    "badge": "Deep Heat"
  },
  {
    "id": "prod-sleepy-babe-tea",
    "sku": "AC-TEA-013",
    "title": "Sleepy Babe Relax & Slumber Herbal Tea",
    "category": "Teas & Infusions",
    "categorySlug": "teas",
    "size": "Full Ounce Pouch",
    "price": 15.0,
    "comparePrice": null,
    "stock": 35,
    "lowStockThreshold": 8,
    "image": "assets/tea.svg",
    "fulfillmentType": "studio",
    "description": "Unwind after a long day with Lynn's signature evening slumber blend. Gently calms an overactive nervous system, quietens racing bedtime thoughts, and eases nighttime muscle tension.",
    "ingredients": "Organic German Chamomile Flowers, Skullcap (Scutellaria lateriflora), Catnip Leaf, Lemon Balm, French Lavender, Passionflower.",
    "usage": "Steep 1 tablespoon in 8 oz freshly boiled water for 8-10 minutes covered. Sip slowly 30 minutes before sleep.",
    "badge": "Night Slumber"
  },
  {
    "id": "prod-cold-flu-tea",
    "sku": "AC-TEA-014",
    "title": "Cold & Flu Fighter Herbal Immune Tea",
    "category": "Teas & Infusions",
    "categorySlug": "teas",
    "size": "Full Ounce Pouch",
    "price": 15.0,
    "comparePrice": null,
    "stock": 30,
    "lowStockThreshold": 8,
    "image": "assets/tea.svg",
    "fulfillmentType": "studio",
    "description": "A warming botanical brew packed with traditional immune-supportive roots, berries, and spicy herbs to help you power through winter chills.",
    "ingredients": "Elderberries, Echinacea Purpurea Root, Rose Hips, Yarrow Blossoms, Peppermint Leaf, Ginger Root.",
    "usage": "Steep 1 heaping tablespoon in 10 oz boiling water covered for 12 minutes. Sweeten with raw wildflower honey and lemon.",
    "badge": "Seasonal Armor"
  },
  {
    "id": "prod-passion-flower-tincture",
    "sku": "AC-TNC-015",
    "title": "Passion Flower Anxiety & Nerve Botanical Tincture",
    "category": "Tinctures",
    "categorySlug": "tinctures",
    "size": "1 oz Amber Dropper Bottle",
    "price": 16.0,
    "comparePrice": null,
    "stock": 25,
    "lowStockThreshold": 6,
    "image": "assets/tincture.svg",
    "fulfillmentType": "studio",
    "description": "Our most sought-after botanical tincture. Prepared with Passiflora incarnata to gently tone the central nervous system, curb racing anxiety loops, and soothe restless worry.",
    "ingredients": "Organic Passion Flower Herb & Vine (Passiflora incarnata), Organic Cane Alcohol (45%), Pure Spring Water.",
    "usage": "Take 20 to 30 drops (approx. 1 dropperful) directly under tongue or in a small splash of water 2-3 times daily as needed for stress.",
    "badge": "Stress Support"
  },
  {
    "id": "prod-valerian-tincture",
    "sku": "AC-TNC-016",
    "title": "Valerian Root Deep Sleep Botanical Tincture",
    "category": "Tinctures",
    "categorySlug": "tinctures",
    "size": "1 oz Amber Dropper Bottle",
    "price": 8.0,
    "comparePrice": null,
    "stock": 40,
    "lowStockThreshold": 10,
    "image": "assets/tincture.svg",
    "fulfillmentType": "studio",
    "description": "Potent earthen root extraction for deep, uninterrupted nighttime rest. Traditional time-tested folk sleep ally.",
    "ingredients": "Valerian Root (Valeriana officinalis), Organic Cane Alcohol, Spring Water.",
    "usage": "Take 30-40 drops in water or nighttime tea 30 minutes before bed.",
    "badge": "Deep Rest"
  },
  {
    "id": "prod-logo-tee",
    "sku": "AC-TEE-017",
    "title": "The Apothecary's Cabinet Vintage Organic Tee",
    "category": "Merch & Cabinet Customs",
    "categorySlug": "merch",
    "size": "Unisex Sizing (XS - 2XL)",
    "price": 25.0,
    "comparePrice": 32.0,
    "stock": 100,
    "lowStockThreshold": 15,
    "image": "assets/shirt.svg",
    "fulfillmentType": "dropship",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "2XL"
    ],
    "colors": [
      "Washed Moss",
      "Vintage Pitch Black",
      "Oat Sand"
    ],
    "description": "100% certified organic ring-spun cotton tee printed with Lynn's authentic gold crest monogram logo (EST. 2018). Screenprinted with eco-friendly water-based inks.",
    "ingredients": "100% GOTS Certified Organic Cotton, Water-Based Non-Toxic Inks. Ethically produced.",
    "usage": "Machine wash cold inside-out, tumble dry low or hang dry to preserve graphic vibrancy.",
    "badge": "Cabinet Merch"
  },
  {
    "id": "prod-custom-crate",
    "sku": "AC-CST-018",
    "title": "Custom Handcrafted Gift Basket / Wooden Crate",
    "category": "Custom Orders & Consults",
    "categorySlug": "custom",
    "size": "Personalized Gift Set",
    "price": 45.0,
    "comparePrice": 55.0,
    "stock": 20,
    "lowStockThreshold": 4,
    "image": "assets/giftbox.svg",
    "fulfillmentType": "custom",
    "customizable": true,
    "description": "Customized to meet your exact needs. As Lynn notes: 'All products can be purchased individually, in pairs, or grouped in baskets making the perfect gift.' Includes your custom choices of soaps, salves, and a handwritten personalized note.",
    "ingredients": "Personalized selection of handcrafted soaps, salves, bath bags, and teas in a ribboned rustic crate.",
    "usage": "Specify your recipient, preferences, and custom message in the order notes.",
    "badge": "Personalized"
  },
  {
    "id": "prod-field-guide-book",
    "sku": "AC-BOK-019",
    "title": "The Apothecary's Cabinet: A Field Guide to Foraging & Folk Healing from Home",
    "category": "Custom Orders & Consults",
    "categorySlug": "custom",
    "size": "Illustrated Softcover Book",
    "price": 22.0,
    "comparePrice": null,
    "stock": 50,
    "lowStockThreshold": 10,
    "image": "assets/book-field-guide.jpg",
    "fulfillmentType": "studio",
    "description": "Written by The Apothecary's Cabinet. A hands-on, practical field guide to discovering wild medicinal and botanical plants in your own backyard, sustainable foraging practices, and crafting time-tested folk preparations in your home kitchen.",
    "ingredients": "High-quality archival paper, full botanical illustrations, step-by-step recipes and guides.",
    "usage": "Keep in your backpack on nature walks or on your kitchen counter for seasonal medicine-making.",
    "badge": "Author Book"
  },
  {
    "id": "prod-herbal-consultation",
    "sku": "AC-CNS-020",
    "title": "1-2 Hour Personal Wellness Consultation with Lynn",
    "category": "Custom Orders & Consults",
    "categorySlug": "custom",
    "size": "1-2 Hour Virtual or In-Person Intake",
    "price": 100.0,
    "comparePrice": 250.0,
    "stock": 10,
    "lowStockThreshold": 2,
    "image": "assets/brochure-story-consults.jpg",
    "fulfillmentType": "custom",
    "customizable": true,
    "description": "Schedule a personal consultation to build a customized plan that suits your specific wellness needs. Includes initial comprehensive intake discussion (health history, chief complaints, herbal plan), ONE FREE custom product formulated for your needs, plus a 3-month checkup and 6-month checkup! (Industry average for initial consultation is $250). *We do not diagnose. Please consult your medical care provider before using herbal preparations.*",
    "ingredients": "Comprehensive 1-2 hour one-on-one session, tailored botanical strategy, 1 free artisan preparation, and two scheduled follow-up reviews.",
    "usage": "Upon ordering, Lynn will contact you directly via phone or email to schedule your intake time.",
    "badge": "1-on-1 with Lynn"
  }
];

  // Version migration to ensure live site loads authentic catalog
  const CATALOG_VERSION = "2026-v8-clean-cards-featured";
  if (localStorage.getItem("apothecary_cat_version") !== CATALOG_VERSION) {
    localStorage.removeItem("apothecary_products");
    localStorage.removeItem("apothecary_config");
    localStorage.setItem("apothecary_cat_version", CATALOG_VERSION);
  }

  // ── State Store ───────────────────────────────────────────────────────────
  let state = {
    config: JSON.parse(localStorage.getItem("apothecary_config")) || DEFAULT_CONFIG,
    products: JSON.parse(localStorage.getItem("apothecary_products")) || DEFAULT_PRODUCTS,
    cart: JSON.parse(localStorage.getItem("apothecary_cart")) || [],
    orders: JSON.parse(localStorage.getItem("apothecary_orders")) || [],
    activeCategory: "all",
    searchQuery: "",
    sortBy: "featured",
    appliedPromo: null,
    selectedShippingKey: "standard"
  };

  function saveState() {
    localStorage.setItem("apothecary_config", JSON.stringify(state.config));
    localStorage.setItem("apothecary_products", JSON.stringify(state.products));
    localStorage.setItem("apothecary_cart", JSON.stringify(state.cart));
    localStorage.setItem("apothecary_orders", JSON.stringify(state.orders));
    notifyStudioSync();
  }

  function notifyStudioSync() {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: "APOTHECARY_SYNC_UPDATE",
        payload: {
          products: state.products,
          config: state.config,
          cartCount: getCartCount(),
          ordersCount: state.orders.length
        }
      }, "*");
    }
  }

  // ── DOM Helpers ───────────────────────────────────────────────────────────
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

  // ── Cart Calculations ─────────────────────────────────────────────────────
  function getCartSubtotal() {
    return state.cart.reduce((sum, item) => {
      const prod = state.products.find(p => p.id === item.id);
      return sum + (prod ? prod.price * item.quantity : 0);
    }, 0);
  }

  function getCartCount() {
    return state.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  function getDiscountAmount(subtotal) {
    if (!state.appliedPromo) return 0;
    const promo = state.config.promoCodes[state.appliedPromo];
    if (!promo) return 0;
    if (promo.type === "percent") {
      return (subtotal * promo.value) / 100;
    }
    return 0;
  }

  function getShippingCost(subtotal) {
    if (state.appliedPromo && state.config.promoCodes[state.appliedPromo]?.type === "shipping") {
      return 0.00;
    }
    if (subtotal >= state.config.freeShippingThreshold && state.selectedShippingKey === "standard") {
      return 0.00;
    }
    const rate = state.config.shippingRates[state.selectedShippingKey];
    return rate ? rate.cost : 5.50;
  }

  function getTaxAmount(taxableAmount) {
    return taxableAmount * state.config.taxRate;
  }

  function getCartTotals() {
    const subtotal = getCartSubtotal();
    const discount = getDiscountAmount(subtotal);
    const taxableAmount = Math.max(0, subtotal - discount);
    const shipping = getShippingCost(subtotal);
    const tax = getTaxAmount(taxableAmount);
    const grandTotal = Math.max(0, taxableAmount + shipping + tax);
    return { subtotal, discount, shipping, tax, grandTotal };
  }

  // ── Cart State Mutators ───────────────────────────────────────────────────
  function addToCart(productId, quantity = 1) {
    const prod = state.products.find(p => p.id === productId);
    if (!prod) return;
    if (prod.stock <= 0) {
      alert("This preparation is currently out of stock.");
      return;
    }

    const existing = state.cart.find(item => item.id === productId);
    if (existing) {
      const newQty = existing.quantity + quantity;
      if (newQty > prod.stock) {
        alert(`Only ${prod.stock} units available in the apothecary.`);
        existing.quantity = prod.stock;
      } else {
        existing.quantity = newQty;
      }
    } else {
      state.cart.push({ id: productId, quantity: Math.min(quantity, prod.stock) });
    }

    saveState();
    renderCart();
    openCartDrawer();
  }

  function updateCartQuantity(productId, delta) {
    const item = state.cart.find(i => i.id === productId);
    const prod = state.products.find(p => p.id === productId);
    if (!item || !prod) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      state.cart = state.cart.filter(i => i.id !== productId);
    } else if (item.quantity > prod.stock) {
      item.quantity = prod.stock;
      alert(`Only ${prod.stock} units available in stock.`);
    }

    saveState();
    renderCart();
  }

  function removeFromCart(productId) {
    state.cart = state.cart.filter(i => i.id !== productId);
    saveState();
    renderCart();
  }

  // ── UI Renderers ──────────────────────────────────────────────────────────
  function renderCatalog() {
    const grid = $("#products-grid");
    if (!grid) return;

    let filtered = state.products.filter(p => {
      const matchCat = state.activeCategory === "all" || p.categorySlug === state.activeCategory;
      const matchSearch = state.searchQuery === "" || 
        p.title.toLowerCase().includes(state.searchQuery) ||
        p.description.toLowerCase().includes(state.searchQuery) ||
        p.ingredients.toLowerCase().includes(state.searchQuery);
      return matchCat && matchSearch;
    });

    if (state.sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (state.sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (state.sortBy === "name") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--ink-500);">
          <h3>No botanical formulations found matching your search.</h3>
          <p style="margin-top: 8px;">Try clearing search keywords or selecting another category.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(p => {
      let stockClass = "in-stock";
      let stockText = `In Stock (${p.stock})`;
      if (p.stock <= 0) {
        stockClass = "sold-out";
        stockText = "Batch Sold Out";
      } else if (p.stock <= p.lowStockThreshold) {
        stockClass = "low-stock";
        stockText = `Only ${p.stock} Left`;
      }

      const compareHtml = p.comparePrice ? `<span class="price-compare">$${p.comparePrice.toFixed(2)}</span>` : "";

      return `
        <article class="product-card" data-id="${p.id}">
          <div class="card-img-wrap" onclick="window.ApothecaryStore.openProductModal('${p.id}')">
            <span class="stock-tag ${stockClass}">${stockText}</span>
            <span class="category-tag">${p.category}</span>
            <img src="${p.image}" alt="${p.title}" loading="lazy">
          </div>
          <div class="card-body">
            <h3 class="card-title" onclick="window.ApothecaryStore.openProductModal('${p.id}')">${p.title}</h3>
            <div class="card-size">${p.size} • SKU: ${p.sku}</div>
            <p class="card-desc">${p.description}</p>
            <div class="card-footer">
              <div class="price-box">
                <span class="price-current">$${p.price.toFixed(2)}</span>
                ${compareHtml}
              </div>
              <div class="card-actions">
                <button class="btn-quick-view" onclick="window.ApothecaryStore.openProductModal('${p.id}')" title="Quick View">
                  View
                </button>
                <button class="btn-add-cart" onclick="window.ApothecaryStore.addToCart('${p.id}')" ${p.stock <= 0 ? 'disabled' : ''}>
                  ${p.stock <= 0 ? 'Sold Out' : '+ Add'}
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  function renderCart() {
    const list = $("#cart-items-list");
    const badge = $("#cart-badge");
    const count = getCartCount();

    if (badge) badge.textContent = count;

    if (!list) return;

    if (state.cart.length === 0) {
      list.innerHTML = `<div class="empty-cart-msg">Your apothecary satchel is empty.<br><br>Add handcrafted botanical preparations from our catalog.</div>`;
      $("#cart-subtotal").textContent = "$0.00";
      $("#cart-discount").textContent = "-$0.00";
      $("#cart-shipping").textContent = "$0.00";
      $("#cart-tax").textContent = "$0.00";
      $("#cart-grand-total").textContent = "$0.00";
      return;
    }

    list.innerHTML = state.cart.map(item => {
      const prod = state.products.find(p => p.id === item.id);
      if (!prod) return "";
      const itemTotal = (prod.price * item.quantity).toFixed(2);
      return `
        <div class="cart-item">
          <img src="${prod.image}" class="cart-item-img" alt="${prod.title}">
          <div class="cart-item-details">
            <div class="cart-item-title">${prod.title}</div>
            <div class="cart-item-price">
              $${prod.price.toFixed(2)} each
              ${item.selectedSize ? `<span style="font-size: 10px; color: var(--gold-600); margin-left: 6px;">Size: ${item.selectedSize}</span>` : ''}
              ${item.customText ? `<br><span style="font-size: 10px; color: var(--green-accent);">Custom: "${item.customText.substring(0, 30)}"</span>` : ''}
            </div>
            <div class="cart-qty-ctrl">
              <button class="qty-btn" onclick="window.ApothecaryStore.updateCartQuantity('${prod.id}', -1)">-</button>
              <span class="qty-val">${item.quantity}</span>
              <button class="qty-btn" onclick="window.ApothecaryStore.updateCartQuantity('${prod.id}', 1)">+</button>
              <span style="margin-left: 8px; font-weight: 700; font-size: 0.85rem;">$${itemTotal}</span>
            </div>
          </div>
          <button class="cart-item-remove" onclick="window.ApothecaryStore.removeFromCart('${prod.id}')" title="Remove">✕</button>
        </div>
      `;
    }).join("");

    const totals = getCartTotals();
    $("#cart-subtotal").textContent = `$${totals.subtotal.toFixed(2)}`;
    $("#cart-discount").textContent = `-$${totals.discount.toFixed(2)}`;
    $("#cart-shipping").textContent = totals.shipping === 0 ? "FREE" : `$${totals.shipping.toFixed(2)}`;
    $("#cart-tax").textContent = `$${totals.tax.toFixed(2)}`;
    $("#cart-grand-total").textContent = `$${totals.grandTotal.toFixed(2)}`;
  }

  // ── Drawer & Modals ───────────────────────────────────────────────────────
  function openCartDrawer() {
    const overlay = $("#cart-overlay");
    if (overlay) overlay.classList.add("open");
  }

  function closeCartDrawer() {
    const overlay = $("#cart-overlay");
    if (overlay) overlay.classList.remove("open");
  }

  function openMenuBrochureModal() {
    const m = $("#brochure-modal");
    if (m) m.classList.add("open");
  }

  function closeMenuBrochureModal() {
    const m = $("#brochure-modal");
    if (m) m.classList.remove("open");
  }

  function openProductModal(productId) {
    const prod = state.products.find(p => p.id === productId);
    if (!prod) return;

    const modal = $("#product-modal");
    if (!modal) return;

    $("#modal-prod-img").src = prod.image;
    $("#modal-prod-title").textContent = prod.title;
    $("#modal-prod-sku").textContent = `SKU: ${prod.sku} | ${prod.size}`;
    $("#modal-prod-price").textContent = `$${prod.price.toFixed(2)}`;
    $("#modal-prod-desc").textContent = prod.description;
    $("#modal-prod-ingredients").textContent = prod.ingredients;
    $("#modal-prod-usage").textContent = prod.usage;
    $("#modal-prod-stock").textContent = prod.stock > 0 ? `In Stock: ${prod.stock} units ready for dispatch` : "Currently Sold Out";

    // Size Selector Rendering
    const sizeContainer = $("#modal-size-container");
    if (sizeContainer) {
      if (prod.sizes && prod.sizes.length > 1) {
        modalSelectedSize = prod.sizes[0];
        sizeContainer.innerHTML = `
          <label style="font-size: 0.75rem; text-transform: uppercase; color: var(--gold-600); font-weight: 700; display: block; margin-bottom: 6px;">Select Size:</label>
          <div style="display: flex; gap: 6px; margin-bottom: 12px; flex-wrap: wrap;">
            ${prod.sizes.map((s, idx) => `
              <button type="button" class="btn-tag size-pill ${idx === 0 ? 'active' : ''}" data-size="${s}" onclick="window.ApothecaryStore.setModalSize('${s}')" style="padding: 6px 12px; font-size: 11px;">${s}</button>
            `).join("")}
          </div>
        `;
        sizeContainer.style.display = "block";
      } else {
        sizeContainer.innerHTML = "";
        sizeContainer.style.display = "none";
      }
    }

    // Customization Input Rendering
    const customContainer = $("#modal-custom-container");
    if (customContainer) {
      if (prod.customizable) {
        customContainer.innerHTML = `
          <label style="font-size: 0.75rem; text-transform: uppercase; color: var(--gold-600); font-weight: 700; display: block; margin-bottom: 4px;">Personalization &amp; Custom Scent Notes:</label>
          <input type="text" id="modal-prod-custom-text" class="form-ctrl" placeholder="e.g. Soap preferences (Honey, Lavender, Pine) + gift message" style="margin-bottom: 14px;" />
        `;
        customContainer.style.display = "block";
      } else {
        customContainer.innerHTML = "";
        customContainer.style.display = "none";
      }
    }
    
    const buyBtn = $("#modal-prod-buy-btn");
    buyBtn.disabled = prod.stock <= 0;
    buyBtn.onclick = () => window.ApothecaryStore.addToCartWithOptions(prod.id); /*
      const qtyInput = $("#modal-prod-qty");
      const qty = parseInt(qtyInput ? qtyInput.value : "1", 10) || 1;
      */

    modal.classList.add("open");
  }

  function closeProductModal() {
    const modal = $("#product-modal");
    if (modal) modal.classList.remove("open");
  }

  function openCheckoutModal() {
    if (state.cart.length === 0) {
      alert("Your cart is empty. Please add items before checking out.");
      return;
    }
    closeCartDrawer();
    const modal = $("#checkout-modal");
    if (!modal) return;

    const totals = getCartTotals();
    $("#checkout-subtotal").textContent = `$${totals.subtotal.toFixed(2)}`;
    $("#checkout-shipping").textContent = totals.shipping === 0 ? "FREE" : `$${totals.shipping.toFixed(2)}`;
    $("#checkout-tax").textContent = `$${totals.tax.toFixed(2)}`;
    $("#checkout-grand-total").textContent = `$${totals.grandTotal.toFixed(2)}`;

    modal.classList.add("open");
  }

  function closeCheckoutModal() {
    const modal = $("#checkout-modal");
    if (modal) modal.classList.remove("open");
  }

  // ── Checkout & Order Processing ───────────────────────────────────────────
  function processOrder(paymentMethod = "stripe") {
    const fullName = $("#cust-name")?.value.trim() || "Valued Apothecary Guest";
    const email = $("#cust-email")?.value.trim() || "guest@apothecaryscabinet.com";
    const address = $("#cust-address")?.value.trim() || "100 Artisan Way";
    const city = $("#cust-city")?.value.trim() || "Asheville";
    const stateVal = $("#cust-state")?.value.trim() || "NC";
    const zip = $("#cust-zip")?.value.trim() || "28801";

    if (!fullName || !email) {
      alert("Please provide customer name and email address for order processing.");
      return;
    }

    const totals = getCartTotals();
    const orderNumber = `AC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();

    // Construct Line Items
    const lineItems = state.cart.map(item => {
      const prod = state.products.find(p => p.id === item.id);
      return {
        id: prod.id,
        sku: prod.sku,
        title: prod.title,
        size: item.selectedSize ? `${prod.size} (Size: ${item.selectedSize})` : prod.size,
        selectedSize: item.selectedSize || null,
        customText: item.customText || null,
        price: prod.price,
        quantity: item.quantity,
        total: prod.price * item.quantity
      };
    });

    // Decrement stock
    state.cart.forEach(item => {
      const prod = state.products.find(p => p.id === item.id);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
    });

    // Payment details
    let paymentStatus = "PAID";
    let paymentDesc = "Stripe Credit Card (Direct)";
    if (paymentMethod === "paypal") {
      paymentDesc = "PayPal Smart Payment";
    } else if (paymentMethod === "pickup") {
      paymentStatus = "PENDING PICKUP";
      paymentDesc = "In-Store Payment at Counter";
    }

    const order = {
      orderNumber,
      date: now.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      timestamp: now.toISOString(),
      customer: {
        name: fullName,
        email: email,
        address: address,
        city: city,
        state: stateVal,
        zip: zip,
        country: "USA"
      },
      items: lineItems,
      pricing: totals,
      payment: {
        method: paymentDesc,
        status: paymentStatus,
        transactionId: `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
      },
      notes: "Handcrafted & packaged with organic parchment in Asheville, NC."
    };

    // Save order
    state.orders.unshift(order);
    state.cart = [];
    state.appliedPromo = null;
    saveState();

    // Re-render UI
    renderCatalog();
    renderCart();
    closeCheckoutModal();

    // Open Printable Invoice & Receipt
    showInvoiceModal(order);
  }

  // ── Invoice & Receipt Generator ───────────────────────────────────────────
  function showInvoiceModal(order) {
    const modal = $("#invoice-modal");
    if (!modal) return;

    $("#inv-number").textContent = order.orderNumber;
    $("#inv-date").textContent = order.date;
    $("#inv-status-badge").textContent = `${order.payment.status} • ${order.payment.method}`;
    
    // Customer Info
    $("#inv-cust-name").textContent = order.customer.name;
    $("#inv-cust-email").textContent = order.customer.email;
    $("#inv-cust-address").textContent = `${order.customer.address}, ${order.customer.city}, ${order.customer.state} ${order.customer.zip}`;
    
    // Line items table
    const tbody = $("#inv-items-tbody");
    tbody.innerHTML = order.items.map(item => `
      <tr>
        <td>
          <strong>${item.title}</strong><br>
          <span style="font-size: 0.75rem; color: #666;">SKU: ${item.sku} | ${item.size}</span>
          ${item.selectedSize ? `<br><span style="font-size: 0.72rem; color: var(--gold-600); font-weight: bold;">Size: ${item.selectedSize}</span>` : ''}
          ${item.customText ? `<br><span style="font-size: 0.72rem; color: var(--green-accent); font-style: italic;">Personalized: "${item.customText}"</span>` : ''}
        </td>
        <td class="num">${item.quantity}</td>
        <td class="num">$${item.price.toFixed(2)}</td>
        <td class="num">$${item.total.toFixed(2)}</td>
      </tr>
    `).join("");

    // Totals
    $("#inv-subtotal").textContent = `$${order.pricing.subtotal.toFixed(2)}`;
    $("#inv-discount").textContent = `-$${order.pricing.discount.toFixed(2)}`;
    $("#inv-shipping").textContent = order.pricing.shipping === 0 ? "FREE" : `$${order.pricing.shipping.toFixed(2)}`;
    $("#inv-tax").textContent = `$${order.pricing.tax.toFixed(2)}`;
    $("#inv-grand-total").textContent = `$${order.pricing.grandTotal.toFixed(2)}`;

    modal.classList.add("open");
  }

  function closeInvoiceModal() {
    const modal = $("#invoice-modal");
    if (modal) modal.classList.remove("open");
  }

  function printInvoice() {
    window.print();
  }

  function downloadInvoiceHtml() {
    const sheet = $("#invoice-printable-sheet");
    if (!sheet) return;

    const invoiceNumber = $("#inv-number").textContent;
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice ${invoiceNumber} — The Apothecary's Cabinet</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1b1e1d; max-width: 800px; margin: 0 auto; }
    h2 { font-family: Georgia, serif; color: #14241b; }
    table { width: 100%; border-collapse: collapse; margin: 24px 0; }
    th { background: #f2ece0; text-align: left; padding: 8px 10px; border-bottom: 2px solid #14241b; font-size: 12px; text-transform: uppercase; }
    td { padding: 10px; border-bottom: 1px solid #ddd; font-size: 13px; }
    .num { text-align: right; font-family: monospace; }
    .badge { background: #14241b; color: #d8b056; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 11px; }
  </style>
</head>
<body>
  ${sheet.innerHTML}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `Invoice_${invoiceNumber}.html`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  // ── Orders Ledger Modal ───────────────────────────────────────────────────
  function openOrdersLedger() {
    const modal = $("#orders-ledger-modal");
    if (!modal) return;

    const tbody = $("#orders-ledger-tbody");
    if (state.orders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 30px; color: #777;">No previous customer orders recorded yet.</td></tr>`;
    } else {
      tbody.innerHTML = state.orders.map(o => `
        <tr>
          <td><strong style="font-family: monospace;">${o.orderNumber}</strong></td>
          <td>${o.date}</td>
          <td>${o.customer.name}</td>
          <td>${o.payment.status}</td>
          <td class="num">$${o.pricing.grandTotal.toFixed(2)}</td>
          <td style="text-align: right;">
            <button class="btn-quick-view" onclick="window.ApothecaryStore.viewOrder('${o.orderNumber}')">View Receipt</button>
          </td>
        </tr>
      `).join("");
    }

    modal.classList.add("open");
  }

  function closeOrdersLedger() {
    const modal = $("#orders-ledger-modal");
    if (modal) modal.classList.remove("open");
  }

  function viewOrder(orderNumber) {
    const order = state.orders.find(o => o.orderNumber === orderNumber);
    if (!order) return;
    closeOrdersLedger();
    showInvoiceModal(order);
  }

  // ── Event Bindings & Initialization ───────────────────────────────────────
  function initEvents() {
    // Category Pills
    $$(".cat-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        $$(".cat-pill").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        state.activeCategory = pill.dataset.cat || "all";
        renderCatalog();
      });
    });

    // Search Box
    const search = $("#search-catalog");
    if (search) {
      search.addEventListener("input", (e) => {
        state.searchQuery = e.target.value.toLowerCase().trim();
        renderCatalog();
      });
    }

    // Sort Select
    const sortSelect = $("#sort-catalog");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        state.sortBy = e.target.value;
        renderCatalog();
      });
    }

    // Promo Code Form
    const btnPromo = $("#btn-apply-promo");
    if (btnPromo) {
      btnPromo.addEventListener("click", () => {
        const input = $("#promo-code-input");
        const code = input.value.trim().toUpperCase();
        if (state.config.promoCodes[code]) {
          state.appliedPromo = code;
          alert(`Promo applied: ${state.config.promoCodes[code].label}`);
          renderCart();
        } else {
          alert("Invalid or expired botanical coupon code.");
        }
      });
    }

    // Shipping selection
    $$("input[name='shipping-method']").forEach(radio => {
      radio.addEventListener("change", (e) => {
        state.selectedShippingKey = e.target.value;
        renderCart();
      });
    });

    // Checkout Tab Switchers
    $$(".pay-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        $$(".pay-tab-btn").forEach(b => b.classList.remove("active"));
        $$(".tab-pane").forEach(p => p.classList.remove("active"));
        btn.classList.add("active");
        const targetId = btn.dataset.tab;
        const targetPane = $(`#${targetId}`);
        if (targetPane) targetPane.classList.add("active");
      });
    });

    // Cross-Window PostMessage Listener (for WebStudio synchronization)
    window.addEventListener("message", (e) => {
      if (e.data && e.data.type === "STUDIO_UPDATE_PRODUCTS") {
        state.products = e.data.products;
        saveState();
        renderCatalog();
      } else if (e.data && e.data.type === "STUDIO_UPDATE_CONFIG") {
        state.config = Object.assign(state.config, e.data.config);
        saveState();
        renderCatalog();
        renderCart();
      }
    });
  }

  // ── Public Export ─────────────────────────────────────────────────────────

  // ── Merchant / Herbalist Portal & POS Engine ──────────────────────────────
  let portalState = {
    activeTab: "tab-portal-products",
    ownerPin: localStorage.getItem("apothecary_pin") || "2018",
    editingProductId: null,
    tempImageDataUrl: null,
    posCart: []
  };

  function openOwnerPortal() {
    const enteredPin = prompt("🌿 The Apothecary's Cabinet — Merchant Portal\nEnter your 4-digit Herbalist PIN (Default: 2018):");
    if (!enteredPin) return;

    if (enteredPin !== portalState.ownerPin) {
      alert("Incorrect PIN. Access to Merchant Portal denied.");
      return;
    }

    const modal = $("#owner-portal-modal");
    if (modal) {
      modal.classList.add("open");
      showPortalTab("tab-portal-products");
      renderPortalProducts();
      renderPortalPos();
      renderPortalPromos();
      renderPortalOrders();
    }
  }

  function closeOwnerPortal() {
    const modal = $("#owner-portal-modal");
    if (modal) modal.classList.remove("open");
  }

  function showPortalTab(tabId) {
    portalState.activeTab = tabId;
    $$(".portal-tab-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.tab === tabId));
    $$(".portal-view").forEach(v => v.classList.toggle("active", v.id === tabId));

    if (tabId === "tab-portal-products") renderPortalProducts();
    if (tabId === "tab-portal-pos") renderPortalPos();
    if (tabId === "tab-portal-promos") renderPortalPromos();
    if (tabId === "tab-portal-orders") renderPortalOrders();
    if (tabId === "tab-portal-dropship") renderPortalDropship();
  }

  // ── Product & Soap Management (For the Owner) ────────────────────────────
  function renderPortalProducts() {
    const tbody = $("#portal-products-tbody");
    if (!tbody) return;

    tbody.innerHTML = state.products.map(p => `
      <tr>
        <td><img src="${p.image}" style="width: 44px; height: 44px; object-fit: contain; background: #14241b; border-radius: 4px; padding: 2px;"></td>
        <td>
          <strong>${p.title}</strong><br>
          <span style="font-size: 11px; color: #666;">${p.category} • ${p.size}</span>
        </td>
        <td style="font-family: monospace;">${p.sku}</td>
        <td><strong>$${p.price.toFixed(2)}</strong> ${p.comparePrice ? `<s style="font-size: 11px; color: #888;">$${p.comparePrice.toFixed(2)}</s>` : ''}</td>
        <td>
          <span class="badge" style="background: ${p.stock > p.lowStockThreshold ? '#2e7d4a' : '#b83c2a'}; color: #fff; padding: 2px 6px; border-radius: 3px; font-size: 11px;">
            ${p.stock} in stock
          </span>
          <button onclick="window.ApothecaryStore.quickRestock('${p.id}', 10)" class="btn-tag" style="margin-left: 6px; padding: 2px 6px;" title="Add 10 units">+10</button>
        </td>
        <td style="text-align: right;">
          <button class="btn-tag" onclick="window.ApothecaryStore.editProductModal('${p.id}')">Edit</button>
          <button class="btn-tag danger" onclick="window.ApothecaryStore.deleteProductFromPortal('${p.id}')">✕</button>
        </td>
      </tr>
    `).join("");
  }

  function quickRestock(productId, amount) {
    const prod = state.products.find(p => p.id === productId);
    if (!prod) return;
    prod.stock += amount;
    saveState();
    renderCatalog();
    renderPortalProducts();
    renderPortalPos();
  }

  function openCreateProductForm() {
    portalState.editingProductId = null;
    portalState.tempImageDataUrl = null;

    $("#portal-form-title").textContent = "Add New Botanical Preparation or Soap Bar";
    $("#portal-prod-title").value = "";
    $("#portal-prod-category").value = "Soaps & Bars";
    $("#portal-prod-sku").value = `AC-${Math.floor(100 + Math.random() * 900)}`;
    $("#portal-prod-size").value = "5.5 oz bar";
    $("#portal-prod-price").value = "12.00";
    $("#portal-prod-compare").value = "";
    $("#portal-prod-stock").value = "24";
    $("#portal-prod-desc").value = "";
    $("#portal-prod-ingredients").value = "";
    $("#portal-prod-usage").value = "";
    $("#portal-image-preview").src = "assets/soap.svg";

    const modal = $("#portal-edit-product-modal");
    if (modal) modal.classList.add("open");
  }

  function editProductModal(productId) {
    const prod = state.products.find(p => p.id === productId);
    if (!prod) return;

    portalState.editingProductId = prod.id;
    portalState.tempImageDataUrl = prod.image;

    $("#portal-form-title").textContent = `Edit Formulation: ${prod.title}`;
    $("#portal-prod-title").value = prod.title;
    $("#portal-prod-category").value = prod.category;
    $("#portal-prod-sku").value = prod.sku;
    $("#portal-prod-size").value = prod.size;
    $("#portal-prod-price").value = prod.price;
    $("#portal-prod-compare").value = prod.comparePrice || "";
    $("#portal-prod-stock").value = prod.stock;
    $("#portal-prod-desc").value = prod.description;
    $("#portal-prod-ingredients").value = prod.ingredients;
    $("#portal-prod-usage").value = prod.usage;
    $("#portal-image-preview").src = prod.image;

    const modal = $("#portal-edit-product-modal");
    if (modal) modal.classList.add("open");
  }

  function closeEditProductModal() {
    const modal = $("#portal-edit-product-modal");
    if (modal) modal.classList.remove("open");
  }

  function handleProductPhotoUpload(input) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];

    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        // Compress to compact dimensions (max 480x480) for storage
        const canvas = document.createElement("canvas");
        const maxDim = 480;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height *= maxDim / width;
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width *= maxDim / height;
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const compressed = canvas.toDataURL("image/jpeg", 0.85);
        portalState.tempImageDataUrl = compressed;
        $("#portal-image-preview").src = compressed;
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function setPresetImage(assetPath) {
    portalState.tempImageDataUrl = assetPath;
    $("#portal-image-preview").src = assetPath;
  }

  function saveProductFromPortal() {
    const title = $("#portal-prod-title").value.trim();
    if (!title) {
      alert("Please enter a title for this soap or preparation.");
      return;
    }

    const category = $("#portal-prod-category").value.trim() || "Soaps & Bars";
    const sku = $("#portal-prod-sku").value.trim() || `AC-PR-${Date.now().toString().slice(-4)}`;
    const size = $("#portal-prod-size").value.trim() || "Unit";
    const price = parseFloat($("#portal-prod-price").value) || 12.00;
    const compareVal = $("#portal-prod-compare").value.trim();
    const comparePrice = compareVal ? parseFloat(compareVal) : null;
    const stock = parseInt($("#portal-prod-stock").value, 10) || 0;
    const desc = $("#portal-prod-desc").value.trim();
    const ingredients = $("#portal-prod-ingredients").value.trim();
    const usage = $("#portal-prod-usage").value.trim();
    const image = portalState.tempImageDataUrl || "assets/soap.svg";
    const catSlug = category.toLowerCase().replace(/[^a-z0-9]/g, "");

    if (portalState.editingProductId) {
      // Update existing
      const prod = state.products.find(p => p.id === portalState.editingProductId);
      if (prod) {
        prod.title = title;
        prod.category = category;
        prod.categorySlug = catSlug;
        prod.sku = sku;
        prod.size = size;
        prod.price = price;
        prod.comparePrice = comparePrice;
        prod.stock = stock;
        prod.description = desc;
        prod.ingredients = ingredients;
        prod.usage = usage;
        prod.image = image;
      }
    } else {
      // Create new
      const newProd = {
        id: "prod-" + Date.now(),
        sku,
        title,
        category,
        categorySlug: catSlug,
        size,
        price,
        comparePrice,
        stock,
        lowStockThreshold: 6,
        image,
        description: desc,
        ingredients,
        usage,
        badge: "Handcrafted"
      };
      state.products.unshift(newProd);
    }

    saveState();
    renderCatalog();
    renderPortalProducts();
    renderPortalPos();
    closeEditProductModal();
    alert(`✅ Successfully saved "${title}"!`);
  }

  function deleteProductFromPortal(productId) {
    const prod = state.products.find(p => p.id === productId);
    if (!prod) return;
    if (!confirm(`Delete "${prod.title}" from the apothecary catalog?`)) return;

    state.products = state.products.filter(p => p.id !== productId);
    saveState();
    renderCatalog();
    renderPortalProducts();
    renderPortalPos();
  }

  // ── Counter Point-of-Sale (POS Register) ──────────────────────────────────
  function renderPortalPos() {
    const grid = $("#pos-catalog-grid");
    if (!grid) return;

    grid.innerHTML = state.products.map(p => `
      <div class="pos-card" onclick="window.ApothecaryStore.posAddItem('${p.id}')">
        <img src="${p.image}" alt="${p.title}">
        <div class="pos-card-title">${p.title}</div>
        <div style="font-size: 10px; color: #666; margin-bottom: 2px;">${p.stock} left</div>
        <div class="pos-card-price">$${p.price.toFixed(2)}</div>
      </div>
    `).join("");

    renderPosTicket();
  }

  function posAddItem(productId) {
    const prod = state.products.find(p => p.id === productId);
    if (!prod) return;
    if (prod.stock <= 0) {
      alert("This item has zero stock recorded.");
      return;
    }

    const existing = portalState.posCart.find(i => i.id === productId);
    if (existing) {
      if (existing.quantity >= prod.stock) {
        alert("Maximum stock reached in counter register.");
        return;
      }
      existing.quantity += 1;
    } else {
      portalState.posCart.push({ id: productId, quantity: 1 });
    }

    renderPosTicket();
  }

  function posUpdateQty(productId, delta) {
    const item = portalState.posCart.find(i => i.id === productId);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
      portalState.posCart = portalState.posCart.filter(i => i.id !== productId);
    }
    renderPosTicket();
  }

  function renderPosTicket() {
    const list = $("#pos-ticket-items");
    if (!list) return;

    if (portalState.posCart.length === 0) {
      list.innerHTML = `<div style="text-align: center; color: #888; padding: 30px 10px; font-style: italic;">Tap any product to add to register ticket</div>`;
      $("#pos-total").textContent = "$0.00";
      return;
    }

    let subtotal = 0;
    list.innerHTML = portalState.posCart.map(item => {
      const prod = state.products.find(p => p.id === item.id);
      if (!prod) return "";
      const lineTotal = prod.price * item.quantity;
      subtotal += lineTotal;
      return `
        <div class="pos-ticket-row">
          <div style="flex: 1; padding-right: 6px;">
            <strong>${prod.title}</strong><br>
            <span style="font-size: 11px; color: #666;">$${prod.price.toFixed(2)} each</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <button class="qty-btn" onclick="window.ApothecaryStore.posUpdateQty('${prod.id}', -1)">-</button>
            <span style="font-weight: bold; width: 16px; text-align: center;">${item.quantity}</span>
            <button class="qty-btn" onclick="window.ApothecaryStore.posUpdateQty('${prod.id}', 1)">+</button>
            <span style="font-weight: bold; min-width: 50px; text-align: right;">$${lineTotal.toFixed(2)}</span>
          </div>
        </div>
      `;
    }).join("");

    const tax = subtotal * state.config.taxRate;
    const total = subtotal + tax;

    $("#pos-subtotal").textContent = `$${subtotal.toFixed(2)}`;
    $("#pos-tax").textContent = `$${tax.toFixed(2)}`;
    $("#pos-total").textContent = `$${total.toFixed(2)}`;
  }

  function posCheckout(paymentMethod = "Cash") {
    if (portalState.posCart.length === 0) {
      alert("Ticket is empty.");
      return;
    }

    let subtotal = 0;
    const lineItems = portalState.posCart.map(item => {
      const prod = state.products.find(p => p.id === item.id);
      const lineTotal = prod.price * item.quantity;
      subtotal += lineTotal;
      // deduct stock
      prod.stock = Math.max(0, prod.stock - item.quantity);
      return {
        id: prod.id,
        sku: prod.sku,
        title: prod.title,
        size: item.selectedSize ? `${prod.size} (Size: ${item.selectedSize})` : prod.size,
        selectedSize: item.selectedSize || null,
        customText: item.customText || null,
        price: prod.price,
        quantity: item.quantity,
        total: lineTotal
      };
    });

    const tax = subtotal * state.config.taxRate;
    const grandTotal = subtotal + tax;
    const now = new Date();
    const orderNumber = `POS-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = {
      orderNumber,
      date: now.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      timestamp: now.toISOString(),
      customer: {
        name: "Apothecary Counter Walk-In",
        email: "storefront-pos@apothecaryscabinet.com",
        address: "Storefront Counter, Suite B",
        city: "Asheville",
        state: "NC",
        zip: "28801",
        country: "USA"
      },
      items: lineItems,
      pricing: {
        subtotal,
        discount: 0,
        shipping: 0,
        tax,
        grandTotal
      },
      payment: {
        method: `In-Store ${paymentMethod}`,
        status: "PAID",
        transactionId: `POS-${Date.now().toString().slice(-6)}`
      },
      notes: "Handcrafted in-store sale. Thank you for visiting our apothecary."
    };

    state.orders.unshift(order);
    portalState.posCart = [];
    saveState();

    renderCatalog();
    renderPortalProducts();
    renderPortalPos();
    renderPortalOrders();

    // Show receipt
    showInvoiceModal(order);
  }

  // ── Promotions & Sales Management ─────────────────────────────────────────
  function renderPortalPromos() {
    const list = $("#portal-promos-tbody");
    if (!list) return;

    const promoEntries = Object.entries(state.config.promoCodes);
    list.innerHTML = promoEntries.map(([code, p]) => `
      <tr>
        <td><strong style="font-family: monospace; color: var(--moss-900);">${code}</strong></td>
        <td>${p.label}</td>
        <td>${p.type === 'percent' ? p.value + '% Off' : 'Free Shipping'}</td>
        <td style="text-align: right;">
          <button class="btn-tag danger" onclick="window.ApothecaryStore.deletePromoCode('${code}')">Delete</button>
        </td>
      </tr>
    `).join("");

    // Announcement text
    const bannerInput = $("#portal-announcement-input");
    if (bannerInput && state.config.announcement) {
      bannerInput.value = state.config.announcement;
    }
  }

  function saveAnnouncementFromPortal() {
    const text = $("#portal-announcement-input").value.trim();
    if (!text) return;
    state.config.announcement = text;
    saveState();

    // Update banner on page
    const noticeEl = $(".top-notice span:first-child");
    if (noticeEl) noticeEl.innerHTML = `🌿 ${text}`;
    alert("Live store announcement banner updated!");
  }

  function addPromoCodeFromPortal() {
    const code = $("#new-promo-code").value.trim().toUpperCase();
    const type = $("#new-promo-type").value;
    const value = parseFloat($("#new-promo-val").value) || 10;
    const label = $("#new-promo-label").value.trim() || `${code} Special`;

    if (!code) {
      alert("Please provide a promo code name.");
      return;
    }

    state.config.promoCodes[code] = {
      type,
      value,
      label
    };

    saveState();
    renderPortalPromos();
    $("#new-promo-code").value = "";
    $("#new-promo-label").value = "";
    alert(`Promo code ${code} activated! Customers can now use it at checkout.`);
  }

  function deletePromoCode(code) {
    delete state.config.promoCodes[code];
    saveState();
    renderPortalPromos();
  }

  // ── Orders & Invoices in Portal ───────────────────────────────────────────
  function renderPortalOrders() {
    const tbody = $("#portal-orders-tbody");
    if (!tbody) return;

    if (state.orders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #777; padding: 24px;">No customer orders placed yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = state.orders.map(o => `
      <tr>
        <td><strong style="font-family: monospace;">${o.orderNumber}</strong></td>
        <td>${o.date}</td>
        <td>${o.customer.name}</td>
        <td><span class="badge" style="background: #14241b; color: #d8b056; padding: 2px 6px; border-radius: 3px; font-size: 11px;">${o.payment.status}</span></td>
        <td style="font-weight: bold;">$${o.pricing.grandTotal.toFixed(2)}</td>
        <td style="text-align: right;">
          <button class="btn-tag" onclick="window.ApothecaryStore.viewOrder('${o.orderNumber}')">View Receipt</button>
        </td>
      </tr>
    `).join("");
  }

  // ── Backup & PIN Settings ─────────────────────────────────────────────────
  function downloadCatalogBackup() {
    const data = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      products: state.products,
      config: state.config,
      orders: state.orders
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `Apothecary_Cabinet_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function restoreCatalogBackup(input) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const data = JSON.parse(e.target.result);
        if (data.products) state.products = data.products;
        if (data.config) state.config = data.config;
        if (data.orders) state.orders = data.orders;
        saveState();
        renderCatalog();
        renderPortalProducts();
        renderPortalPos();
        renderPortalPromos();
        renderPortalOrders();
        alert("✅ Inventory and settings successfully restored from backup!");
      } catch (err) {
        alert("Invalid backup file: " + err.message);
      }
    };
    reader.readAsText(file);
  }

  function changeOwnerPin() {
    const current = prompt("Enter current PIN:");
    if (current !== portalState.ownerPin) {
      alert("Current PIN does not match.");
      return;
    }
    const newPin = prompt("Enter new 4-digit PIN:");
    if (!newPin || newPin.length < 4) {
      alert("PIN must be at least 4 digits.");
      return;
    }
    portalState.ownerPin = newPin;
    localStorage.setItem("apothecary_pin", newPin);
    alert("✅ Owner PIN updated successfully!");
  }

  window.ApothecaryStore = {
    addToCart,
    updateCartQuantity,
    removeFromCart,
    openCartDrawer,
    closeCartDrawer,
    openMenuBrochureModal,
    closeMenuBrochureModal,
    openProductModal,
    closeProductModal,
    openCheckoutModal,
    closeCheckoutModal,
    processOrder,
    showInvoiceModal,
    closeInvoiceModal,
    printInvoice,
    downloadInvoiceHtml,
    openOrdersLedger,
    closeOrdersLedger,
    viewOrder,
    openOwnerPortal,
    closeOwnerPortal,
    showPortalTab,
    openCreateProductForm,
    editProductModal,
    closeEditProductModal,
    saveProductFromPortal,
    deleteProductFromPortal,
    quickRestock,
    handleProductPhotoUpload,
    setPresetImage,
    posAddItem,
    posUpdateQty,
    posCheckout,
    addPromoCodeFromPortal,
    deletePromoCode,
    saveAnnouncementFromPortal,
    downloadCatalogBackup,
    restoreCatalogBackup,
    changeOwnerPin,
    getState: () => state,
    setProducts: (newProds) => { state.products = newProds; saveState(); renderCatalog(); }
  };

  document.addEventListener("DOMContentLoaded", () => {
    initEvents();
    renderCatalog();
    renderCart();
    notifyStudioSync();
  });
})();
