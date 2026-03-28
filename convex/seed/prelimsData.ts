/** Static Prelims-style MCQs for seeding Convex + offline fallback. Not official UPSC text; full PYQ corpus should be ingested via Apify with licensing in mind. */

export type PrelimsSeedMcq = {
  id: string;
  subject: string;
  topic?: string;
  year: number;
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
};

/** Canonical GS subject keys (same strings for en/hi banks for filter parity). */
export const PRELIMS_SUBJECT_KEYS = [
  "Polity",
  "Economy",
  "History",
  "Geography",
  "Environment",
  "Science & Tech",
  "Art & Culture",
  "Current Affairs",
  "International Relations",
] as const;

export const PRELIMS_BANK_EN: PrelimsSeedMcq[] = [
  {
    id: "en-p1",
    subject: "Polity",
    topic: "Basic structure",
    year: 2024,
    question:
      "The doctrine of basic structure of the Constitution, as evolved by the Supreme Court, primarily serves to:",
    options: [
      "Limit Parliament's power to amend certain foundational features",
      "Abolish judicial review of constitutional amendments",
      "Transfer amendment power entirely to the President",
      "Exclude fundamental rights from constitutional protection",
    ],
    correctIndex: 0,
    explanation:
      "Kesavananda Bharati (1973) held that Parliament can amend the Constitution but cannot destroy its basic structure; this preserves core features like secularism, federalism, and judicial review.",
  },
  {
    id: "en-p2",
    subject: "Polity",
    topic: "DPSP",
    year: 2022,
    question:
      "Which of the following best describes Directive Principles of State Policy (DPSP) under the Indian Constitution?",
    options: [
      "Non-justiciable guidelines for governance and policy",
      "Justiciable rights enforceable directly by individuals",
      "Rules binding only on municipalities",
      "Temporary provisions lapsing after ten years",
    ],
    correctIndex: 0,
    explanation:
      "DPSPs in Part IV are fundamental in governance but not enforceable by courts (Art. 37); they guide the state in making laws and policy.",
  },
  {
    id: "en-p3",
    subject: "Polity",
    topic: "Elections",
    year: 2019,
    question:
      "The Election Commission of India is described in the Constitution as a body consisting of:",
    options: [
      "A Chief Election Commissioner and such number of ECs as fixed by the President",
      "Only the Chief Election Commissioner with no other members",
      "Parliament-appointed commissioners with fixed five-year terms",
      "State election officers acting jointly",
    ],
    correctIndex: 0,
    explanation:
      "Article 324 provides for a commission with a CEC and additional Election Commissioners as Parliament may prescribe via law; appointment is by the President.",
  },
  {
    id: "en-e1",
    subject: "Economy",
    topic: "Banking",
    year: 2023,
    question:
      "When the Reserve Bank of India raises the repo rate, the immediate intent is typically to:",
    options: [
      "Cool aggregate demand and anchor inflation expectations",
      "Increase government fiscal deficit automatically",
      "Guarantee higher exports of services",
      "Eliminate the need for open market operations",
    ],
    correctIndex: 0,
    explanation:
      "A higher repo rate makes bank borrowing costlier, tends to raise lending rates, slow credit growth, and dampen demand—used when inflation is a concern.",
  },
  {
    id: "en-e2",
    subject: "Economy",
    topic: "Inflation",
    year: 2021,
    question:
      "Headline CPI inflation in India generally differs from core inflation because headline CPI:",
    options: [
      "Includes volatile food and fuel components",
      "Excludes all services prices",
      "Measures only wholesale prices",
      "Is always lower than the GDP deflator",
    ],
    correctIndex: 0,
    explanation:
      "Headline consumer inflation includes food and energy, which swing sharply; core measures often strip out food and fuel to gauge underlying price pressure.",
  },
  {
    id: "en-e3",
    subject: "Economy",
    topic: "External sector",
    year: 2018,
    question:
      "A sustained current account deficit in a country is most often financed by:",
    options: [
      "Capital inflows on the financial account (e.g. FDI, FPI, loans)",
      "Automatic elimination through fixed exchange rates alone",
      "Printing domestic currency without limit",
      "Suspending imports of all consumer goods",
    ],
    correctIndex: 0,
    explanation:
      "A CAD means imports of goods/services exceed exports; the gap is typically matched by net capital inflows (borrowing, investment) or use of reserves.",
  },
  {
    id: "en-h1",
    subject: "History",
    topic: "Modern India",
    year: 2024,
    question: "The Champaran Satyagraha (1917) is chiefly associated with Gandhi's intervention in:",
    options: [
      "Indigo planters' exploitation of tenant farmers in Bihar",
      "Salt monopoly protests in Gujarat",
      "Partition of Bengal agitation",
      "Khilafat movement demands",
    ],
    correctIndex: 0,
    explanation:
      "Champaran was Gandhi's first major civil disobedience in India, supporting peasants forced into unfair indigo contracts.",
  },
  {
    id: "en-h2",
    subject: "History",
    topic: "Ancient India",
    year: 2020,
    question:
      "The compilation known as the 'Tripitaka' is central to the canonical literature of which tradition?",
    options: ["Theravada Buddhism", "Vedanta school", "Bhakti Alvars", "Charvaka materialists"],
    correctIndex: 0,
    explanation:
      "Tripitaka (three baskets) contains Vinaya, Sutta, and Abhidhamma pitakas—core texts of early Buddhist schools, especially Theravada.",
  },
  {
    id: "en-h3",
    subject: "History",
    topic: "Medieval India",
    year: 2017,
    question:
      "The Sufi concept of 'wahdat al-wujud' (unity of being), influential in the Indian subcontinent, broadly emphasizes:",
    options: [
      "The essential unity of all existence with the Divine reality",
      "Strict ritual separation of castes in worship",
      "Exclusive political authority of the Caliph",
      "Rejection of all Persian literary influence",
    ],
    correctIndex: 0,
    explanation:
      "Associated especially with Ibn Arabi's thought as received in South Asia, it stresses mystical unity—though debated against more legalist Sufi positions.",
  },
  {
    id: "en-g1",
    subject: "Geography",
    topic: "Climatology",
    year: 2023,
    question:
      "The Indian Monsoon is best described as a large-scale seasonal reversal of winds driven primarily by:",
    options: [
      "Differential heating of land and sea across seasons",
      "Permanent high pressure over the Himalayas year-round",
      "A single mid-latitude frontal system",
      "Polar easterlies crossing the equator",
    ],
    correctIndex: 0,
    explanation:
      "Summer low over the heated Indian landmass and high over cooler ocean draws moist maritime air; winter pattern reverses—classic monsoon mechanism.",
  },
  {
    id: "en-g2",
    subject: "Geography",
    topic: "Resources",
    year: 2019,
    question:
      "Laterite soils in India are most extensively found under climatic conditions that are:",
    options: [
      "High temperature and heavy seasonal rainfall",
      "Arid with negligible rainfall",
      "Permafrost tundra",
      "Mediterranean dry summers only",
    ],
    correctIndex: 0,
    explanation:
      "Laterites form through intense leaching in hot, humid tropical areas; they are common in parts of the Western Ghats, Odisha, and northeastern hills.",
  },
  {
    id: "en-g3",
    subject: "Geography",
    topic: "Oceanography",
    year: 2016,
    question:
      "El Niño events in the Pacific are frequently linked, via teleconnections, to:",
    options: [
      "Weaker monsoon rainfall over parts of South Asia",
      "Stronger-than-normal Western Disturbances every winter",
      "Guaranteed above-normal snow in the Himalayas",
      "Collapse of all Indian Ocean trade winds permanently",
    ],
    correctIndex: 0,
    explanation:
      "Warm eastern Pacific El Niño often correlates with sub-par monsoon performance in India, though each year depends on other factors (IOD, MJO, etc.).",
  },
  {
    id: "en-v1",
    subject: "Environment",
    topic: "Biodiversity",
    year: 2022,
    question:
      "The Red List published by the IUCN is primarily used internationally to:",
    options: [
      "Assess extinction risk of species using standardized criteria",
      "License hunting quotas for all countries",
      "Map soil micronutrients",
      "Set corporate tax rates on renewables",
    ],
    correctIndex: 0,
    explanation:
      "The IUCN Red List categorizes species from Least Concern to Extinct using criteria on population trends, range, and threats.",
  },
  {
    id: "en-v2",
    subject: "Environment",
    topic: "Climate",
    year: 2021,
    question:
      "National parks and wildlife sanctuaries in India are principally declared under provisions of the:",
    options: [
      "Wild Life (Protection) Act, 1972",
      "Environment (Protection) Act, 1986 alone",
      "Factories Act, 1948",
      "Indian Forest Act, 1927 exclusively",
    ],
    correctIndex: 0,
    explanation:
      "Protected area categories for wildlife conservation flow from the WPA 1972; EPA 1986 covers broader environmental regulation.",
  },
  {
    id: "en-v3",
    subject: "Environment",
    topic: "Conventions",
    year: 2018,
    question: "The Montreal Protocol (1987) is best known for global cooperation to:",
    options: [
      "Phase out ozone-depleting substances",
      "Limit greenhouse gas emissions from aviation",
      "Ban transboundary movement of hazardous waste",
      "Establish carbon border adjustment mechanisms",
    ],
    correctIndex: 0,
    explanation:
      "Montreal Protocol targets CFCs and other ODS; it is widely regarded as one of the most successful multilateral environmental treaties.",
  },
  {
    id: "en-s1",
    subject: "Science & Tech",
    topic: "Space",
    year: 2024,
    question:
      "A geostationary orbit is characterized by a satellite's orbital period being approximately equal to:",
    options: [
      "Earth's rotation period (about 24 hours)",
      "Earth's revolution period around the Sun",
      "The Moon's sidereal month",
      "12 hours at any latitude",
    ],
    correctIndex: 0,
    explanation:
      "At ~35,786 km altitude over the equator, orbital period matches Earth's spin, so the satellite stays fixed relative to ground observers.",
  },
  {
    id: "en-s2",
    subject: "Science & Tech",
    topic: "Biotech",
    year: 2020,
    question:
      "CRISPR-Cas9 technology, often in the news, is fundamentally a tool for:",
    options: [
      "Targeted editing of DNA sequences in living cells",
      "Measuring atmospheric ozone in real time",
      "Converting seawater to heavy water",
      "Encrypting genomic databases only",
    ],
    correctIndex: 0,
    explanation:
      "CRISPR-Cas9 uses guide RNA to direct a nuclease to specific genomic sites, enabling knockouts, repairs, or insertions—subject to ethics and regulation.",
  },
  {
    id: "en-s3",
    subject: "Science & Tech",
    topic: "IT",
    year: 2017,
    question:
      "Quantum computing qubits differ from classical bits mainly because qubits can:",
    options: [
      "Exist in superpositions of 0 and 1 until measured",
      "Store only integers between 0 and 9",
      "Operate without any physical hardware",
      "Guarantee faster solutions for every possible problem",
    ],
    correctIndex: 0,
    explanation:
      "Superposition and entanglement enable certain algorithms (e.g. factoring, search) to scale differently—not universal speedup for all tasks.",
  },
  {
    id: "en-a1",
    subject: "Art & Culture",
    topic: "Architecture",
    year: 2023,
    question:
      "The Brihadisvara Temple at Thanjavur, a UNESCO World Heritage site, is a landmark monument of which dynasty?",
    options: ["Chola", "Pallava", "Hoysala", "Vijayanagara"],
    correctIndex: 0,
    explanation:
      "Rajaraja I's great Chola temple (early 11th century) exemplifies Dravidian architecture with its towering vimana.",
  },
  {
    id: "en-a2",
    subject: "Art & Culture",
    topic: "Performing arts",
    year: 2019,
    question:
      "Natyashastra, attributed to Bharata, is a foundational Sanskrit treatise on:",
    options: ["Drama, dance, and music", "Astronomy", "Military strategy", "Ayurvedic surgery"],
    correctIndex: 0,
    explanation:
      "The Natyashastra codifies rasas, bhavas, and stagecraft—central to classical Indian performance traditions.",
  },
  {
    id: "en-a3",
    subject: "Art & Culture",
    topic: "Paintings",
    year: 2015,
    question:
      "The Pahari school of miniature painting is most closely associated with the Himalayan foothill states such as:",
    options: ["Kangra, Basohli, Guler", "Thanjavur and Madurai", "Ajanta region only", "Mughal court exclusively"],
    correctIndex: 0,
    explanation:
      "Pahari paintings flourished under Rajput hill states, with Kangra's lyrical style especially celebrated.",
  },
  {
    id: "en-c1",
    subject: "Current Affairs",
    topic: "Schemes",
    year: 2024,
    question:
      "Government schemes framed around 'Jan Dhan–Aadhaar–Mobile' (JAM) trinity primarily aim to strengthen:",
    options: [
      "Financial inclusion and targeted benefit delivery",
      "Interstate river water tribunals",
      "Defence procurement offsets",
      "University semester exchange quotas",
    ],
    correctIndex: 0,
    explanation:
      "JAM links bank accounts, Aadhaar authentication, and mobile connectivity to reduce leakages and expand access to formal finance and subsidies.",
  },
  {
    id: "en-c2",
    subject: "Current Affairs",
    topic: "Indices",
    year: 2022,
    question:
      "Multidimensional Poverty Index (MPI) style assessments typically differ from income-only poverty lines because they:",
    options: [
      "Combine health, education, and living standards indicators",
      "Ignore non-monetary dimensions entirely",
      "Measure only urban unemployment",
      "Use a single asset price index",
    ],
    correctIndex: 0,
    explanation:
      "MPI frameworks (e.g. Oxford MPI) track simultaneous deprivations across dimensions, not just consumption expenditure.",
  },
  {
    id: "en-c3",
    subject: "Current Affairs",
    topic: "Institutions",
    year: 2020,
    question:
      "The National Disaster Management Authority (NDMA) at the national level is chaired, as per law, by the:",
    options: ["Prime Minister", "Home Minister", "Cabinet Secretary", "Chief Justice of India"],
    correctIndex: 0,
    explanation:
      "Under the Disaster Management Act, 2005, the PM chairs NDMA; states have SDMAs chaired by Chief Ministers.",
  },
  {
    id: "en-i1",
    subject: "International Relations",
    topic: "Organizations",
    year: 2023,
    question:
      "The principle of 'common but differentiated responsibilities' (CBDR) is most associated with which class of treaties?",
    options: [
      "UN climate change negotiations",
      "WTO tariff schedules only",
      "Nuclear Non-Proliferation Treaty safeguards",
      "UNCLOS piracy clauses",
    ],
    correctIndex: 0,
    explanation:
      "CBDR acknowledges that all states share responsibility for the environment but historical emitters and capabilities differ—central to UNFCCC debates.",
  },
  {
    id: "en-i2",
    subject: "International Relations",
    topic: "Neighbourhood",
    year: 2021,
    question:
      "SAARC (South Asian Association for Regional Cooperation) comprises member states that are:",
    options: [
      "Countries in South Asia as defined in its Charter",
      "All Indian Ocean rim states",
      "ASEAN members plus India",
      "Only BIMSTEC participants",
    ],
    correctIndex: 0,
    explanation:
      "SAARC's eight members are Afghanistan, Bangladesh, Bhutan, India, Maldives, Nepal, Pakistan, and Sri Lanka (Afghan membership has faced political freezes).",
  },
  {
    id: "en-i3",
    subject: "International Relations",
    topic: "Security",
    year: 2018,
    question:
      "A country imposing 'smart' or targeted sanctions on individuals and entities rather than full trade embargoes is generally trying to:",
    options: [
      "Signal disapproval while limiting humanitarian harm",
      "Guarantee regime change by military force",
      "Eliminate all diplomatic contact",
      "Withdraw from the UN system",
    ],
    correctIndex: 0,
    explanation:
      "Targeted financial and travel sanctions aim to pressure decision-makers and firms linked to misconduct without starving entire populations.",
  },
];

function hiBank(): PrelimsSeedMcq[] {
  return [
    {
      id: "hi-p1",
      subject: "Polity",
      topic: "मूल ढाँचा",
      year: 2024,
      question:
        "भारत के संविधान के मूल ढाँचे का सिद्धांत, जैसा कि सर्वोच्च न्यायालय ने विकसित किया है, मुख्य रूप से किस उद्देश्य की पूर्ति करता है?",
      options: [
        "कुछ मौलिक विशेषताओं पर संसद के संशोधन अधिकार को सीमित करना",
        "संवैधानिक संशोधनों पर न्यायिक समीक्षा समाप्त करना",
        "संशोधन शक्ति पूरी तरह राष्ट्रपति को स्थानांतरित करना",
        "मौलिक अधिकारों को संवैधानिक संरक्षण से बाहर रखना",
      ],
      correctIndex: 0,
      explanation:
        "केसवानंद भारती (1973) में कहा गया कि संसद संविधान संशोधित कर सकती है किंतु उसके मूल ढाँचे को नष्ट नहीं कर सकती; धर्मनिरपेक्षता, संघवाद व न्यायिक समीक्षा जैसी मूल विशेषताएँ सुरक्षित रहती हैं।",
    },
    {
      id: "hi-p2",
      subject: "Polity",
      topic: "नीति निदेशक तत्व",
      year: 2022,
      question:
        "भारतीय संविधान के अंतर्गत राज्य के नीति निदेशक सिद्धांत (DPSP) का सबसे उपयुक्त वर्णन कौन सा है?",
      options: [
        "शासन और नीति के लिए गैर-न्यायसंगत मार्गदर्शक सिद्धांत",
        "व्यक्तियों द्वारा प्रत्यक्ष रूप से प्रवर्तनीय अधिकार",
        "केवल नगर पालिकाओं पर बाध्यकारी नियम",
        "दस वर्ष बाद समाप्त होने वाले अस्थायी प्रावधान",
      ],
      correctIndex: 0,
      explanation:
        "भाग IV के DPSP शासन में मौलिक हैं किंतु न्यायालयों द्वारा प्रवर्तनीय नहीं (अनु. 37); ये राज्य को कानून और नीति बनाने में मार्गदर्शित करते हैं।",
    },
    {
      id: "hi-p3",
      subject: "Polity",
      topic: "चुनाव",
      year: 2019,
      question:
        "भारत के चुनाव आयोग का संवैधानिक वर्णन किस रूप में किया गया है?",
      options: [
        "मुख्य चुनाव आयुक्त और राष्ट्रपति द्वारा निर्धारित संख्या में अन्य चुनाव आयुक्त",
        "केवल मुख्य चुनाव आयुक्त, अन्य सदस्य रहित",
        "संसद द्वारा नियुक्त पाँच वर्षीय कार्यकाल वाले आयुक्त",
        "राज्य चुनाव अधिकारी संयुक्त रूप से",
      ],
      correctIndex: 0,
      explanation:
        "अनुच्छेद 324 एक आयोग की व्यवस्था करता है जिसमें मुख्य चुनाव आयुक्त और कानून द्वारा निर्धारित अतिरिक्त चुनाव आयुक्त हो सकते हैं; नियुक्ति राष्ट्रपति द्वारा।",
    },
    {
      id: "hi-e1",
      subject: "Economy",
      topic: "बैंकिंग",
      year: 2023,
      question:
        "जब भारतीय रिज़र्व बैंक रेपो दर बढ़ाता है, तो तात्कालिक उद्देश्य सामान्यतः क्या होता है?",
      options: [
        "कुल मांग शीतल करना और मुद्रास्फीति अपेक्षाओं को स्थिर करना",
        "सरकारी राजकोषीय घाटे को स्वतः बढ़ाना",
        "सेवा निर्यात की गारंटी देना",
        "खुले बाजार के संचालन की आवश्यकता समाप्त करना",
      ],
      correctIndex: 0,
      explanation:
        "उच्च रेपो दर से बैंकों के लिए उधार महंगा होता है, ऋण दरें बढ़ सकती हैं, ऋण वृद्धि धीमी होती है—मुद्रास्फीति चिंता के समय उपयोगी उपकरण।",
    },
    {
      id: "hi-e2",
      subject: "Economy",
      topic: "मुद्रास्फीति",
      year: 2021,
      question:
        "भारत में शीर्षक उपभोक्ता मूल्य सूचकांक (CPI) मुद्रास्फीति सामान्यतः कोर मुद्रास्फीति से भिन्न होती है क्योंकि शीर्षक CPI:",
      options: [
        "अस्थिर खाद्य और ईंधन घटकों को शामिल करती है",
        "सभी सेवा मूल्यों को बाहर रखती है",
        "केवल थोक मूल्य मापती है",
        "GDP डिफ्लेटर से हमेशा कम होती है",
      ],
      correctIndex: 0,
      explanation:
        "शीर्षक उपभोक्ता मुद्रास्फीति में खाद्य व ऊर्जा शामिल होते हैं जो तेज़ी से बदलते हैं; कोर माप अंतर्निहित मूल्य दबाव देखने के लिए अक्सर इन्हें अलग करता है।",
    },
    {
      id: "hi-e3",
      subject: "Economy",
      topic: "बाह्य क्षेत्र",
      year: 2018,
      question:
        "किसी देश में निरंतर चालू खाता घाटा अधिकांशतः किसके द्वारा वित्तपोषित होता है?",
      options: [
        "वित्तीय खाते पर पूंजी प्रवाह (FDI, FPI, ऋण आदि)",
        "केवल निश्चित विनिमय दर से स्वतः समाप्ति",
        "सीमा रहित घरेलू मुद्रा छपाई",
        "सभी उपभोक्ता वस्तु आयात निलंबन",
      ],
      correctIndex: 0,
      explanation:
        "चालू खाता घाटा का अर्थ है वस्तुओं/सेवाओं का आयात निर्यात से अधिक; अंतराल सामान्यतः शुद्ध पूंजी प्रवाह या भंडार उपयोग से पूरा होता है।",
    },
    {
      id: "hi-h1",
      subject: "History",
      topic: "आधुनिक भारत",
      year: 2024,
      question: "चंपारण सत्याग्रह (1917) मुख्य रूप से गांधीजी के किस हस्तक्षेप से जुड़ा है?",
      options: [
        "बिहार में नील बागान मालिकों द्वारा किसान शोषण",
        "गुजरात में नमक एकाधिकार विरोध",
        "बंगाल विभाजन आंदोलन",
        "खिलाफत आंदोलन की माँगें",
      ],
      correctIndex: 0,
      explanation:
        "चंपारण भारत में गांधीजी का पहला प्रमुख सविनय अवज्ञा अभियान था, जो अन्यायपूर्ण नील करारों पर मजबूर किसानों का समर्थन करता था।",
    },
    {
      id: "hi-h2",
      subject: "History",
      topic: "प्राचीन भारत",
      year: 2020,
      question: "'त्रिपिटक' संकलन किस परंपरा की मानक साहित्यिक धरोहर का केंद्र है?",
      options: ["थेरवाद बौद्ध धर्म", "वेदांत", "भक्ति आलवार", "चार्वाक"],
      correctIndex: 0,
      explanation:
        "त्रिपिटक (तीन टोकरी) में विनय, सूत्त व अभिधम्म पिटक हैं—प्रारंभिक बौद्ध सम्प्रदायों, विशेषकर थेरवाद के मूल ग्रंथ।",
    },
    {
      id: "hi-h3",
      subject: "History",
      topic: "मध्यकालीन भारत",
      year: 2017,
      question:
        "भारतीय उपमहाद्वीप में प्रभावशाली सूफी विचार 'वहदतुल वजूद' (अस्तित्व की एकता) मोटे तौर पर क्या बल देता है?",
      options: [
        "दिव्य वास्तविकता के साथ समस्त अस्तित्व की आवश्यक एकता",
        "पूजा में जाति का कठोर अलगाव",
        "खलीफा का विशेष राजनीतिक अधिकार",
        "फारसी साहित्यिक प्रभाव का पूर्ण अस्वीकार",
      ],
      correctIndex: 0,
      explanation:
        "इब्न अरबी के विचार से जुड़ा यह रहस्यवादी एकता सिद्धांत दक्षिण एशिया में प्रचलित रहा—कानूनी सूफी धाराओं से बहस का विषय भी।",
    },
    {
      id: "hi-g1",
      subject: "Geography",
      topic: "जलवायु विज्ञान",
      year: 2023,
      question:
        "भारतीय मानसून को सर्वोत्तम रूप में किस रूप में वर्णित किया जा सकता है?",
      options: [
        "ऋतुओं में स्थल व समुद्र के विषम तापन से चालित बड़े पैमाने पर पवन प्रतिवर्तन",
        "वर्ष भर हिमालय पर स्थायी उच्च दाब",
        "एकल मध्य अक्षांश मोर्चा प्रणाली",
        "ध्रुवीय पूर्वी पवनों का विषुवत रेखा पार करना",
      ],
      correctIndex: 0,
      explanation:
        "गर्मियों में भारतीय स्थल का तापक्रम व समुद्र की तुलना में निम्न दाब नम समुद्री हवा खींचता है; सर्दियों में प्रतिमान उलट—मानसून का मूल यांत्रिकी।",
    },
    {
      id: "hi-g2",
      subject: "Geography",
      topic: "संसाधन",
      year: 2019,
      question:
        "भारत में लैटराइट मिट्टी अधिकांशतः किस जलवायु में व्यापक पाई जाती है?",
      options: [
        "उच्च तापमान व भारी मौसमी वर्षा",
        "नगण्य वर्षा व शुष्क",
        "स्थायी हिमस्थल",
        "केवल भूमध्यसागरीय शुष्क ग्रीष्म",
      ],
      correctIndex: 0,
      explanation:
        "लैटराइट गर्म नम कटिबंधीय क्षेत्रों में भारी लीचिंग से बनती है; पश्चिमी घाट, ओडिशा व पूर्वोत्तर पहाड़ियों में सामान्य।",
    },
    {
      id: "hi-g3",
      subject: "Geography",
      topic: "समुद्र विज्ञान",
      year: 2016,
      question:
        "प्रशांत में एल निनो घटनाएँ दूरसंबंध (टेलीकनेक्शन) के माध्यम से अक्सर किससे जुड़ी होती हैं?",
      options: [
        "दक्षिण एशिया के कुछ हिस्सों में कमज़ोर मानसूनी वर्षा",
        "हर सर्दियों में असामान्य रूप से मजबूत पश्चिमी विक्षोभ",
        "हिमालय में असामान्य हिम की गारंटी",
        "सभी हिंद महासागर व्यापार पवनों का स्थायी पतन",
      ],
      correctIndex: 0,
      explanation:
        "पूर्वी प्रशांत का एल निनो अक्सर भारत में अपेक्षाकृत कमज़ोर मानसून से जुड़ता है, यद्यपि IOD आदि अन्य कारक भी महत्वपूर्ण हैं।",
    },
    {
      id: "hi-v1",
      subject: "Environment",
      topic: "जैव विविधता",
      year: 2022,
      question:
        "IUCN द्वारा प्रकाशित रेड लिस्ट का अंतरराष्ट्रीय स्तर पर मुख्य उपयोग क्या है?",
      options: [
        "मानक मानदंडों से प्रजातियों के विलुप्ति जोखिम का मूल्यांकन",
        "सभी देशों में शिकार कोटा लाइसेंस करना",
        "मिट्टी सूक्ष्म पोषक तत्व मानचित्रण",
        "नवीकरण पर कॉर्पोरेट कर दरें तय करना",
      ],
      correctIndex: 0,
      explanation:
        "IUCN रेड लिस्ट प्रजातियों को लीस्ट कंसर्न से एक्सटिंक्ट तक वर्गीकृत करती है—जनसंख्या, क्षेत्र व खतरों के आधार पर।",
    },
    {
      id: "hi-v2",
      subject: "Environment",
      topic: "जलवायु",
      year: 2021,
      question:
        "भारत में राष्ट्रीय उद्यान व वन्यजीव अभयारण्य मुख्य रूप किस अधिनियम के तहत घोषित होते हैं?",
      options: [
        "वन्य जीव (संरक्षण) अधिनियम, 1972",
        "केवल पर्यावरण (संरक्षण) अधिनियम, 1986",
        "फैक्टरी अधिनियम, 1948",
        "केवल भारतीय वन अधिनियम, 1927",
      ],
      correctIndex: 0,
      explanation:
        "वन्यजीव संरक्षण संरचनाएँ WPA 1972 से; EPA 1986 व्यापक पर्यावरण नियमन से संबंधित है।",
    },
    {
      id: "hi-v3",
      subject: "Environment",
      topic: "अंतरराष्ट्रीय समझौते",
      year: 2018,
      question: "मॉन्ट्रियल प्रोटोकॉल (1987) वैश्विक सहयोग के लिए प्रसिद्ध है:",
      options: [
        "ओजोन क्षयकारी पदार्थों का चरणबद्ध उन्मूलन",
        "विमानन से ग्रीनहाउस गैस सीमा",
        "खतरनाक अपशिष्ट की सीमा पार आवाजाही प्रतिबंध",
        "कार्बन सीमा समायोजन तंत्र",
      ],
      correctIndex: 0,
      explanation:
        "मॉन्ट्रियल प्रोटोकॉल CFC आदि ODS को लक्षित करता है; इसे सफल बहुपक्षीय पर्यावरण संधियों में गिना जाता है।",
    },
    {
      id: "hi-s1",
      subject: "Science & Tech",
      topic: "अंतरिक्ष",
      year: 2024,
      question:
        "भूस्थिर कक्षा की विशेषता है कि उपग्रह की कक्षीय अवधि लगभग किसके बराबर होती है?",
      options: [
        "पृथ्वी का घूर्णन काल (लगभग 24 घंटे)",
        "सूर्य के चारों ओर पृथ्वी की परिक्रमा काल",
        "चंद्रमा का नक्षत्र मास",
        "किसी भी अक्षांश पर 12 घंटे",
      ],
      correctIndex: 0,
      explanation:
        "विषुवत पर ~35,786 किमी ऊँचाई पर कक्षीय अवधि पृथ्वी के स्पिन से मेल खाती है—स्थल से स्थिर दिखाई देता है।",
    },
    {
      id: "hi-s2",
      subject: "Science & Tech",
      topic: "जैव प्रौद्योगिकी",
      year: 2020,
      question:
        "CRISPR-Cas9 प्रौद्योगिकी, जो अक्सर समाचारों में रहती है, मूलतः किसके लिए उपकरण है?",
      options: [
        "जीवित कोशिकाओं में DNA अनुक्रमों का लक्षित संपादन",
        "वास्तविक समय में वायुमंडलीय ओजोन मापन",
        "समुद्र जल को भारी जल में बदलना",
        "केवल जीनोमिक डेटाबेस एन्क्रिप्शन",
      ],
      correctIndex: 0,
      explanation:
        "CRISPR-Cas9 गाइड RNA से न्यूक्लिएज को विशिष्ट जीनोमिक साइटों पर निर्देशित करता है—नैतिकता व विनियमन के विषय।",
    },
    {
      id: "hi-s3",
      subject: "Science & Tech",
      topic: "सूचना प्रौद्योगिकी",
      year: 2017,
      question:
        "क्वांटम कंप्यूटिंग क्यूबिट क्लासिकल बिट से मुख्य रूप इसलिए भिन्न हैं क्योंकि क्यूबिट:",
      options: [
        "मापे जाने तक 0 और 1 के अध्यारोह में रह सकते हैं",
        "केवल 0 से 9 पूर्णांक संग्रहीत कर सकते हैं",
        "बिना किसी भौतिक हार्डवेयर के चलते हैं",
        "हर संभव समस्या के लिए तेज़ समाधान की गारंटी देते हैं",
      ],
      correctIndex: 0,
      explanation:
        "अध्यारोह व उलझाव कुछ एल्गोरिदम के पैमाने को बदल सकते हैं—सभी कार्यों के लिए सार्वत्रिक त्वरण नहीं।",
    },
    {
      id: "hi-a1",
      subject: "Art & Culture",
      topic: "वास्तुकला",
      year: 2023,
      question:
        "यूनेस्को विश्व धरोहर स्थल तंजावुर का बृहदीश्वर मंदिर किस वंश की प्रतीकात्मक कृति है?",
      options: ["चोल", "पल्लव", "होयसल", "विजयनगर"],
      correctIndex: 0,
      explanation:
        "राजराज चोल I का यह मंदिर (11वीं सदी) द्रविड़ शैली की विशाल विमान वाली मिसाल है।",
    },
    {
      id: "hi-a2",
      subject: "Art & Culture",
      topic: "प्रदर्शन कला",
      year: 2019,
      question: "भरत से जुड़ा नाट्यशास्त्र किस विषय पर मौलिक संस्कृत ग्रंथ है?",
      options: ["नाटक, नृत्य व संगीत", "खगोल विज्ञान", "सैन्य रणनीति", "आयुर्वेदिक शल्य चिकित्सा"],
      correctIndex: 0,
      explanation:
        "नाट्यशास्त्र रस, भाव व मंच कला को संहिताबद्ध करता है—भारतीय शास्त्रीय प्रदर्शन परंपराओं का आधार।",
    },
    {
      id: "hi-a3",
      subject: "Art & Culture",
      topic: "चित्रकला",
      year: 2015,
      question:
        "पहाड़ी लघुचित्र शैली का सबसे निकट संबंध हिमालयी तराई राज्यों जैसे किनके साथ है?",
      options: [
        "कांगड़ा, बसोहली, गूलर",
        "तंजावुर व मदुरै",
        "केवल अजंता क्षेत्र",
        "केवल मुगल दरबार",
      ],
      correctIndex: 0,
      explanation:
        "पहाड़ी चित्रण राजपूत पहाड़ी रियासतों में फला, कांगड़ा की लयात्मक शैली विशेष प्रसिद्ध।",
    },
    {
      id: "hi-c1",
      subject: "Current Affairs",
      topic: "योजनाएँ",
      year: 2024,
      question:
        "'जन धन–आधार–मोबाइल' (JAM) त्रयी के चारों ओर बनी सरकारी योजनाएँ मुख्य रूप से क्या मजबूत करना चाहती हैं?",
      options: [
        "वित्तीय समावेशन व लक्षित लाभ वितरण",
        "अंतर्राज्यीय नदी जल न्यायाधिकरण",
        "रक्षा खरीद ऑफसेट",
        "विश्वविद्यालय सेमेस्टर विनिमय कोटा",
      ],
      correctIndex: 0,
      explanation:
        "JAM बैंक खाते, आधार प्रमाणीकरण व मोबाइल कनेक्टिविटी जोड़कर रिसाव कम कर औपचारिक वित्त व सब्सिडी वितरण विस्तारित करता है।",
    },
    {
      id: "hi-c2",
      subject: "Current Affairs",
      topic: "सूचकांक",
      year: 2022,
      question:
        "बहुआयामी गरीबी सूचकांक (MPI) शैली के मूल्यांकन आमतौर पर केवल-आय गरीबी रेखा से भिन्न होते हैं क्योंकि ये:",
      options: [
        "स्वास्थ्य, शिक्षा व जीवन स्तर संकेतकों को संयोजित करते हैं",
        "गैर-मौद्रिक आयामों को पूरी तरह नज़रअंदाज़ करते हैं",
        "केवल शहरी बेरोजगारी मापते हैं",
        "एकल संपत्ति मूल्य सूचकांक का उपयोग करते हैं",
      ],
      correctIndex: 0,
      explanation:
        "MPI ढाँचे (जैसे ऑक्सफोर्ड MPI) एक साथ कई वंचनाओं को ट्रैक करते हैं, केवल उपभोग व्यय नहीं।",
    },
    {
      id: "hi-c3",
      subject: "Current Affairs",
      topic: "संस्थाएँ",
      year: 2020,
      question:
        "राष्ट्रीय स्तर पर राष्ट्रीय आपदा प्रबंधन प्राधिकरण (NDMA) की अध्यक्षता कानून के अनुसार किसके द्वारा की जाती है?",
      options: ["प्रधानमंत्री", "गृह मंत्री", "कैबिनेट सचिव", "भारत के मुख्य न्यायाधीश"],
      correctIndex: 0,
      explanation:
        "आपदा प्रबंधन अधिनियम, 2005 के तहत PM NDMA के अध्यक्ष हैं; राज्यों में CM SDMA के अध्यक्ष।",
    },
    {
      id: "hi-i1",
      subject: "International Relations",
      topic: "संस्थाएँ",
      year: 2023,
      question:
        "'सामान्य किंतु भेदात्मक जिम्मेदारियाँ' (CBDR) सिद्धांत किस प्रकार की संधियों से सर्वाधिक जुड़ा है?",
      options: [
        "संयुक्त राष्ट्र जलवायु वार्ता",
        "केवल WTO शुल्क अनुसूची",
        "परमाणु अप्रसार संधि सुरक्षा उपाय",
        "UNCLOS समुद्री डकैती धाराएँ",
      ],
      correctIndex: 0,
      explanation:
        "CBDR मानता है कि सभी राज्य पर्यावरण के लिए जिम्मेदार हैं किंतु ऐतिहासिक उत्सर्जक व क्षमताएँ भिन्न—UNFCCC बहस का केंद्र।",
    },
    {
      id: "hi-i2",
      subject: "International Relations",
      topic: "पड़ोस",
      year: 2021,
      question:
        "दक्षिण एशियाई क्षेत्रीय सहयोग संगठन (SAARC) के सदस्य राज्य कौन से हैं?",
      options: [
        "अपने विधान में परिभाषित दक्षिण एशियाई देश",
        "सभी हिंद महासागर तटीय राज्य",
        "आसियान सदस्य व भारत",
        "केवल बिम्सटेक प्रतिभागी",
      ],
      correctIndex: 0,
      explanation:
        "SAARC के आठ सदस्य अफगानिस्तान, बांग्लादेश, भूटान, भारत, मालदीव, नेपाल, पाकिस्तान व श्रीलंका (राजनीतिक ठहराव के बावजूद संरचना)।",
    },
    {
      id: "hi-i3",
      subject: "International Relations",
      topic: "सुरक्षा",
      year: 2018,
      question:
        "किसी देश द्वारा पूर्ण व्यापार प्रतिबंध के बजाय व्यक्तियों व संस्थाओं पर 'स्मार्ट' प्रतिबंध लगाना सामान्यतः क्या करने का प्रयास है?",
      options: [
        "मानवीय हानि सीमित करते हुए असंतोष संकेतित करना",
        "सैन्य बल से शासन परिवर्तन की गारंटी",
        "सभी कूटनीतिक संपर्क समाप्त करना",
        "संयुक्त राष्ट्र प्रणाली से बाहर निकलना",
      ],
      correctIndex: 0,
      explanation:
        "लक्षित वित्तीय व यात्रा प्रतिबंध निर्णायकों व दोषपूर्ण फर्मों पर दबाव डालते हैं पूरे जनसमूह को नहीं।",
    },
  ];
}

export const PRELIMS_BANK_HI: PrelimsSeedMcq[] = hiBank();
