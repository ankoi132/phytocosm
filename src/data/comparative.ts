export interface ComparativeCategory {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  items: {
    name: string;
    scientificGroup: string;
    stemAnatomy: string;
    leafAnatomy: string;
    vascularArrangement: string;
    stomatalDistribution: string;
    evolutionaryAdvantage: string;
    representativeSpecies: string[];
    waterUseEfficiency: string;
    keyDifferencePoints: string[];
  }[];
}

export const COMPARATIVE_DATA: ComparativeCategory[] = [
  {
    id: "monocot-vs-dicot",
    title: "Monocotyledonae vs. Eudicotyledonae",
    subtitle: "Fundamental Structural Divergence in Angiosperm Vascular Architecture",
    description: "Angiosperms diverged into monocots and eudicots over 140 million years ago, leading to contrasting vascular bundle configurations, secondary growth potential, and venation networks.",
    items: [
      {
        name: "Monocotyledons (Monocots)",
        scientificGroup: "Clade Monocotyledoneae (e.g. Zea mays, Monstera, Grasses, Palms)",
        stemAnatomy: "Atactostele: vascular bundles scattered randomly throughout ground parenchyma tissue without pith/cortex distinction.",
        leafAnatomy: "Isobilateral lamina with parallel venation (striate); stomata equally distributed on both adaxial and abaxial surfaces (amphistomatic).",
        vascularArrangement: "Closed collateral bundles (no vascular cambium); closed off by a complete sclerenchyma ring. Secondary thickening growth absent or anomalous.",
        stomatalDistribution: "Graminaceous dumbbell-shaped guard cells arranged in linear parallel files.",
        evolutionaryAdvantage: "Extremely rapid vertical elongation with minimal energetic investment in secondary wood; high flexibility in wind.",
        representativeSpecies: ["Monstera deliciosa", "Zea mays (Corn)", "Oryza sativa (Rice)", "Phyllostachys (Bamboo)"],
        waterUseEfficiency: "Moderate to high; hydraulic architecture vulnerable to freeze-thaw cavitation due to inability to produce replacement xylem rings.",
        keyDifferencePoints: [
          "Scattered vascular bundles (Atactostele)",
          "Parallel leaf venation",
          "Fibrous adventitious root system",
          "No vascular cambium (No true secondary wood rings)",
          "Single cotyledon in seed embryo",
        ],
      },
      {
        name: "Eudicotyledons (Dicots)",
        scientificGroup: "Clade Eudicotyledoneae (e.g. Cannabis, Arabidopsis, Quercus, Helianthus)",
        stemAnatomy: "Eustele: vascular bundles arranged in an orderly concentric ring surrounding a central pith, bordered externally by the cortex.",
        leafAnatomy: "Dorsiventral lamina with distinct upper palisade and lower spongy mesophyll; reticulate (netted) venation with anastomoses.",
        vascularArrangement: "Open collateral bundles containing a bifacial vascular cambium meristem between xylem and phloem, enabling secondary wood ring accumulation.",
        stomatalDistribution: "Kidney-shaped (reniform) guard cells distributed irregularly across predominantly lower abaxial surface (hypostomatic).",
        evolutionaryAdvantage: "Indefinite secondary thickening growth enabling massive structural longevity, trunk formation, and canopy dominance.",
        representativeSpecies: ["Cannabis sativa", "Arabidopsis thaliana", "Dionaea muscipula", "Quercus robur (Oak)"],
        waterUseEfficiency: "High hydraulic redundancy; interconnected net veins bypass localized conduit embolisms, and annual cambium lays down fresh xylem vessels.",
        keyDifferencePoints: [
          "Ring-arranged vascular bundles (Eustele)",
          "Hierarchical reticulate net venation",
          "Persistent taproot root system",
          "Bifacial cambium generating concentric wood rings",
          "Two cotyledons in seed embryo",
        ],
      },
    ],
  },
  {
    id: "c3-c4-cam",
    title: "C3 vs. C4 vs. CAM Photosynthetic Adaptations",
    subtitle: "Biochemical & Histological Solutions to Overcome Photorespiration",
    description: "Plants evolved alternative biochemical pumps and anatomical adaptations to bypass Rubisco's wasteful oxygenase activity and maximize water-use efficiency under heat and aridity.",
    items: [
      {
        name: "C3 Pathway (Ancestral)",
        scientificGroup: "Standard Mesophytic Flora (85% of plant species)",
        stemAnatomy: "Conventional cortical and vascular distribution.",
        leafAnatomy: "Standard dorsiventral or isolateral mesophyll without specialized bundle sheath chloroplasts.",
        vascularArrangement: "Bundle sheath cells small, unspecialized, devoid of or poor in chloroplasts.",
        stomatalDistribution: "Open during daytime; closes during midday drought stress.",
        evolutionaryAdvantage: "Most energetically efficient under cool to temperate temperatures, high moisture, and elevated CO₂ (only 3 ATP per CO₂ fixed).",
        representativeSpecies: ["Monstera deliciosa", "Cannabis sativa", "Arabidopsis thaliana", "Ginkgo biloba"],
        waterUseEfficiency: "Low: 400 - 500 g H₂O transpired per 1 g dry biomass produced. Photorespiration wastes up to 30% of energy at temperatures >28°C.",
        keyDifferencePoints: [
          "Primary CO₂ fixing enzyme: Rubisco directly",
          "First stable product: 3-Phosphoglycerate (3-carbon)",
          "No spatial or temporal separation",
          "Vulnerable to photorespiration in hot/dry conditions",
        ],
      },
      {
        name: "C4 Pathway (Kranz Anatomy)",
        scientificGroup: "Tropical & Savanna Grasses (e.g. Corn, Sugarcane, Sorghum, Amaranth)",
        stemAnatomy: "Rapid axial transport supporting explosive summer growth.",
        leafAnatomy: "Kranz (Wreath) Anatomy: Vascular bundles encircled by a concentric ring of large, chloroplast-dense bundle sheath cells, surrounded by mesophyll cells.",
        vascularArrangement: "Tight interveinal distance ensuring every mesophyll cell is within 2-3 cells of a bundle sheath cell.",
        stomatalDistribution: "Daytime stomatal opening with reduced pore aperture due to high internal CO₂ concentration.",
        evolutionaryAdvantage: "Spatial separation: PEP Carboxylase fixes CO₂ in mesophyll cells into 4C malate, pumped into bundle sheaths where Rubisco operates under 10× CO₂ concentration, completely abolishing photorespiration.",
        representativeSpecies: ["Zea mays (Corn)", "Saccharum officinarum (Sugarcane)", "Amaranthus retroflexus"],
        waterUseEfficiency: "High: 250 - 300 g H₂O per 1 g dry biomass produced. Thrives in high-light, high-temperature (30-45°C) habitats.",
        keyDifferencePoints: [
          "Spatial separation between mesophyll and bundle sheath cells",
          "Kranz wreath anatomy with specialized bundle sheath chloroplasts",
          "Primary fixing enzyme: PEP carboxylase (no affinity for O₂)",
          "Zero photorespiration losses at high temperatures",
        ],
      },
      {
        name: "CAM Pathway (Temporal Separation)",
        scientificGroup: "Crassulacean Acid Metabolism (Succulents, Cacti, Pineapple, Orchids)",
        stemAnatomy: "Extensively succulent water-storage parenchyma (hydrenchyma).",
        leafAnatomy: "Fleshy succulent leaves or cladodes with huge vacuoles storing nighttime malic acid.",
        vascularArrangement: "Embedded within mucilaginous water-holding parenchyma.",
        stomatalDistribution: "Inverted stomatal rhythm: Open strictly at NIGHT; sealed completely shut during scorching DAY.",
        evolutionaryAdvantage: "Temporal separation: Atmospheric CO₂ is captured at night when humidity is high and temperatures are low, stored as vacuolar malic acid. During daytime, stomata close, and malate is decarboxylated inside the cell to feed Rubisco behind sealed pores.",
        representativeSpecies: ["Ananas comosus (Pineapple)", "Aloe vera", "Kalanchoe daigremontiana", "Opuntia (Prickly Pear)"],
        waterUseEfficiency: "Extreme: 50 - 100 g H₂O per 1 g dry biomass produced. Survives hyper-arid deserts and severe droughts.",
        keyDifferencePoints: [
          "Temporal separation: Nighttime CO₂ uptake, daytime Calvin cycle",
          "Inverted stomatal opening (Nocturnal transpiration only)",
          "Extreme leaf or stem succulence with giant central vacuoles",
          "Highest water use efficiency in the plant kingdom",
        ],
      },
    ],
  },
  {
    id: "ecological-types",
    title: "Hydrophytes vs. Mesophytes vs. Xerophytes",
    subtitle: "Tissue Adaptations Across the Water Availability Gradient",
    description: "Water availability dictates profound histological compromises between gas exchange, structural support, and desiccation prevention.",
    items: [
      {
        name: "Hydrophytes (Aquatic Plants)",
        scientificGroup: "Submerged & Floating Macrophytes (e.g. Nymphaea, Elodea)",
        stemAnatomy: "Drastically reduced xylem; vascular tissue consolidated into a minimal central strand without mechanical fibers.",
        leafAnatomy: "Extensive Aerenchyma: honeycombed tissue riddled with massive gas lacunae providing buoyancy and internal oxygen diffusion pathways to submerged roots.",
        vascularArrangement: "Rudimentary vascular bundles; water absorption occurs directly across thin epidermal surfaces.",
        stomatalDistribution: "Submerged leaves lack stomata completely; floating leaves are epistomatic (stomata exclusively on upper sun-exposed surface).",
        evolutionaryAdvantage: "Maximizes oxygen delivery to hypoxic mud environments; eliminates energetic cost of building lignified xylem.",
        representativeSpecies: ["Nymphaea alba (Water Lily)", "Elodea canadensis", "Nelumbo nucifera (Lotus)"],
        waterUseEfficiency: "Not applicable (surrounded by water); primary ecological challenge is gas diffusion in aquatic medium.",
        keyDifferencePoints: [
          "Extensive honeycomb Aerenchyma tissue",
          "Extremely thin, non-cutinized or reduced cuticle",
          "Rudimentary, unlignified xylem conduits",
          "Epistomatic or astomatic leaf blades",
        ],
      },
      {
        name: "Xerophytes (Arid & Desert Plants)",
        scientificGroup: "Desert & Mediterranean Sclerophylls (e.g. Nerium oleander, Agave, Cacti)",
        stemAnatomy: "Heavily lignified, thick bark or photosynthetic succulent green stems (cladodes).",
        leafAnatomy: "Multi-layered epidermis, exceptionally thick cuticular wax, hypodermal sclerenchyma, and sunken stomatal crypts filled with protective trichomes.",
        vascularArrangement: "High-density vascular network with reinforced xylem tracheids resistant to negative pressure collapse down to -8.0 MPa.",
        stomatalDistribution: "Hypostomatic; stomata sequestered inside deep crypts or grooves that trap still, humid boundary air.",
        evolutionaryAdvantage: "Prevents fatal desiccation and cellular collapse during multi-month severe desert droughts.",
        representativeSpecies: ["Nerium oleander", "Agave americana", "Carnegiea gigantea (Saguaro)"],
        waterUseEfficiency: "Outstanding: tight hormonal regulation of stomatal conductance via abscisic acid; high hydraulic safety margin.",
        keyDifferencePoints: [
          "Deep stomatal crypts lined with reflective hairs",
          "Multi-layered epidermis with heavy cutin/suberin armor",
          "Abundant water-storage mucilage parenchyma",
          "Reinforced sclerenchyma resisting cellular wilting collapse",
        ],
      },
    ],
  },
];
