export interface Biomolecule {
  id: string;
  name: string;
  formula: string;
  molecularWeight: string;
  class: "pigment" | "structural" | "terpene" | "catalytic" | "carbohydrate";
  description: string;
  biosyntheticLocation: string;
  biologicalRole: string;
  absorptionPeaksNm?: string;
  atoms: {
    element: "C" | "H" | "O" | "N" | "Mg";
    position: [number, number, number];
    radius: number;
    color: string;
  }[];
  bonds: [number, number][]; // Atom index pairs
}

export interface BiochemicalPathwayStep {
  stepNumber: number;
  phase: string;
  name: string;
  reactants: string;
  products: string;
  catalystEnzyme: string;
  energyConsumedOrProduced: string;
  physiologicalSignificance: string;
}

export const BIOMOLECULES: Biomolecule[] = [
  {
    id: "chlorophyll-a",
    name: "Chlorophyll a",
    formula: "C₅₅H₇₂MgN₄O₅",
    molecularWeight: "893.51 g/mol",
    class: "pigment",
    description: "The primary light-absorbing pigment in oxygenic photosynthesis. Features a conjugated tetrapyrrole porphyrin-like chlorin ring coordinating a central magnesium ion (Mg²⁺), anchored to the thylakoid lipid bilayer by a long hydrophobic phytol hydrocarbon tail.",
    biosyntheticLocation: "Plastid envelope inner membrane & thylakoid membrane insertion via Chlorophyll Synthase.",
    biologicalRole: "Transfers resonance excitation energy to reaction center special pairs (P680 in PSII and P700 in PSI), undergoing charge separation to drive electron transport.",
    absorptionPeaksNm: "430 nm (Soret band, blue-violet) and 662 nm (Qy band, deep red)",
    atoms: [
      // Central Mg
      { element: "Mg", position: [0, 0, 0], radius: 0.42, color: "#4ade80" },
      // 4 Coordinating Nitrogens
      { element: "N", position: [0.95, 0.95, 0], radius: 0.32, color: "#3b82f6" },
      { element: "N", position: [-0.95, 0.95, 0], radius: 0.32, color: "#3b82f6" },
      { element: "N", position: [-0.95, -0.95, 0], radius: 0.32, color: "#3b82f6" },
      { element: "N", position: [0.95, -0.95, 0], radius: 0.32, color: "#3b82f6" },
      // Pyrrole Ring I carbons
      { element: "C", position: [1.8, 1.4, 0], radius: 0.3, color: "#334155" },
      { element: "C", position: [1.4, 2.3, 0], radius: 0.3, color: "#334155" },
      { element: "C", position: [0.4, 2.1, 0], radius: 0.3, color: "#334155" },
      // Pyrrole Ring II carbons
      { element: "C", position: [-1.4, 2.3, 0], radius: 0.3, color: "#334155" },
      { element: "C", position: [-2.1, 1.4, 0], radius: 0.3, color: "#334155" },
      { element: "C", position: [-1.8, 0.4, 0], radius: 0.3, color: "#334155" },
      // Pyrrole Ring III carbons
      { element: "C", position: [-2.1, -1.4, 0], radius: 0.3, color: "#334155" },
      { element: "C", position: [-1.4, -2.3, 0], radius: 0.3, color: "#334155" },
      { element: "C", position: [-0.4, -2.1, 0], radius: 0.3, color: "#334155" },
      // Pyrrole Ring IV & Isocyclic ring V
      { element: "C", position: [1.4, -2.3, 0], radius: 0.3, color: "#334155" },
      { element: "C", position: [2.1, -1.4, 0], radius: 0.3, color: "#334155" },
      { element: "C", position: [2.3, -0.3, 0], radius: 0.3, color: "#334155" },
      // Oxygens on keto ester
      { element: "O", position: [2.8, -2.7, 0.1], radius: 0.32, color: "#ef4444" },
      { element: "O", position: [0.8, -3.2, -0.1], radius: 0.32, color: "#ef4444" },
      // Phytol Tail start
      { element: "C", position: [-0.2, -3.0, 0.4], radius: 0.28, color: "#334155" },
      { element: "C", position: [-0.5, -3.6, 1.0], radius: 0.28, color: "#334155" },
      { element: "C", position: [-0.1, -4.2, 1.5], radius: 0.28, color: "#334155" },
      { element: "C", position: [-0.4, -4.8, 2.1], radius: 0.28, color: "#334155" },
      { element: "C", position: [-0.1, -5.4, 2.6], radius: 0.28, color: "#334155" },
    ],
    bonds: [
      [0, 1], [0, 2], [0, 3], [0, 4],
      [1, 5], [5, 6], [6, 7], [7, 1],
      [2, 8], [8, 9], [9, 10], [10, 2],
      [3, 11], [11, 12], [12, 13], [13, 3],
      [4, 14], [14, 15], [15, 16], [16, 4],
      [14, 17], [13, 18], [18, 19], [19, 20], [20, 21], [21, 22], [22, 23],
    ],
  },
  {
    id: "cellulose-unit",
    name: "Cellulose Microfibril Segment (β-1,4-Glucan)",
    formula: "(C₆H₁₀O₅)n",
    molecularWeight: "300,000 - 500,000 g/mol (polymer)",
    class: "structural",
    description: "Linear polysaccharide composed of repeating D-glucose units linked by β-(1→4)-glycosidic bonds. Each alternate glucose residue is rotated 180°, allowing adjacent parallel glucan chains to form extensive intra- and inter-chain hydrogen bonds, creating crystal microfibrils of tremendous tensile strength.",
    biosyntheticLocation: "Synthesized directly at the plasma membrane by hexameric Rosette CesA complexes.",
    biologicalRole: "Provides the primary load-bearing scaffold of the plant cell wall, resisting internal turgor pressures exceeding 2 MPa.",
    atoms: [
      // Glucose 1 Ring
      { element: "C", position: [-2.4, 0.4, 0], radius: 0.28, color: "#334155" },
      { element: "C", position: [-1.6, 1.2, 0], radius: 0.28, color: "#334155" },
      { element: "C", position: [-0.7, 0.5, 0], radius: 0.28, color: "#334155" },
      { element: "O", position: [-1.2, -0.6, 0], radius: 0.3, color: "#ef4444" },
      { element: "C", position: [-2.1, -0.6, 0], radius: 0.28, color: "#334155" },
      // Glycosidic bridging oxygen
      { element: "O", position: [0.0, 1.1, 0.1], radius: 0.32, color: "#ef4444" },
      // Glucose 2 Ring (Flipped 180°)
      { element: "C", position: [0.7, 0.5, 0], radius: 0.28, color: "#334155" },
      { element: "C", position: [1.6, 1.2, 0], radius: 0.28, color: "#334155" },
      { element: "C", position: [2.4, 0.4, 0], radius: 0.28, color: "#334155" },
      { element: "O", position: [1.2, -0.6, 0], radius: 0.3, color: "#ef4444" },
      { element: "C", position: [2.1, -0.6, 0], radius: 0.28, color: "#334155" },
      // Hydroxyl oxygens (H-bonds)
      { element: "O", position: [-3.0, 0.9, 0.2], radius: 0.28, color: "#ef4444" },
      { element: "O", position: [-1.8, 2.2, -0.1], radius: 0.28, color: "#ef4444" },
      { element: "O", position: [1.8, 2.2, 0.1], radius: 0.28, color: "#ef4444" },
      { element: "O", position: [3.0, 0.9, -0.2], radius: 0.28, color: "#ef4444" },
    ],
    bonds: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 0],
      [2, 5], [5, 6],
      [6, 7], [7, 8], [8, 9], [9, 10], [10, 6],
      [0, 11], [1, 12], [7, 13], [8, 14],
    ],
  },
  {
    id: "beta-caryophyllene",
    name: "Beta-Caryophyllene",
    formula: "C₁₅H₂₄",
    molecularWeight: "204.36 g/mol",
    class: "terpene",
    description: "Bicyclic sesquiterpene featuring a rare nine-membered macrocycle fused to a strained four-membered cyclobutane ring. Endowed with a pungent woody, peppery aroma.",
    biosyntheticLocation: "Glandular trichome plastids and cytosol via the MEP/DOXP pathway and Sesquiterpene Synthases.",
    biologicalRole: "Natural defensive chemical against insect feeding and fungal pathogens. Functions as an airborne volatile signal inducing indirect plant defenses.",
    atoms: [
      { element: "C", position: [-1.2, 0.2, 0], radius: 0.28, color: "#334155" },
      { element: "C", position: [-0.6, 1.2, 0.2], radius: 0.28, color: "#334155" },
      { element: "C", position: [0.6, 1.3, 0.1], radius: 0.28, color: "#334155" },
      { element: "C", position: [1.4, 0.4, -0.1], radius: 0.28, color: "#334155" },
      { element: "C", position: [1.2, -0.8, -0.2], radius: 0.28, color: "#334155" },
      { element: "C", position: [0.2, -1.4, 0.1], radius: 0.28, color: "#334155" },
      { element: "C", position: [-1.0, -1.0, 0.1], radius: 0.28, color: "#334155" },
      // Cyclobutane ring fusion
      { element: "C", position: [-1.8, -0.8, -0.6], radius: 0.26, color: "#334155" },
      { element: "C", position: [-2.0, 0.3, -0.5], radius: 0.26, color: "#334155" },
      // Exocyclic double bond methylene
      { element: "C", position: [2.1, -1.5, -0.5], radius: 0.26, color: "#334155" },
      // Methyl substituents
      { element: "C", position: [-2.8, -1.5, -1.0], radius: 0.25, color: "#334155" },
      { element: "C", position: [0.8, 2.3, 0.3], radius: 0.25, color: "#334155" },
    ],
    bonds: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0],
      [0, 8], [8, 7], [7, 6],
      [4, 9], [7, 10], [2, 11],
    ],
  },
  {
    id: "rubisco-holoenzyme",
    name: "Rubisco Active Catalytic Core",
    formula: "L₈S₈ hexadecameric complex",
    molecularWeight: "550,000 Da (Holoenzyme)",
    class: "catalytic",
    description: "The most abundant enzyme on Earth, comprising up to 50% of total soluble leaf protein. Catalyzes the foundational rate-limiting step of atmospheric CO₂ fixation into organic carbon.",
    biosyntheticLocation: "Chloroplast stroma; large subunits encoded by plastid rbcL gene, small subunits encoded in the nuclear genome (rbcS).",
    biologicalRole: "Carboxylates ribulose-1,5-bisphosphate (RuBP) using atmospheric CO₂ to generate two molecules of 3-phosphoglycerate (3-PGA). Also exhibits competing oxygenase activity causing photorespiration.",
    atoms: [
      // Central Mg2+ in active site
      { element: "Mg", position: [0, 0, 0], radius: 0.45, color: "#4ade80" },
      // Coordinating Lys201 carbamate oxygens
      { element: "O", position: [0.8, 0.5, 0.2], radius: 0.32, color: "#ef4444" },
      { element: "O", position: [0.6, -0.7, -0.1], radius: 0.32, color: "#ef4444" },
      // Asp193 carboxylate
      { element: "O", position: [-0.9, 0.4, -0.3], radius: 0.32, color: "#ef4444" },
      // Glu194 carboxylate
      { element: "O", position: [-0.7, -0.8, 0.2], radius: 0.32, color: "#ef4444" },
      // RuBP substrate C2 & C3 oxygens
      { element: "O", position: [0.1, 1.1, -0.6], radius: 0.32, color: "#ef4444" },
      { element: "O", position: [0.2, -1.0, -0.6], radius: 0.32, color: "#ef4444" },
      // Substrate carbons (RuBP backbone)
      { element: "C", position: [0.9, 1.8, -0.9], radius: 0.3, color: "#334155" },
      { element: "C", position: [0.2, 2.2, -1.2], radius: 0.3, color: "#334155" },
      { element: "C", position: [-0.6, 1.6, -1.5], radius: 0.3, color: "#334155" },
      { element: "C", position: [-0.8, -1.6, -1.5], radius: 0.3, color: "#334155" },
      { element: "C", position: [0.3, -2.1, -1.2], radius: 0.3, color: "#334155" },
    ],
    bonds: [
      [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
      [5, 7], [7, 8], [8, 9], [6, 10], [10, 11],
    ],
  },
];

export const CALVIN_CYCLE_STEPS: BiochemicalPathwayStep[] = [
  {
    stepNumber: 1,
    phase: "Phase 1: Carbon Fixation",
    name: "RuBP Carboxylation",
    reactants: "3 × Ribulose-1,5-bisphosphate (5C) + 3 × CO₂ + 3 × H₂O",
    products: "6 × 3-Phosphoglycerate (3-PGA, 3C)",
    catalystEnzyme: "Rubisco (Carbamylated with Mg²⁺)",
    energyConsumedOrProduced: "Thermally favorable (ΔG°' = -35.1 kJ/mol)",
    physiologicalSignificance: "The sole gateway incorporating atmospheric inorganic carbon into organic biosphere molecules.",
  },
  {
    stepNumber: 2,
    phase: "Phase 2: Reduction",
    name: "3-PGA Phosphorylation",
    reactants: "6 × 3-Phosphoglycerate + 6 × ATP",
    products: "6 × 1,3-Bisphosphoglycerate + 6 × ADP",
    catalystEnzyme: "Phosphoglycerate Kinase (PGK)",
    energyConsumedOrProduced: "Consumes 6 ATP (harvested from thylakoid light reactions)",
    physiologicalSignificance: "High-energy phosphate transfer priming the carboxyl carbon for reduction.",
  },
  {
    stepNumber: 3,
    phase: "Phase 2: Reduction",
    name: "Dehydrogenation to Triose Phosphate",
    reactants: "6 × 1,3-Bisphosphoglycerate + 6 × NADPH + 6 × H⁺",
    products: "6 × Glyceraldehyde-3-phosphate (G3P) + 6 × NADP⁺ + 6 × Pi",
    catalystEnzyme: "NADP-Glyceraldehyde-3-phosphate Dehydrogenase (GAPDH)",
    energyConsumedOrProduced: "Consumes 6 NADPH (reducing power from light reactions)",
    physiologicalSignificance: "Forms glyceraldehyde-3-phosphate: 1 net G3P exported to cytoplasm for sucrose synthesis.",
  },
  {
    stepNumber: 4,
    phase: "Phase 3: Regeneration",
    name: "Triose Sugar Recombination",
    reactants: "5 × Glyceraldehyde-3-phosphate (G3P, 15 carbons total)",
    products: "3 × Ribulose-5-phosphate (Ru5P, 15 carbons total) + 2 × Pi",
    catalystEnzyme: "Aldolase, Transketolase, SBPase (Sedumheptulose-1,7-bisphosphatase)",
    energyConsumedOrProduced: "Complex carbon chain rearrangements (C3 + C3 → C6; C6 + C3 → C4 + C5, etc.)",
    physiologicalSignificance: "Reorganizes 5 three-carbon sugars into 3 five-carbon sugars without losing carbon atoms.",
  },
  {
    stepNumber: 5,
    phase: "Phase 3: Regeneration",
    name: "RuBP Phosphorylation & Cycle Reset",
    reactants: "3 × Ribulose-5-phosphate + 3 × ATP",
    products: "3 × Ribulose-1,5-bisphosphate (RuBP) + 3 × ADP",
    catalystEnzyme: "Phosphoribulokinase (PRK, light-activated by thioredoxin)",
    energyConsumedOrProduced: "Consumes 3 ATP",
    physiologicalSignificance: "Regenerates the CO₂ acceptor molecule RuBP, allowing continuous steady-state carbon capture.",
  },
];
