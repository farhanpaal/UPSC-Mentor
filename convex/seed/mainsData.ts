/** Curated GS-style Mains prompts for practice (not official UPSC wording). */

export type MainsSeedQuestion = {
  key: string;
  subject: string;
  maxMarks: 10 | 15 | 20;
  textEn: string;
  textHi?: string;
};

export const MAINS_SEED_QUESTIONS: MainsSeedQuestion[] = [
  {
    key: "polity-1",
    subject: "Polity",
    maxMarks: 15,
    textEn:
      "Discuss how the doctrine of basic structure limits parliamentary amendment power while preserving democratic flexibility. Illustrate with judicial decisions.",
    textHi:
      "मूल ढाँचे का सिद्धांत संसदीय संशोधन शक्ति को कैसे सीमित करता है और लोकतांत्रिक लचीलापन कैसे बनाए रखता है — न्यायिक निर्णयों से उदाहरण सहित चर्चा करें।",
  },
  {
    key: "polity-2",
    subject: "Polity",
    maxMarks: 10,
    textEn:
      "How does the anti-defection law balance party discipline with the legislator’s freedom of conscience? Critically examine.",
  },
  {
    key: "economy-1",
    subject: "Economy",
    maxMarks: 15,
    textEn:
      "Explain the role of monetary policy in controlling retail inflation in a supply-shock environment. What trade-offs does RBI face?",
    textHi:
      "आपूर्ति झटके वाले माहौल में खुदरा मुद्रास्फीति नियंत्रण में मौद्रिक नीति की भूमिका स्पष्ट करें। RBI किन समझौतों का सामना करता है?",
  },
  {
    key: "economy-2",
    subject: "Economy",
    maxMarks: 20,
    textEn:
      "Critically assess the impact of agricultural market reforms on farmer incomes and food security. Suggest policy safeguards.",
  },
  {
    key: "history-1",
    subject: "History",
    maxMarks: 15,
    textEn:
      "How did the Non-Cooperation and Khilafat movements widen the social base of Indian nationalism? Evaluate their long-term limitations.",
  },
  {
    key: "history-2",
    subject: "History",
    maxMarks: 10,
    textEn:
      "Discuss the administrative and revenue innovations of the Mughal state and their relevance to later British policies.",
  },
  {
    key: "geography-1",
    subject: "Geography",
    maxMarks: 15,
    textEn:
      "Explain the formation of Himalayan drainage patterns and their implications for floods, hydropower, and transboundary water cooperation.",
  },
  {
    key: "geography-2",
    subject: "Geography",
    maxMarks: 10,
    textEn:
      "Compare the climatic drivers of monsoon variability in peninsular and north-eastern India with suitable examples.",
  },
  {
    key: "environment-1",
    subject: "Environment",
    maxMarks: 15,
    textEn:
      "What are blue carbon ecosystems? Discuss their climate mitigation potential and the governance challenges in India’s coastal zones.",
  },
  {
    key: "environment-2",
    subject: "Environment",
    maxMarks: 10,
    textEn:
      "How can the ‘polluter pays’ principle be operationalised for industrial air pollution in Indian cities?",
  },
  {
    key: "science-1",
    subject: "Science & Tech",
    maxMarks: 15,
    textEn:
      "Discuss the opportunities and risks of deploying large language models in public service delivery and education in India.",
  },
  {
    key: "science-2",
    subject: "Science & Tech",
    maxMarks: 10,
    textEn:
      "Explain how semiconductor supply chains affect India’s electronics manufacturing ambitions. What policy levers matter?",
  },
  {
    key: "culture-1",
    subject: "Art & Culture",
    maxMarks: 15,
    textEn:
      "How have temple architecture traditions in south India reflected religious patronage and regional polities? Illustrate.",
  },
  {
    key: "culture-2",
    subject: "Art & Culture",
    maxMarks: 10,
    textEn:
      "Discuss the significance of intangible cultural heritage for tourism and community identity, with Indian examples.",
  },
  {
    key: "ca-1",
    subject: "Current Affairs",
    maxMarks: 15,
    textEn:
      "In the context of India’s G20 presidency themes, analyse how digital public infrastructure can advance inclusive development.",
  },
  {
    key: "ca-2",
    subject: "Current Affairs",
    maxMarks: 10,
    textEn:
      "What are the strategic and humanitarian dimensions of India’s neighbourhood policy in South Asia today?",
  },
  {
    key: "ir-1",
    subject: "International Relations",
    maxMarks: 15,
    textEn:
      "How does India’s Indo-Pacific outlook balance maritime security, economic connectivity, and strategic autonomy?",
  },
  {
    key: "ir-2",
    subject: "International Relations",
    maxMarks: 10,
    textEn:
      "Critically examine the role of multilateral institutions in addressing climate finance gaps between developed and developing countries.",
  },
];
