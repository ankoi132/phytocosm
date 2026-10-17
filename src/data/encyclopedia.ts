export interface GlossaryEntry {
  term: string;
  category: "Histology" | "Cytology" | "Physiology" | "Biochemistry" | "Morphology";
  etymology: string;
  definition: string;
  botanicalSignificance: string;
  relatedSpecies: string[];
}

export const GLOSSARY_ENTRIES: GlossaryEntry[] = [
  {
    term: "Aerenchyma",
    category: "Histology",
    etymology: "Greek 'aer' (air) + 'enchyma' (infusion / tissue)",
    definition: "Specialized spongy plant parenchyma containing continuous intercellular air spaces (lacunae) that facilitate internal gas exchange between aerial shoots and submerged hypoxic or anoxic root systems.",
    botanicalSignificance: "Crucial adaptation in wetland plants (hydrophytes) such as rice and water lilies, allowing aerobic cellular respiration in waterlogged soil.",
    relatedSpecies: ["Monstera deliciosa", "Nymphaea alba", "Oryza sativa"],
  },
  {
    term: "Atactostele",
    category: "Histology",
    etymology: "Greek 'ataktos' (disordered) + 'stele' (column / pillar)",
    definition: "A type of stele characteristic of monocot stems in which the vascular bundles are scattered throughout the ground parenchyma rather than arranged in concentric rings.",
    botanicalSignificance: "Precludes formation of a bifacial vascular cambium, which is why monocots do not produce true secondary wood rings.",
    relatedSpecies: ["Monstera deliciosa", "Zea mays", "Bambusoideae"],
  },
  {
    term: "Bordered Pit",
    category: "Histology",
    etymology: "Old English 'pytt' (hole) + French 'bordure' (margin)",
    definition: "A microscopic cavity in the lignified secondary cell wall of xylem tracheids and vessels, surrounded by an overhanging secondary wall border and sealed by a flexible porous pit membrane.",
    botanicalSignificance: "In conifers like Sequoia, the central thickened torus acts as a micro-mechanical check valve that seals the pit during cavitation to isolate air embolisms.",
    relatedSpecies: ["Sequoia sempervirens", "Pinus", "Ginkgo biloba"],
  },
  {
    term: "Calvin-Benson Cycle",
    category: "Biochemistry",
    etymology: "Named after Nobel laureates Melvin Calvin and Andrew Benson (1950s)",
    definition: "A series of light-independent biochemical reactions taking place in the chloroplast stroma that assimilates carbon dioxide into three-carbon sugars (triose phosphates) using ATP and NADPH.",
    botanicalSignificance: "The primary biochemical conduit through which non-living atmospheric carbon enters biological organic food webs.",
    relatedSpecies: ["Arabidopsis thaliana", "Monstera deliciosa", "Cannabis sativa"],
  },
  {
    term: "Casparian Strip",
    category: "Histology",
    etymology: "Named after German botanist Robert Caspary (1865)",
    definition: "A band of hydrophobic suberin and lignin impregnating the radial and transverse cell walls of the root endodermis.",
    botanicalSignificance: "Blocks the passive apoplastic movement of water and dissolved solutes, forcing all soil solution to pass through selective plasma membrane transporters.",
    relatedSpecies: ["Arabidopsis thaliana", "Monstera deliciosa", "Cannabis sativa"],
  },
  {
    term: "Chlorenchyma",
    category: "Cytology",
    etymology: "Greek 'chloros' (pale green) + 'enchyma' (tissue)",
    definition: "Photosynthetic parenchyma tissue containing abundant active chloroplasts, predominantly located in leaf mesophyll and young green stems.",
    botanicalSignificance: "Differentiates into columnar palisade parenchyma optimized for photon capture and spongy parenchyma optimized for gas diffusion.",
    relatedSpecies: ["Monstera deliciosa", "Cannabis sativa", "Arabidopsis thaliana"],
  },
  {
    term: "Dichotomous Venation",
    category: "Morphology",
    etymology: "Greek 'dicha' (in two) + 'temnein' (to cut)",
    definition: "A primitive leaf vein pattern where the veins repeatedly fork into two roughly equal branches without forming anastomosing cross-vein networks.",
    botanicalSignificance: "An ancient phylogenetic hallmark preserved in Ginkgo biloba and primitive ferns, predating modern angiosperm reticulate venation.",
    relatedSpecies: ["Ginkgo biloba", "Adiantum", "Osmunda"],
  },
  {
    term: "Hydathode",
    category: "Histology",
    etymology: "Greek 'hydor' (water) + 'hodos' (way / path)",
    definition: "A modified pore on leaf margins terminating vascular bundles that passively exudes liquid water droplets under positive root pressure during periods of high humidity (guttation).",
    botanicalSignificance: "Prevents mechanical cell wall rupture and hydrostatic over-pressurization when daytime transpiration is suppressed.",
    relatedSpecies: ["Cannabis sativa", "Fragaria", "Alchemilla"],
  },
  {
    term: "Kranz Anatomy",
    category: "Histology",
    etymology: "German 'Kranz' (wreath / crown)",
    definition: "A specialized anatomical arrangement in C4 plant leaves where vascular bundles are surrounded by a concentric wreath of enlarged, chloroplast-rich bundle sheath cells, enclosed by outer mesophyll cells.",
    botanicalSignificance: "Enables spatial separation of initial CO₂ carboxylation (by PEP carboxylase in mesophyll) and decarboxylation around Rubisco in bundle sheaths, eliminating photorespiration.",
    relatedSpecies: ["Zea mays", "Saccharum officinarum", "Sorghum bicolor"],
  },
  {
    term: "Plasmodesmata",
    category: "Cytology",
    etymology: "Greek 'plasma' (formed thing) + 'desma' (bond / link)",
    definition: "Microscopic symplastic channels traversing plant cell walls, linking the cytoplasm and endoplasmic reticulum of adjacent cells into a continuous physiological syncytium.",
    botanicalSignificance: "Enables direct non-vesicular intercellular communication, hormonal distribution, and systemic RNA signaling.",
    relatedSpecies: ["Arabidopsis thaliana", "Cannabis sativa", "Monstera deliciosa"],
  },
  {
    term: "Rubisco",
    category: "Biochemistry",
    etymology: "Acronym for Ribulose-1,5-bisphosphate carboxylase-oxygenase",
    definition: "The most abundant enzyme on Earth, catalyzing the addition of CO₂ (or O₂) to ribulose-1,5-bisphosphate in the first step of photosynthetic carbon assimilation.",
    botanicalSignificance: "Operates at relatively slow catalytic rates (2-5 reactions/sec), forcing plants to allocate immense nitrogen resources toward synthesizing huge quantities of this enzyme.",
    relatedSpecies: ["Monstera deliciosa", "Cannabis sativa", "Sequoia sempervirens"],
  },
  {
    term: "Tonoplast",
    category: "Cytology",
    etymology: "Greek 'tonos' (tension) + 'plastos' (formed)",
    definition: "The semi-permeable lipid bilayer membrane delimiting the central vacuole in plant cells.",
    botanicalSignificance: "Maintains steep electrochemical gradients across its membrane via V-type ATPases and pyrophosphatases to drive turgor-driven cell expansion and metabolite accumulation.",
    relatedSpecies: ["Arabidopsis thaliana", "Monstera deliciosa", "Dionaea muscipula"],
  },
  {
    term: "Trichome",
    category: "Morphology",
    etymology: "Greek 'trichoma' (growth of hair)",
    definition: "An epidermal outgrowth on leaves, stems, or flowers that may be unicellular or multicellular, glandular (secretory) or non-glandular.",
    botanicalSignificance: "Functions in physical herbivore deterrence, UV-B light scattering, transpiration boundary layer insulation, and synthesis of secondary metabolites like cannabinoids and terpenes.",
    relatedSpecies: ["Cannabis sativa", "Arabidopsis thaliana", "Urtica dioica"],
  },
  {
    term: "Xylem Tracheid",
    category: "Histology",
    etymology: "Greek 'xylon' (wood) + 'tracheia' (windpipe)",
    definition: "An elongated, spindle-shaped, dead conducting cell with heavily lignified secondary cell walls and bordered pits, characteristic of gymnosperms and primitive angiosperms.",
    botanicalSignificance: "Conducts water under immense tension generated by foliar transpiration; narrow diameter provides structural safety against runaway freeze-thaw cavitation.",
    relatedSpecies: ["Sequoia sempervirens", "Ginkgo biloba", "Pinus sylvestris"],
  },
];
