export interface DiagnosisResult {
  causes: string;
  treatmentSteps: string;
  organicSolutions: string;
  chemicalSolutions: string;
  preventiveMeasures: string;
  confidence: number;
}

type KBKey = string;

// Maps "crop|symptom" to diagnosis results
const knowledgeBase: Record<KBKey, DiagnosisResult> = {
  "wheat|yellow leaves": {
    causes:
      "Nitrogen deficiency or wheat rust fungus (Puccinia striiformis). Common in poorly fertilized soils or wet seasons.",
    treatmentSteps:
      "1. Test soil nitrogen levels. 2. Apply urea fertilizer (46-0-0) at 30kg/acre. 3. If rust fungus detected, apply fungicide. 4. Improve drainage to reduce moisture.",
    organicSolutions:
      "Apply compost tea or fish emulsion. Use neem cake as organic nitrogen source (5kg/acre).",
    chemicalSolutions:
      "Propiconazole 25% EC (1ml/L) for rust. Urea foliar spray (2%) for nitrogen deficiency.",
    preventiveMeasures:
      "Use rust-resistant wheat varieties. Rotate crops every 2 years. Maintain proper plant spacing for airflow.",
    confidence: 88,
  },
  "wheat|brown spots": {
    causes:
      "Septoria leaf blotch (Mycosphaerella graminicola) or Tan spot. Thrives in cool, wet weather with heavy dew.",
    treatmentSteps:
      "1. Remove and destroy infected plant debris. 2. Apply fungicide at first sign of infection. 3. Ensure proper nitrogen balance. 4. Avoid overhead irrigation.",
    organicSolutions:
      "Spray diluted neem oil (5ml/L) every 10 days. Apply Trichoderma-based bio-fungicide.",
    chemicalSolutions:
      "Tebuconazole 25.9% EC (1.5ml/L water) or Carbendazim 50% WP (1g/L water).",
    preventiveMeasures:
      "Plant disease-resistant varieties. Remove crop residue after harvest. Practice crop rotation with legumes.",
    confidence: 85,
  },
  "wheat|pests": {
    causes:
      "Aphids, Hessian fly, or armyworm infestation. Aphids reduce photosynthesis and transmit viruses.",
    treatmentSteps:
      "1. Scout field for pest population thresholds. 2. Release beneficial insects (ladybugs) if available. 3. Apply targeted insecticide if threshold exceeded. 4. Destroy crop residue after harvest.",
    organicSolutions:
      "Neem oil spray (5ml/L). Release parasitic wasps (Aphidius). Use sticky traps for monitoring.",
    chemicalSolutions:
      "Imidacloprid 17.8% SL (0.5ml/L) for aphids. Lambda-cyhalothrin for armyworm.",
    preventiveMeasures:
      "Plant early to avoid peak pest season. Use pheromone traps for monitoring. Maintain field hygiene.",
    confidence: 82,
  },
  "tomato|brown spots": {
    causes:
      "Early blight (Alternaria solani) or Late blight (Phytophthora infestans). Very common in humid conditions and poor air circulation.",
    treatmentSteps:
      "1. Remove all infected leaves immediately. 2. Avoid wetting foliage when watering. 3. Apply copper-based fungicide. 4. Stake plants for better air circulation. 5. Apply mulch to prevent soil splash.",
    organicSolutions:
      "Copper-sulfate spray (2g/L). Baking soda solution (1 tsp/L). Neem oil (3ml/L) weekly.",
    chemicalSolutions:
      "Mancozeb 75% WP (2.5g/L) or Chlorothalonil 75% WP (2g/L). Apply every 7–10 days.",
    preventiveMeasures:
      "Use certified disease-free seeds. Water at base not on leaves. Space plants 60cm apart. Rotate crops annually.",
    confidence: 92,
  },
  "tomato|yellow leaves": {
    causes:
      "Magnesium or iron deficiency, Fusarium wilt, or Tomato mosaic virus. Yellowing pattern indicates the specific cause.",
    treatmentSteps:
      "1. Identify yellowing pattern (interveinal = Mg deficiency, tip = nitrogen). 2. Soil test for nutrient levels. 3. If wilt suspected, remove infected plants to prevent spread. 4. Adjust soil pH to 6.0–6.8.",
    organicSolutions:
      "Epsom salt spray (15g/L) for magnesium. Compost application (5kg/plant). Seaweed extract foliar spray.",
    chemicalSolutions:
      "Magnesium sulfate 0.5% spray. NPK 19:19:19 water-soluble fertilizer.",
    preventiveMeasures:
      "Conduct soil test before planting. Maintain optimal pH. Use virus-resistant varieties.",
    confidence: 84,
  },
  "tomato|wilting": {
    causes:
      "Fusarium wilt (Fusarium oxysporum), bacterial wilt, or root damage from overwatering. Wilting may indicate root-zone disease.",
    treatmentSteps:
      "1. Check soil moisture — avoid overwatering. 2. Inspect roots for brown discoloration (Fusarium). 3. Remove severely wilted plants. 4. Solarize soil in severe cases. 5. Apply biocontrol agents.",
    organicSolutions:
      "Trichoderma viride soil application (5g/kg soil). Neem cake soil incorporation. Improve drainage with perlite.",
    chemicalSolutions:
      "Carbendazim 50% WP soil drench (2g/L). Streptomycin sulfate for bacterial wilt.",
    preventiveMeasures:
      "Use grafted tomato plants on resistant rootstock. Avoid waterlogging. Sterilize pruning tools.",
    confidence: 87,
  },
  "rice|pests": {
    causes:
      "Brown planthopper (BPH), stem borer, or leaf folder. BPH causes 'hopperburn' and is a major yield reducer.",
    treatmentSteps:
      "1. Monitor pest population with sweep nets. 2. Drain fields periodically to disrupt pests. 3. Use light traps for stem borers. 4. Apply insecticide at economic threshold level.",
    organicSolutions:
      "Neem seed kernel extract (5%). Encourage spiders and predatory bugs. Pheromone traps for stem borer.",
    chemicalSolutions:
      "Buprofezin 25% SC for BPH (1ml/L). Chlorpyrifos 20% EC for stem borer (2ml/L).",
    preventiveMeasures:
      "Plant resistant rice varieties (IR36, IR64). Avoid excessive nitrogen. Synchronize planting in region.",
    confidence: 90,
  },
  "rice|yellow leaves": {
    causes:
      "Tungro virus disease (transmitted by green leafhopper) or nitrogen deficiency. Tungro causes yellowing-orange discoloration.",
    treatmentSteps:
      "1. Control green leafhopper vector with insecticide. 2. Remove and destroy tungro-infected plants. 3. Apply nitrogen fertilizer for deficiency cases. 4. Ensure proper water management.",
    organicSolutions:
      "Neem oil spray to control leafhopper. Green manure (Sesbania) incorporation. Azolla green manure application.",
    chemicalSolutions:
      "Imidacloprid 70% WS seed treatment for leafhopper. Urea top dressing for nitrogen deficiency.",
    preventiveMeasures:
      "Plant tungro-resistant varieties (Vajram, Vikramarya). Maintain proper crop spacing.",
    confidence: 86,
  },
  "potato|wilting": {
    causes:
      "Bacterial wilt (Ralstonia solanacearum) or late blight root infection. Wilt is sudden and progressive in hot conditions.",
    treatmentSteps:
      "1. Pull affected plants and bag them — do not compost. 2. Solarize affected soil beds. 3. Avoid replanting in same area for 3 years. 4. Improve soil drainage. 5. Use certified disease-free seed potatoes.",
    organicSolutions:
      "Lime soil to raise pH. Incorporate mustard green manure. Apply biochar to improve soil health.",
    chemicalSolutions:
      "Copper hydroxide 77% WP (3g/L) as preventive soil drench. Kasugamycin for bacterial wilt.",
    preventiveMeasures:
      "Use certified seed tubers. Practice 3-year crop rotation. Avoid fields with history of wilt.",
    confidence: 88,
  },
  "potato|brown spots": {
    causes:
      "Early blight (Alternaria solani) or Common scab (Streptomyces scabies). Brown sunken lesions indicate blight.",
    treatmentSteps:
      "1. Apply fungicide at plant canopy closure. 2. Hill plants to cover tubers. 3. Maintain consistent soil moisture. 4. Harvest promptly to avoid continued infection.",
    organicSolutions:
      "Sulfur dust (3kg/acre). Copper sulfate spray. Neem oil foliar treatment every 2 weeks.",
    chemicalSolutions:
      "Mancozeb + Cymoxanil WP (2.5g/L). Metalaxyl for late blight susceptibility.",
    preventiveMeasures:
      "Use certified blight-resistant varieties (Kufri Jyoti). Maintain pH 5.2–6.0 to reduce scab.",
    confidence: 85,
  },
  "corn|mold": {
    causes:
      "Aflatoxin-producing Aspergillus mold or Gibberella ear rot. Occurs in drought stress followed by humid conditions.",
    treatmentSteps:
      "1. Harvest at optimal moisture (18–22%). 2. Dry grain to below 14% moisture quickly. 3. Store in clean, dry bins with aeration. 4. Reject visibly moldy grain as it's toxic.",
    organicSolutions:
      "Apply Aflasafe biocontrol (non-toxin producing Aspergillus). Ensure proper ventilation in storage.",
    chemicalSolutions:
      "Propiconazole foliar fungicide at tasseling. Post-harvest: Ammonia fumigation for storage mold.",
    preventiveMeasures:
      "Plant adapted hybrids with tight husks. Manage insect damage (borer entry promotes mold). Avoid late planting.",
    confidence: 89,
  },
  "corn|yellow leaves": {
    causes:
      "Nitrogen deficiency (V-pattern yellowing from leaf tip), Stewart's wilt (Pantoea stewartii), or Corn lethal necrosis.",
    treatmentSteps:
      "1. Identify yellowing pattern. 2. Side-dress nitrogen fertilizer if deficient. 3. Control flea beetle (Stewart's wilt vector). 4. Remove severely infected plants to prevent spread.",
    organicSolutions:
      "Blood meal top dressing (nitrogen source). Legume intercropping. Biochar soil amendment.",
    chemicalSolutions:
      "Urea side-dress application (50kg/acre). Carbofuran for flea beetle control.",
    preventiveMeasures:
      "Use nitrogen-efficient hybrids. Soil test before planting. Plant Stewart's wilt resistant varieties.",
    confidence: 83,
  },
  "cotton|brown spots": {
    causes:
      "Bacterial blight (Xanthomonas citri), Cercospora leaf spot, or Alternaria blight. Common in wet humid seasons.",
    treatmentSteps:
      "1. Remove infected plant parts. 2. Apply copper-based bactericide/fungicide. 3. Avoid overhead irrigation. 4. Increase plant spacing for air movement.",
    organicSolutions:
      "Bordeaux mixture (1%) spray. Garlic extract spray (10%). Compost application for soil health.",
    chemicalSolutions:
      "Copper oxychloride 50% WP (3g/L). Streptocycline + Copper oxychloride for bacterial blight.",
    preventiveMeasures:
      "Use disease-resistant cotton varieties. Practice crop rotation. Treat seeds with thiram before planting.",
    confidence: 86,
  },
  "cotton|pests": {
    causes:
      "Bollworm (Helicoverpa armigera), whitefly, or cotton aphid. Bollworm causes massive fruit damage and yield loss.",
    treatmentSteps:
      "1. Install pheromone traps for bollworm monitoring. 2. Release Trichogramma egg parasitoids. 3. Apply Bt spray at early infestation. 4. Chemical spray only when threshold exceeded.",
    organicSolutions:
      "Bacillus thuringiensis (Bt) spray for bollworm. Neem seed kernel extract 5% for whitefly. Marigold trap crop.",
    chemicalSolutions:
      "Emamectin benzoate 5% SG (0.5g/L) for bollworm. Thiamethoxam 25% WG for whitefly (0.5g/L).",
    preventiveMeasures:
      "Plant Bt cotton varieties. Monitor weekly from 45 days. Avoid repeated same-insecticide use.",
    confidence: 91,
  },
  "onion|yellow leaves": {
    causes:
      "Purple blotch (Alternaria porri), downy mildew, or thrips infestation causing silvering then yellowing.",
    treatmentSteps:
      "1. Remove infected leaves. 2. Apply fungicide or insecticide as appropriate. 3. Reduce irrigation frequency. 4. Avoid overhead watering.",
    organicSolutions:
      "Neem oil spray (5ml/L) for thrips. Garlic-chili extract spray. Bordeaux mixture 1% for fungi.",
    chemicalSolutions:
      "Mancozeb 75% WP (2g/L) for blotch. Spinosad 45% SC (0.3ml/L) for thrips.",
    preventiveMeasures:
      "Use thrips-resistant varieties. Maintain good drainage. Avoid dense planting. Crop rotation with cereals.",
    confidence: 84,
  },
};

const SYMPTOM_ALIASES: Record<string, string[]> = {
  "yellow leaves": ["yellowing", "yellow", "chlorosis", "pale leaves"],
  "brown spots": ["spots", "brown", "lesions", "blight"],
  wilting: ["wilt", "drooping", "collapse"],
  pests: ["insects", "bugs", "aphids", "caterpillar", "pest"],
  mold: ["fungus", "mould", "white powder", "rot"],
  "root rot": ["root", "rot", "waterlogging"],
};

function normalizeSymptom(symptom: string): string {
  const s = symptom.toLowerCase();
  for (const [canonical, aliases] of Object.entries(SYMPTOM_ALIASES)) {
    if (s === canonical || aliases.some((a) => s.includes(a))) return canonical;
  }
  return s;
}

export function diagnose(crop: string, symptoms: string[]): DiagnosisResult {
  const cropKey = crop.toLowerCase();
  // Try exact match on first symptom
  for (const symptom of symptoms) {
    const normSymptom = normalizeSymptom(symptom);
    const key = `${cropKey}|${normSymptom}`;
    if (knowledgeBase[key]) return knowledgeBase[key];
  }
  // Fuzzy: try any key with same crop
  const cropEntries = Object.entries(knowledgeBase).filter(([k]) =>
    k.startsWith(`${cropKey}|`),
  );
  if (cropEntries.length > 0) {
    return { ...cropEntries[0][1], confidence: 55 };
  }
  // Generic fallback
  return {
    causes: `Based on your description of ${symptoms.join(", ")} in ${crop}, the most likely cause is a combination of fungal infection and environmental stress. Further field inspection is recommended.`,
    treatmentSteps:
      "1. Remove visibly infected parts. 2. Improve drainage. 3. Adjust fertilization based on soil test. 4. Monitor daily for progression.",
    organicSolutions:
      "Neem oil spray (5ml/L) every 10 days. Compost application for soil health. Seaweed foliar spray.",
    chemicalSolutions:
      "Broad-spectrum fungicide (Mancozeb 2.5g/L). Balanced NPK fertilizer application.",
    preventiveMeasures:
      "Regular scouting, crop rotation every season, maintain proper spacing and drainage.",
    confidence: 45,
  };
}
