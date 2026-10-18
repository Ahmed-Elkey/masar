import type { Landmark, Project, ViewState } from "./types";

/**
 * PROJECTS — real Egyptian residential developments.
 *
 * Coordinates are extracted from two independent Egyptian property databases
 * (`ahlanhomes.com/map`, 801 compounds; `doestate.co/map`, 454 compounds). Where
 * both cover the same project the GPS pins match exactly, which is how they were
 * cross-validated. `areaApprox: true` means the pin is an area centre rather
 * than a verified site.
 */
export const PROJECTS: Project[] = [
  {
    id: "il-bosco",
    name: { en: "Il Bosco", ar: "البوسكو" },
    developer: "Misr Italia",
    area: { en: "New Capital", ar: "العاصمة الإدارية" },
    lng: 31.730406, lat: 29.975823, dx: 46, dy: -64,
    status: "underConstruction",
    description: {
      en: "A Misr Italia residential community in the New Administrative Capital, with landscaped open spaces, apartments and villas.",
      ar: "مجتمع سكني من مصر إيطاليا في العاصمة الإدارية الجديدة، يضم مساحات خضراء وشققًا وفيلات.",
    },
    amenities: {
      en: ["Villas and twin houses", "Green River views", "Landscaped gardens", "Gated security", "Sports club"],
      ar: ["فيلات وتوين هاوس", "إطلالات على النهر الأخضر", "حدائق منسقة", "أمن وبوابات", "نادي رياضي"],
    },
    heroZoom: 16, vr: true,
    url: "https://www.doestate.co/projects/il-bosco-new-capital",
    source: "doestate.co",
  },
  {
    id: "jade-park",
    name: { en: "Jade Park", ar: "جاد بارك" },
    developer: "City Edge",
    area: { en: "New Capital", ar: "العاصمة الإدارية" },
    lng: 31.688681, lat: 30.021526, dx: -54, dy: -58,
    status: "underConstruction",
    description: {
      en: "A mid-rise residential compound of apartments and duplexes arranged around a large central park in the New Administrative Capital.",
      ar: "كمبوند سكني متوسط الارتفاع من الشقق والدوبلكس حول حديقة مركزية كبيرة في العاصمة الإدارية الجديدة.",
    },
    amenities: {
      en: ["Central park", "Swimming pool", "Gym", "Retail strip", "24/7 security"],
      ar: ["حديقة مركزية", "حمام سباحة", "صالة رياضية", "منطقة تجارية", "أمن ٢٤ ساعة"],
    },
    heroZoom: 17,
    url: "https://www.ahlanhomes.com/projects/jade-park-new-capital-city",
    source: "ahlanhomes.com",
  },
  {
    id: "scenario",
    name: { en: "Scenario", ar: "سيناريو" },
    developer: "Akam Developments",
    area: { en: "New Capital", ar: "العاصمة الإدارية" },
    lng: 31.713316, lat: 29.967453, dx: 50, dy: -58,
    status: "underConstruction",
    description: {
      en: "A 39-feddan mixed-use residential compound offering apartments, hotel units, duplexes and penthouses.",
      ar: "كومباوند سكني متعدد الاستخدامات على 39 فدان، يشمل شققاً ووحدات فندقية ودوبلكس وبنتهاوس.",
    },
    amenities: {
      en: ["Swimming pools", "Fitness centre", "Commercial area", "24/7 security", "Kids' play areas"],
      ar: ["حمامات سباحة", "مركز لياقة", "منطقة تجارية", "أمن ٢٤ ساعة", "مناطق لعب للأطفال"],
    },
    heroZoom: 17,
    url: "https://www.ahlanhomes.com/projects/scenario-new-capital-city",
    source: "ahlanhomes.com",
  },
  {
    id: "scene-7",
    name: { en: "Scene 7", ar: "سيين ٧" },
    developer: "Akam Developments",
    area: { en: "New Capital", ar: "العاصمة الإدارية" },
    lng: 31.705841, lat: 29.960239, dx: -48, dy: 62,
    status: "underConstruction",
    description: {
      en: "Billed as the first sports-focused compound in the New Capital, built on about 40 acres with 11 sports academies across 48 residential buildings.",
      ar: "أول كومباوند رياضي في العاصمة، على مساحة 40 فدان تقريباً، ويضم 11 أكاديمية رياضية موزعة على 48 مبنى سكنياً.",
    },
    amenities: {
      en: ["11 sports academies", "Swimming pools", "Gym and spa", "Commercial street", "Covered parking"],
      ar: ["11 أكاديمية رياضية", "حمامات سباحة", "جيم وسبا", "شارع تجاري", "جراج مغطى"],
    },
    heroZoom: 17,
    url: "https://www.ahlanhomes.com/projects/scene-7-new-capital-city",
    source: "ahlanhomes.com",
  },
  {
    id: "oia",
    name: { en: "OIA Compound", ar: "أويا" },
    developer: "Edge Holding",
    area: { en: "New Capital", ar: "العاصمة الإدارية" },
    lng: 31.706133, lat: 29.944929, dx: 54, dy: -56,
    status: "underConstruction",
    description: {
      en: "A 30-acre residential compound with apartments and penthouses starting from 122 sqm.",
      ar: "كومباوند سكني على 30 فدان، شقق وبنتهاوس تبدأ من 122 متر مربع.",
    },
    amenities: {
      en: ["Swimming pool", "Gym", "Landscaped greens", "Retail", "Gated security"],
      ar: ["حمام سباحة", "صالة رياضية", "مساحات خضراء", "محلات تجارية", "أمن وبوابات"],
    },
    heroZoom: 17,
    url: "https://www.ahlanhomes.com/projects/oia-compound-new-capital-city",
    source: "ahlanhomes.com",
  },
  {
    id: "vinci",
    name: { en: "Vinci", ar: "فينشي" },
    developer: "Misr Italia",
    area: { en: "New Capital", ar: "العاصمة الإدارية" },
    lng: 31.706273, lat: 29.95086, dx: -52, dy: 60,
    status: "underConstruction",
    description: {
      en: "A residential development by Misr Italia delivered in phases with apartment units.",
      ar: "تطوير سكني من ميسر إيطاليا، يُسلَّم على مراحل، ويضم وحدات شقق.",
    },
    amenities: {
      en: ["Swimming pool", "Gym", "Green spaces", "Retail", "Security"],
      ar: ["حمام سباحة", "صالة رياضية", "مساحات خضراء", "محلات تجارية", "أمان"],
    },
    heroZoom: 17,
    url: "https://www.ahlanhomes.com/projects/vinci-new-capital-city",
    source: "ahlanhomes.com",
  },
  {
    id: "the-greens",
    name: { en: "The Greens", ar: "ذا جرينز" },
    developer: "Mountain View",
    area: { en: "New Capital", ar: "العاصمة الإدارية" },
    lng: 31.636561, lat: 29.958714, dx: 50, dy: -60,
    status: "underConstruction",
    description: {
      en: "A green-focused residential compound built around extensive landscaping and mature planting.",
      ar: "كومباوند سكني يركز على المساحات الخضراء والتنسيق الكامل.",
    },
    amenities: {
      en: ["Landscaped gardens", "Swimming pool", "Gym", "Children's areas", "Gated security"],
      ar: ["حدائق منسقة", "حمام سباحة", "صالة رياضية", "مناطق للأطفال", "أمن وبوابات"],
    },
    heroZoom: 16,
    url: "https://www.ahlanhomes.com/projects/the-greens-new-capital-city",
    source: "ahlanhomes.com",
  },
  {
    id: "beverly-hills",
    name: { en: "Beverly Hills", ar: "بيفرلي هيلز" },
    developer: "SODIC",
    area: { en: "Sheikh Zayed", ar: "الشيخ زايد" },
    lng: 30.948817, lat: 30.061771, dx: -56, dy: -56,
    status: "delivered",
    description: {
      en: "One of Sheikh Zayed City's first and best-established gated compounds, now largely built out and handed over.",
      ar: "من أول وأشهر الكومبوندات في الشيخ زايد، تم بناؤه وتسليمه بالكامل تقريباً.",
    },
    amenities: {
      en: ["Swimming pools", "Gym", "Clubhouse", "Retail strip", "24/7 gated security"],
      ar: ["حمامات سباحة", "صالة رياضية", "نادي اجتماعي", "منطقة تجارية", "أمن وبوابات ٢٤ ساعة"],
    },
    heroZoom: 17,
    url: "https://www.doestate.co/projects/beverly-hills",
    source: "doestate.co",
  },
  {
    id: "zed",
    name: { en: "ZED", ar: "زيد" },
    developer: "Ora Developers",
    area: { en: "Sheikh Zayed", ar: "الشيخ زايد" },
    lng: 30.996967, lat: 30.045085, dx: 54, dy: -58,
    status: "underConstruction",
    description: {
      en: "Ora Developers' large Sheikh Zayed master-planned community of apartments and villas built around the ZED Park district.",
      ar: "مجتمع مخطط شامل كبير في الشيخ زايد من أورا، من شقق وفيلات حول منطقة زيد بارك.",
    },
    amenities: {
      en: ["ZED Park", "Swimming pools", "Gym", "Sports facilities", "Retail and dining"],
      ar: ["حديقة زيد بارك", "حمامات سباحة", "صالة رياضية", "منشآت رياضية", "مطاعم ومتاجر"],
    },
    heroZoom: 15,
    url: "https://www.doestate.co/projects/zed",
    source: "doestate.co",
  },
  {
    id: "205-towers",
    name: { en: "205 Towers", ar: "٢٠٥ تاورز" },
    developer: "Arkan Palm",
    area: { en: "Sheikh Zayed", ar: "الشيخ زايد" },
    lng: 30.993213, lat: 30.0137746, dx: -52, dy: 60,
    status: "underConstruction",
    description: {
      en: "A mixed-use tower development on the 205-feddan Sheikh Zayed plot, combining residences with offices and retail.",
      ar: "تطوير أبراج متعدد الاستخدامات على أرض الشيخ زايد مساحة 205 فدان، يجمع بين السكن والمكاتب والتجزئة.",
    },
    amenities: {
      en: ["Tower residences", "Office space", "Retail podium", "Gym", "Concierge"],
      ar: ["وحدات سكنية في الأبراج", "مساحات مكتبية", "تجزئة", "صالة رياضية", "كونسيرج"],
    },
    heroZoom: 17,
    url: "https://www.ahlanhomes.com/projects/205-towers-el-sheikh-zayed",
    source: "ahlanhomes.com",
  },
  {
    id: "ivoire-west",
    name: { en: "Ivoire West", ar: "ايفورى ويست" },
    developer: "PRE Group",
    area: { en: "Sheikh Zayed", ar: "الشيخ زايد" },
    lng: 30.975711, lat: 30.062751, dx: 52, dy: -60,
    status: "underConstruction",
    description: {
      en: "A large residential compound by PRE Group offering villas and apartments across roughly 200–600 sqm.",
      ar: "كومباوند سكني كبير من PRE Group، فيلات وشقق بمساحات تقارب 200 إلى 600 متر مربع.",
    },
    amenities: {
      en: ["Villas and apartments", "Swimming pools", "Gym and spa", "Clubhouse", "Green landscapes"],
      ar: ["فيلات وشقق", "حمامات سباحة", "جيم وسبا", "نادي اجتماعي", "مساحات خضراء"],
    },
    heroZoom: 16,
    url: "https://www.ahlanhomes.com/projects/ivoire-west-el-sheikh-zayed",
    source: "ahlanhomes.com",
  },
  {
    id: "al-karma-kay",
    name: { en: "Al Karma Kay", ar: "الكرمة كاي" },
    developer: "AlKarma",
    area: { en: "Sheikh Zayed", ar: "الشيخ زايد" },
    lng: 31.010068, lat: 30.047091, dx: -54, dy: 58,
    status: "underConstruction",
    description: {
      en: "A multi-phase residential compound on the Sheikh Zayed / 6th of October border with villas and apartments.",
      ar: "كومباوند سكني على مراحل على الحدود بين الشيخ زايد والسادس من أكتوبر، بفيلات وشقق.",
    },
    amenities: {
      en: ["Swimming pools", "Gym", "Landscaped gardens", "Retail outlets", "Gated security"],
      ar: ["حمامات سباحة", "صالة رياضية", "حدائق منسقة", "محلات تجارية", "أمن وبوابات"],
    },
    heroZoom: 17,
    url: "https://www.ahlanhomes.com/projects/al-karma-kay-el-sheikh-zayed",
    source: "ahlanhomes.com",
  },
  {
    id: "garden-lakes",
    name: { en: "Garden Lakes", ar: "جاردن ليكس" },
    developer: "Hyde Park",
    area: { en: "6th October", ar: "السادس من أكتوبر" },
    lng: 31.029505, lat: 29.98687, dx: 50, dy: -56,
    status: "underConstruction",
    description: {
      en: "A Hyde Park residential compound in central 6th of October organised around man-made lakes and green spaces.",
      ar: "كومباوند هاي بارك في قلب السادس من أكتوبر، منظم حول بحيرات صناعية ومساحات خضراء.",
    },
    amenities: {
      en: ["Artificial lakes", "Swimming pools", "Gym", "Kids' club", "Retail and schools"],
      ar: ["بحيرات صناعية", "حمامات سباحة", "صالة رياضية", "نادي أطفال", "محلات ومدارس"],
    },
    heroZoom: 16,
    url: "https://www.ahlanhomes.com/projects/garden-lakes-6th-of-october-city",
    source: "ahlanhomes.com",
  },
  {
    id: "club-park",
    name: { en: "Club Park", ar: "كلوب بارك" },
    developer: "Mountain View",
    area: { en: "6th October", ar: "السادس من أكتوبر" },
    lng: 30.930196, lat: 29.998281, dx: -50, dy: 60,
    status: "underConstruction",
    description: {
      en: "A phase of Mountain View's 470-acre iCity October mega-project, themed around club and park amenities.",
      ar: "إحدى مراحل مشروع آي سيتي أكتوبر العملاق من ماونتن فيو على 470 فدان، بمحور النادي والحدائق.",
    },
    amenities: {
      en: ["Large park areas", "Swimming pools", "Gym", "Sports club", "Gated security"],
      ar: ["حدائق واسعة", "حمامات سباحة", "صالة رياضية", "نادٍ رياضي", "أمن وبوابات"],
    },
    heroZoom: 15,
    url: "https://www.ahlanhomes.com/projects/club-park-icity-october-northern-expansion-6th-of-october-city",
    source: "ahlanhomes.com",
  },
  {
    id: "mivida",
    name: { en: "Mivida", ar: "ميفيدا" },
    developer: "Emaar Misr",
    area: { en: "New Cairo", ar: "القاهرة الجديدة" },
    lng: 31.538679, lat: 30.007221, dx: 54, dy: -58,
    status: "delivered",
    description: {
      en: "An integrated Emaar Misr community in New Cairo, combining homes, green spaces, retail and business destinations.",
      ar: "مجتمع متكامل من إعمار مصر في القاهرة الجديدة، يجمع السكن والمساحات الخضراء ووجهات التسوق والأعمال.",
    },
    amenities: {
      en: ["Swimming pools", "Gym and spa", "Retail district", "Healthcare district", "Parks and schools"],
      ar: ["حمامات سباحة", "جيم وسبا", "منطقة تجارية", "منطقة خدمات طبية", "حدائق ومدارس"],
    },
    heroZoom: 14,
    url: "https://www.doestate.co/projects/mivida",
    source: "doestate.co",
  },
  {
    id: "city-gate",
    name: { en: "City Gate", ar: "سيتى جات" },
    developer: "Qatari Diar",
    area: { en: "New Cairo", ar: "القاهرة الجديدة" },
    lng: 31.572464, lat: 30.009659, dx: -52, dy: 58,
    status: "underConstruction",
    description: {
      en: "A Qatari Diar master-planned mixed-use development combining residences, offices and a business district.",
      ar: "تطوير متعدد الاستخدامات مخطط شامل من قطري ديار، يجمع السكن والمكاتب ومنطقة أعمال.",
    },
    amenities: {
      en: ["Business district", "Swimming pools", "Gym", "Retail and restaurants", "Gated security"],
      ar: ["منطقة أعمال", "حمامات سباحة", "صالة رياضية", "مطاعم ومتاجر", "أمن وبوابات"],
    },
    heroZoom: 16,
    url: "https://www.doestate.co/projects/city-gate",
    source: "doestate.co",
  },
  {
    id: "icity-new-cairo",
    name: { en: "iCity New Cairo", ar: "آي سيتي القاهرة الجديدة" },
    developer: "Mountain View",
    area: { en: "New Cairo", ar: "القاهرة الجديدة" },
    lng: 31.5926, lat: 30.069635, dx: 50, dy: -58,
    status: "underConstruction",
    description: {
      en: "A large Fifth Settlement community built around man-made lagoons and a beach park, with villas, apartments and offices.",
      ar: "مجتمع كبير في التجمع الخامس حول بحيرات صناعية وحديقة شاطئية، بفيلات وشقق ومكاتب.",
    },
    amenities: {
      en: ["Lagoons and beach park", "Swimming pools", "Gym", "Offices and retail", "International schools"],
      ar: ["بحيرات وحديقة شاطئية", "حمامات سباحة", "صالة رياضية", "مكاتب وتجزئة", "مدارس دولية"],
    },
    heroZoom: 14,
    url: "https://www.ahlanhomes.com/projects/mountain-view-icity-new-cairo",
    source: "ahlanhomes.com",
  },
  {
    id: "hacienda-bay",
    name: { en: "Hacienda Bay", ar: "هاسيندا باي" },
    developer: "Palm Hills",
    area: { en: "North Coast", ar: "الساحل الشمالي" },
    lng: 28.791485, lat: 30.955875, dx: 52, dy: -54,
    status: "delivered",
    description: {
      en: "Palm Hills' established North Coast resort community at Sidi Abdel Rahman with delivered villa phases and beach-front amenities.",
      ar: "مجموعة سياحية راسخة في الساحل الشمالي بسيدي عبد الرحمن بمراحل فيلات مسلّمة ومرافق على البحر.",
    },
    amenities: {
      en: ["Private beach", "Swimming pools", "Water sports", "Commercial street", "Resort security"],
      ar: ["شاطئ خاص", "حمامات سباحة", "رياضات مائية", "شارع تجاري", "أمن على مدار الساعة"],
    },
    heroZoom: 16, vr: true,
    url: "https://www.ahlanhomes.com/projects/hacienda-bay-sidi-abdel-rahman-north-coast-sahel",
    source: "ahlanhomes.com",
  },
  {
    id: "hacienda-ras-el-hekma",
    name: { en: "Hacienda Ras El Hekma", ar: "هاسيندا رأس الحكمة" },
    developer: "Palm Hills",
    area: { en: "North Coast", ar: "الساحل الشمالي" },
    lng: 27.678436, lat: 31.172013, dx: 50, dy: -56,
    status: "underConstruction",
    description: {
      en: "A large Palm Hills resort development on the west Ras El Hekma coastline, among the newest North Coast masterplans.",
      ar: "تطوير سياحي كبير من بالم هيلز على ساحل رأس الحكمة الغربي، ضمن أحدث مخططات الساحل الشمالي.",
    },
    amenities: {
      en: ["Beach frontage", "Swimming pools", "Water activities", "Resort retail", "Gated access"],
      ar: ["واجهة بحرية", "حمامات سباحة", "أنشطة مائية", "تجزئة داخل المنتجع", "دخول منظم"],

    },
    heroZoom: 16,
    url: "https://www.ahlanhomes.com/projects/hacienda-ras-el-hekma-north-coast-sahel",
    source: "ahlanhomes.com",
  },
  {
    id: "fouka-bay",
    name: { en: "Fouka Bay", ar: "فوكا باي" },
    developer: "Tatweer Misr",
    area: { en: "North Coast", ar: "الساحل الشمالي" },
    lng: 27.937783, lat: 31.094781, dx: -50, dy: 58,
    status: "underConstruction",
    description: {
      en: "A Tatweer Misr North Coast development on a private bay with villas, chalets and residences around sheltered water.",
      ar: "تطوير من تطوير مصر على خليج خاص في الساحل الشمالي، بفيلات وشاليهات ووحدات سكنية حول مياه محمية.",
    },
    amenities: {
      en: ["Private bay", "Swimming pools", "Water sports", "Beach club", "Resort security"],
      ar: ["خليج خاص", "حمامات سباحة", "رياضات مائية", "نادي شاطئ", "أمن المنتجع"],
    },
    heroZoom: 16, vr: true,
    url: "https://www.ahlanhomes.com/projects/fouka-bay-ras-el-hekma-north-coast-sahel",
    source: "ahlanhomes.com",
  },
  {
    id: "the-nines",
    name: { en: "The Nines", ar: "ذا ناينز" },
    developer: "Orascom",
    area: { en: "El Gouna", ar: "الجونة" },
    lng: 33.657478, lat: 27.422067, dx: 52, dy: -54,
    status: "underConstruction",
    description: {
      en: "An Orascom Development Egypt residential community within El Gouna, one of the Red Sea's best-established resort towns.",
      ar: "مجتمع سكني من أوراسكوم داخل الجونة، إحدى أرقى البلدات السياحية البحر الأحمر.",
    },
    amenities: {
      en: ["Marina access", "Beach clubs", "Swimming pools", "Golf nearby", "24/7 resort security"],
      ar: ["إطلالة على المارينا", "أندية شاطئية", "حمامات سباحة", "جولف قريب", "أمن المنتجع ٢٤ ساعة"],
    },
    heroZoom: 16,
    url: "https://www.ahlanhomes.com/projects/the-nines-el-gouna",
    source: "ahlanhomes.com",
  },
  {
    id: "blanca",
    name: { en: "Blanca", ar: "بلانكا" },
    developer: "Soma Bay",
    area: { en: "Soma Bay", ar: "سوما باي" },
    lng: 33.97658, lat: 26.859673, dx: -50, dy: 56,
    status: "underConstruction",
    description: {
      en: "A residential development inside Somabay, the integrated Red Sea destination between Hurghada and Safaga.",
      ar: "تطوير سكني داخل سوما باي، الوجهة المتكاملة على البحر الأحمر بين الغردقة وسفاجا.",
    },
    amenities: {
      en: ["Private beach", "Marina and yachting", "Golf courses", "Swimming pools", "Resort services"],
      ar: ["شاطئ خاص", "مارينا وإبحار", "ملاعب جولف", "حمامات سباحة", "خدمات المنتجع"],
    },
    heroZoom: 16,
    url: "https://www.ahlanhomes.com/projects/blanca-somabay",
    source: "ahlanhomes.com",
  },
  {
    id: "eclat-port-said",
    name: { en: "Eclat Port Said", ar: "إيكلا بورسعيد" },
    developer: "New Plan",
    area: { en: "Port Said", ar: "بورسعيد" },
    lng: 32.32, lat: 31.26, dx: 0, dy: 0, areaApprox: true,
    status: "underConstruction",
    description: {
      en: "A seaside residential community on El-Shaheed Atef El-Sadat Street in Port Said, with chalets, bungalows and serviced apartments.",
      ar: "مجتمع سكني على البحر في شارع الشهيد عاطف السادات ببورسعيد، يضم شاليهات وبانجلو وشققًا فندقية.",
    },
    amenities: {
      en: ["Swimming pool", "Gym", "Hotel services", "Retail", "24/7 security"],
      ar: ["حمام سباحة", "صالة رياضية", "خدمات فندقية", "محلات تجارية", "أمن ٢٤ ساعة"],
    },
    heroZoom: 16,
    url: "https://newplandevelopments.com/projects/eclat-residence",
    source: "realestate.eg",
  },
];

/**
 * LANDMARKS — reference points in Greater Cairo. Not part of the Dubai design;
 * hidden by default and toggled from the toolbar.
 * dx/dy = pixel offset of the dark bubble from the map point.
 */
export const LANDMARKS: Landmark[] = [
  { id: "pyramids", name: { en: "Pyramids of Giza", ar: "أهرامات الجيزة" }, lng: 31.1342, lat: 29.9792, dx: -70, dy: -70, icon: "pyramid" },
  { id: "gem", name: { en: "Grand Egyptian Museum", ar: "المتحف المصري الكبير" }, lng: 31.119, lat: 29.9942, dx: -80, dy: 40, icon: "museum" },
  { id: "cairo-tower", name: { en: "Cairo Tower", ar: "برج القاهرة" }, lng: 31.2243, lat: 30.0459, dx: -80, dy: -50, icon: "tower" },
  { id: "citadel", name: { en: "Citadel of Saladin", ar: "قلعة صلاح الدين" }, lng: 31.2599, lat: 30.0287, dx: 60, dy: 60, icon: "citadel" },
  { id: "airport", name: { en: "Cairo International Airport", ar: "مطار القاهرة الدولي" }, lng: 31.4056, lat: 30.1219, dx: 60, dy: -60, icon: "plane" },
  { id: "festival-city", name: { en: "Cairo Festival City", ar: "كايرو فيستيفال سيتي" }, lng: 31.4083, lat: 30.0296, dx: 70, dy: 50, icon: "mall" },
];

/** Where the map opens before a project is picked: the Greater Cairo cluster. */
export const MAP_CENTER: [number, number] = [31.38, 30.035];

export const DEFAULT_VIEW: ViewState = { center: MAP_CENTER, zoom: 9.8, pitch: 35, bearing: -20 };

/**
 * Camera used when flying to a project. Zoom is set so the outermost 5 km
 * ring still fits on screen, and `flyTo` is offset by half the card width so
 * the project lands in the middle of the *visible* map, not the viewport.
 */
export const PROJECT_VIEW: ViewState = { center: MAP_CENTER, zoom: 13, pitch: 58, bearing: -20 };

/** Half the project card width (384) — used to offset the flyTo target. */
export const CARD_HALF_WIDTH = 192;

/** Distance rings drawn around the selected project. */
export const RING_KM = [1, 3, 5];

/**
 * Bearings the ring labels sit on. Two per ring, roughly opposite, so each ring
 * is labelled on both sides the way the reference does.
 */
export const RING_LABEL_BEARINGS: Record<number, number[]> = {
  1: [215, 40],
  3: [250, 65],
  5: [268, 85],
};

export const MIN_ZOOM = 5.5;
export const MAX_ZOOM = 18.5;
