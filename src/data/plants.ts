export interface HistologicalLayer {
  id: string;
  name: string;
  scientificTerm: string;
  depthRangeUm: string;
  description: string;
  cellularDetails: string;
  chloroplastDensity: string; // e.g. "Very High (~40-50 per cell)", "Absent"
  keyMolecules: string[];
  physiologicalRole: string;
  colorHex: string;
}

export interface HotspotPin {
  id: string;
  label: string;
  category: "morphology" | "histology" | "biochemistry" | "physiology";
  position: [number, number, number]; // 3D local coordinates
  title: string;
  description: string;
  detailData: {
    metric: string;
    value: string;
    significance: string;
  };
}

export interface PlantSpecimen {
  id: string;
  commonName: string;
  scientificName: string;
  family: string;
  order: string;
  clade: string;
  habitat: string;
  photosynthesisType: "C3" | "C4" | "CAM";
  primaryMetabolites: {
    cellulosePercent: number;
    ligninPercent: number;
    hemicellulosePercent: number;
    pectinPercent: number;
    waterContentPercent: number;
  };
  keyPhytochemicals: {
    name: string;
    category: string;
    formula: string;
    role: string;
  }[];
  overview: string;
  evolutionaryAdaptation: string;
  vascularBiomechanics: {
    xylemConductivity: string;
    phloemOsmoticPressure: string;
    transpirationRate: string;
    turgorPressure: string;
  };
  geometryConfig: {
    modelType: "monstera" | "cannabis" | "sequoia" | "arabidopsis" | "dionaea" | "ginkgo";
    leafCount: number;
    baseColor: string;
    accentColor: string;
    veinColor: string;
    stemColor: string;
    scale: number;
  };
  histologicalLayers: HistologicalLayer[];
  hotspots: HotspotPin[];
}

export const PLANT_SPECIMENS: PlantSpecimen[] = [
  {
    id: "monstera-deliciosa",
    commonName: "Monstera Deliciosa",
    scientificName: "Monstera deliciosa Liebm.",
    family: "Araceae",
    order: "Alismatales",
    clade: "Monocotyledons",
    habitat: "Tropical rainforest understory, Central America",
    photosynthesisType: "C3",
    primaryMetabolites: {
      cellulosePercent: 38,
      ligninPercent: 18,
      hemicellulosePercent: 22,
      pectinPercent: 7,
      waterContentPercent: 88,
    },
    keyPhytochemicals: [
      {
        name: "Calcium Oxalate Raphides",
        category: "Crystal Defense",
        formula: "CaC₂O₄·H₂O",
        role: "Microscopic needle crystals bundled in specialized idioblasts to deter phytophagous herbivores.",
      },
      {
        name: "Chlorophyll a/b",
        category: "Pigment",
        formula: "C₅₅H₇₂MgN₄O₅",
        role: "High b/a ratio adaptation to harvest blue-green filtered shade light in dense tropical forest understory.",
      },
      {
        name: "Epicuticular Wax Esters",
        category: "Lipid",
        formula: "C₃₀H₆₀O₂+",
        role: "Hydrophobic surface barrier preventing epiphyllous fungi growth in warm high-humidity climates.",
      },
      {
        name: "Flavonol Glycosides",
        category: "Antioxidant",
        formula: "C₂₁H₂₀O₁₁",
        role: "Quenches reactive oxygen species generated during sudden tropical sunfleck exposure.",
      },
    ],
    overview:
      "Monstera deliciosa is a hemiepiphytic tropical liana characterized by large, glossy, fenestrated (perforated) leaves. In its native habitat, it climbs host tree trunks using negatively phototropic adventitious anchor roots, while sending long cord-like aerial feeder roots down to tap subterranean water reserves.",
    evolutionaryAdaptation:
      "Leaf Fenestration (Perforations): Programmed cell death (apoptosis) during early leaf development creates holes that allow hurricane-force winds to pass through without tearing the large lamina, while enabling filtered sunlight to reach lower leaves.",
    vascularBiomechanics: {
      xylemConductivity: "4.8 × 10⁻⁴ kg m⁻¹ s⁻¹ MPa⁻¹ (High hydraulic efficiency)",
      phloemOsmoticPressure: "1.4 to 1.8 MPa in petiolar bundles",
      transpirationRate: "1.2 - 2.5 mmol H₂O m⁻² s⁻¹",
      turgorPressure: "0.45 - 0.70 MPa in palisade parenchyma",
    },
    geometryConfig: {
      modelType: "monstera",
      leafCount: 7,
      baseColor: "#15803d",
      accentColor: "#4ade80",
      veinColor: "#86efac",
      stemColor: "#166534",
      scale: 1.0,
    },
    histologicalLayers: [
      {
        id: "cuticle",
        name: "Upper Cuticle & Epicuticular Wax",
        scientificTerm: "Stratum cuticulare adaxiale",
        depthRangeUm: "0 - 4.5 µm",
        description: "Continuous waxy biopolymer film comprised of cutin polyester cross-linked with long-chain aliphatic waxes.",
        cellularDetails: "Acellular hydrophobic matrix secreted by underlying epidermal cells.",
        chloroplastDensity: "Absent",
        keyMolecules: ["Cutin", "Wax esters", "Triterpenoids"],
        physiologicalRole: "Eliminates non-stomatal transpiration and creates lotus effect water roll-off.",
        colorHex: "#86efac",
      },
      {
        id: "upper-epidermis",
        name: "Adaxial Upper Epidermis",
        scientificTerm: "Epidermis adaxialis uniseriata",
        depthRangeUm: "4.5 - 28 µm",
        description: "Single uniseriate layer of tightly interlocked pavement cells with wavy anticlinal cell walls.",
        cellularDetails: "Pavement cells lack chloroplasts; possess large central vacuoles containing anthocyanins.",
        chloroplastDensity: "Absent (present only in guard cells)",
        keyMolecules: ["Cellulose", "Pectin", "Flavonols"],
        physiologicalRole: "Optical lens effect concentrating incident photons onto palisade cells below.",
        colorHex: "#22c55e",
      },
      {
        id: "palisade-mesophyll",
        name: "Palisade Parenchyma",
        scientificTerm: "Chlorenchyma palissadense",
        depthRangeUm: "28 - 95 µm",
        description: "Columnar chlorenchyma cells oriented perpendicularly to the leaf blade surface.",
        cellularDetails: "Elongated cylindrical cells separated by narrow vertical micro-channels for CO₂ diffusion.",
        chloroplastDensity: "Extremely High (45-65 chloroplasts per cell along peripheral cytoplasm)",
        keyMolecules: ["Chlorophyll a", "Chlorophyll b", "Rubisco holoenzyme", "Starch granules"],
        physiologicalRole: "Primary site of light-dependent photosynthetic carbon fixation.",
        colorHex: "#15803d",
      },
      {
        id: "vascular-bundle",
        name: "Vascular Bundle (Vein)",
        scientificTerm: "Fasciculus vascularis collateralis",
        depthRangeUm: "50 - 150 µm (localized rib)",
        description: "Collateral vascular bundles enclosed within a sclerenchymatous bundle sheath.",
        cellularDetails: "Adaxial xylem featuring annular and spiral helical tracheids; abaxial phloem with sieve tubes.",
        chloroplastDensity: "Absent in conducting elements; low in bundle sheath",
        keyMolecules: ["Lignin (cross-linked guiacyl/syringyl units)", "Cellulose microfibrils", "Callose"],
        physiologicalRole: "Long-distance hydraulic delivery of xylem sap and symplastic phloem sucrose export.",
        colorHex: "#06b6d4",
      },
      {
        id: "spongy-mesophyll",
        name: "Spongy Parenchyma",
        scientificTerm: "Chlorenchyma spongiosum lacunosum",
        depthRangeUm: "95 - 190 µm",
        description: "Lobed, irregularly shaped cells forming a high-porosity labyrinth with 60% gas space volume.",
        cellularDetails: "Extensive intercellular substomatal cavities facilitating gas exchange.",
        chloroplastDensity: "Moderate (15-25 chloroplasts per cell)",
        keyMolecules: ["Carbonic anhydrase", "Chlorophyll a", "Sucrose"],
        physiologicalRole: "Internal diffusion of atmospheric CO₂ and water vapor buffering.",
        colorHex: "#166534",
      },
      {
        id: "lower-epidermis-stomata",
        name: "Abaxial Epidermis & Stomata",
        scientificTerm: "Epidermis abaxialis cum stomatibus",
        depthRangeUm: "190 - 215 µm",
        description: "Hypostomatic epidermal surface containing bean-shaped guard cells flanking the stomatal pore.",
        cellularDetails: "Guard cells with radially arranged cellulose microfibrils and active proton pump H⁺-ATPases.",
        chloroplastDensity: "Present strictly in guard cells (6-12 functional chloroplasts per guard pair)",
        keyMolecules: ["Potassium (K⁺) ions", "Malate²⁻", "Abscisic acid (ABA) receptors"],
        physiologicalRole: "Active regulation of stomatal conductance (opening via K⁺ influx, closing via ABA signaling).",
        colorHex: "#10b981",
      },
    ],
    hotspots: [
      {
        id: "fenestration-margin",
        label: "Lamina Perforation",
        category: "morphology",
        position: [0.6, 1.2, 0.1],
        title: "Programmed Lamina Fenestration",
        description: "Apoptotic necrotic zones formed before leaf unfurling.",
        detailData: {
          metric: "Surface Area Reduction",
          value: "32% wind drag reduction",
          significance: "Prevents mechanical shearing in tropical gale winds while maintaining canopy light interception.",
        },
      },
      {
        id: "primary-vein",
        label: "Midrib Vascular Bundle",
        category: "histology",
        position: [0.0, 0.8, 0.05],
        title: "Sclerenchyma Reinforced Midrib",
        description: "Heavy bundle sheath collenchyma and xylem vessel cluster.",
        detailData: {
          metric: "Hydraulic Flux",
          value: "3.4 ml/hr per leaf blade",
          significance: "Supplies massive capillary tension required for broad-leaf transpiration.",
        },
      },
      {
        id: "petiole-geniculum",
        label: "Pulvinus / Geniculum",
        category: "physiology",
        position: [0.0, -0.4, 0.15],
        title: "Turgor-Driven Phototropic Joint",
        description: "Flexible articulated junction between stem and petiole blade.",
        detailData: {
          metric: "Angular Reorientation",
          value: "Up to 55° arc",
          significance: "Permits dynamic leaf blade reorientation toward shifting sunlight gaps in canopy.",
        },
      },
    ],
  },
  {
    id: "cannabis-sativa",
    commonName: "Cannabis Sativa",
    scientificName: "Cannabis sativa L.",
    family: "Cannabaceae",
    order: "Rosales",
    clade: "Eudicotyledons",
    habitat: "Temperate to sub-tropical alluvial basins, Central Asia origin",
    photosynthesisType: "C3",
    primaryMetabolites: {
      cellulosePercent: 44,
      ligninPercent: 12,
      hemicellulosePercent: 19,
      pectinPercent: 5,
      waterContentPercent: 82,
    },
    keyPhytochemicals: [
      {
        name: "Cannabidiolic Acid (CBDA) / THCA",
        category: "Phytocannabinoid",
        formula: "C₂₂H₃₀O₄",
        role: "Meroterpenoid secondary metabolite synthesized inside disc cells of glandular trichomes.",
      },
      {
        name: "Beta-Caryophyllene",
        category: "Sesquiterpene",
        formula: "C₁₅H₂₄",
        role: "Volatile bicyclic sesquiterpene acting as natural insecticidal defense and floral attractant.",
      },
      {
        name: "Myrcene",
        category: "Monoterpene",
        formula: "C₁₀H₁₆",
        role: "Potent antioxidant and antimicrobial monoterpene concentrated in resin heads.",
      },
      {
        name: "Bast Fiber Cellulose",
        category: "Structural Polymer",
        formula: "(C₆H₁₀O₅)n",
        role: "High-crystallinity cellulose microfibrils in cortical phloem fibers with high tensile strength.",
      },
    ],
    overview:
      "Cannabis sativa is a fast-growing dioecious annual herb celebrated for both its exceptionally strong industrial bast fibers and its complex secondary phytochemistry. Glandular capitate-stalked trichomes densely populate the floral bracts of female plants, serving as micro-chemical factories.",
    evolutionaryAdaptation:
      "Capitate-Stalked Glandular Trichomes: Multicellular secretory organs featuring a basal disc of 8-16 secretory cells capped by a sub-cuticular storage cavity. Terpenophenolic resins accumulate under high pressure to deter insect herbivores and protect developing seeds from UV-B radiation.",
    vascularBiomechanics: {
      xylemConductivity: "6.2 × 10⁻⁴ kg m⁻¹ s⁻¹ MPa⁻¹ (Rapid axial water transit)",
      phloemOsmoticPressure: "2.1 MPa (High sucrose loading for fast vegetative growth)",
      transpirationRate: "3.5 - 5.8 mmol H₂O m⁻² s⁻¹",
      turgorPressure: "0.65 - 0.90 MPa",
    },
    geometryConfig: {
      modelType: "cannabis",
      leafCount: 9,
      baseColor: "#15803d",
      accentColor: "#22c55e",
      veinColor: "#a7f3d0",
      stemColor: "#3f6212",
      scale: 1.1,
    },
    histologicalLayers: [
      {
        id: "glandular-trichome",
        name: "Glandular Capitate-Stalked Trichomes",
        scientificTerm: "Trichoma glandulare capitatum",
        depthRangeUm: "150 - 400 µm (external appendage)",
        description: "Specialized epidermal hair with a multicellular stipe and a globular glandular head.",
        cellularDetails: "Secretory disc cells release terpenes and cannabinoid acids into the expanding subcuticular space.",
        chloroplastDensity: "Low in stipe cells; specialized plastids (lipoplasts) in secretory head",
        keyMolecules: ["THCA synthase", "CBDA synthase", "Geranyl pyrophosphate", "Olivetolic acid"],
        physiologicalRole: "Biosynthesis and accumulation of antimicrobial and UV-protective resin droplets.",
        colorHex: "#fbbf24",
      },
      {
        id: "upper-epidermis",
        name: "Upper Epidermis with Cystolithic Hairs",
        scientificTerm: "Epidermis adaxialis cum trichomatibus cystolithicis",
        depthRangeUm: "0 - 22 µm",
        description: "Single cellular layer interspersed with non-glandular conical hairs containing calcium carbonate deposits.",
        cellularDetails: "Cystoliths composed of amorphous calcium carbonate impregnating a cellulose matrix.",
        chloroplastDensity: "Absent",
        keyMolecules: ["Calcium Carbonate (CaCO₃)", "Silica (SiO₂)"],
        physiologicalRole: "Physical abrasive defense against chewing caterpillars and mechanical herbivory.",
        colorHex: "#86efac",
      },
      {
        id: "palisade-mesophyll",
        name: "Biseriate Palisade Chlorenchyma",
        scientificTerm: "Chlorenchyma palissadense biseriatum",
        depthRangeUm: "22 - 110 µm",
        description: "Two dense tiers of elongated palisade cells optimized for full-sun high-intensity photon capture.",
        cellularDetails: "Packed with active chloroplasts showing high thylakoid stacking.",
        chloroplastDensity: "Extremely High (60-80 chloroplasts per cell)",
        keyMolecules: ["Chlorophyll a/b", "Lutein", "Beta-carotene", "Rubisco"],
        physiologicalRole: "High-capacity carbon fixation driving rapid daily biomass accumulation.",
        colorHex: "#15803d",
      },
      {
        id: "phloem-bast-fibers",
        name: "Cortical Phloem Bast Fibers",
        scientificTerm: "Fila sclerenchymatica phloëmatis",
        depthRangeUm: "Stem cortex (120 - 350 µm)",
        description: "Bundles of extraxylary sclerenchyma fibers with extremely thick secondary cell walls.",
        cellularDetails: "Fiber cells up to 50 mm long; secondary wall accounts for 90% of cross-sectional cell area.",
        chloroplastDensity: "Absent (dead at functional maturity)",
        keyMolecules: ["Crystalline Cellulose (>70%)", "Low Lignin (<5%)", "Pectin matrix"],
        physiologicalRole: "Unmatched longitudinal tensile strength and resistance against stem bucking under wind loads.",
        colorHex: "#06b6d4",
      },
      {
        id: "spongy-mesophyll",
        name: "Spongy Parenchyma & Aerenchymatous Lacunae",
        scientificTerm: "Chlorenchyma spongiosum",
        depthRangeUm: "110 - 180 µm",
        description: "Loosely arranged irregular cells with interconnected air spaces.",
        cellularDetails: "Prominent chloroplasts and vacuolar storage of malate.",
        chloroplastDensity: "Moderate (20-30 per cell)",
        keyMolecules: ["Triose phosphates", "Glutathione"],
        physiologicalRole: "Gas diffusion corridor for rapid CO₂ replenishment to palisade cells.",
        colorHex: "#166534",
      },
      {
        id: "abaxial-stomata",
        name: "Lower Epidermis & Anomocytic Stomata",
        scientificTerm: "Epidermis abaxialis anomocytica",
        depthRangeUm: "180 - 205 µm",
        description: "Dense stomatal field surrounded by cells identical to regular epidermal pavement cells.",
        cellularDetails: "High stomatal frequency (180 - 250 stomata per mm²).",
        chloroplastDensity: "Present only in guard cell pairs",
        keyMolecules: ["Starch", "Phosphoenolpyruvate carboxylase (PEPC)"],
        physiologicalRole: "High-conductance gas exchange supporting vigorous C3 photosynthetic rates.",
        colorHex: "#10b981",
      },
    ],
    hotspots: [
      {
        id: "resin-trichome",
        label: "Capitate Resin Gland",
        category: "biochemistry",
        position: [0.35, 0.7, 0.12],
        title: "Biosynthetic Cavity & Terpene Reservoir",
        description: "Glandular bulb filled with cannabinoid acids and terpenes.",
        detailData: {
          metric: "Resin Head Diameter",
          value: "70 - 110 µm",
          significance: "Houses enzymatic machinery converting CBGA into THCA, CBDA, and CBCA.",
        },
      },
      {
        id: "palmate-serration",
        label: "Serrated Leaf Margin",
        category: "morphology",
        position: [-0.65, 0.9, 0.05],
        title: "Hydathodes & Serration Teeth",
        description: "Marginal teeth terminating in water-secreting hydathodes.",
        detailData: {
          metric: "Guttation Rate",
          value: "0.4 ml/night under root pressure",
          significance: "Exudes excess mineral-rich water when night transpiration ceases, preventing xylem cavitation.",
        },
      },
      {
        id: "bast-bundle",
        label: "Bast Fiber Sclerenchyma",
        category: "histology",
        position: [0.0, -0.3, 0.1],
        title: "Industrial Cellulose Fiber Bundle",
        description: "High-crystallinity cellulose microfibril cables in stem cortex.",
        detailData: {
          metric: "Tensile Strength",
          value: "690 - 1000 MPa",
          significance: "Outperforms standard cotton fibers; provides structural resilience against heavy floral weight.",
        },
      },
    ],
  },
  {
    id: "sequoia-sempervirens",
    commonName: "Coast Redwood",
    scientificName: "Sequoia sempervirens (D. Don) Endl.",
    family: "Cupressaceae",
    order: "Cupressales",
    clade: "Gymnosperms (Conifers)",
    habitat: "Pacific coastal fog belt, Northern California / Oregon",
    photosynthesisType: "C3",
    primaryMetabolites: {
      cellulosePercent: 51,
      ligninPercent: 31,
      hemicellulosePercent: 15,
      pectinPercent: 2,
      waterContentPercent: 58,
    },
    keyPhytochemicals: [
      {
        name: "Condensed Tannins (Proanthocyanidins)",
        category: "Polyphenol",
        formula: "(C₁₅H₁₂O₆)n",
        role: "Impregnates outer bark and heartwood, rendering wood non-flammable and immune to fungal decay.",
      },
      {
        name: "Alpha-Pinene & Limonene",
        category: "Monoterpenes",
        formula: "C₁₀H₁₆",
        role: "Volatile conifer oleoresin sealing physical trunk wounds against bark beetles and pathogens.",
      },
      {
        name: "Guaiacyl Lignin",
        category: "Structural Polymer",
        formula: "Cross-linked aromatic polymer",
        role: "Provides compressive stiffness to withstand extreme gravity and wind moments up to 115 meters high.",
      },
      {
        name: "Foliar Epicuticular Lipids",
        category: "Wax Hydrocarbons",
        formula: "C₂₉H₆₀+",
        role: "Aids foliar water uptake: directly absorbs condensing coastal fog droplets across needle surfaces.",
      },
    ],
    overview:
      "Sequoia sempervirens is the tallest living organism on Earth, reaching heights over 115.9 meters. Operating at the physical and hydraulic limit of water transport, redwoods rely on border-pitted tracheids under extreme negative pressure (-2.0 MPa) and absorb up to 34% of their annual moisture directly from coastal summer fog via foliar absorption.",
    evolutionaryAdaptation:
      "Bordered Pit Torus-Margo Valves: Tracheid conduits feature micro-mechanical valve pit membranes. If cavitation occurs (air bubble embolism), the imperforate torus slams against the pit aperture, isolating the embolized conduit and preventing catastrophic hydraulic system collapse.",
    vascularBiomechanics: {
      xylemConductivity: "1.9 × 10⁻⁴ kg m⁻¹ s⁻¹ MPa⁻¹ (High safety margin against cavitation)",
      phloemOsmoticPressure: "1.9 MPa (Drives hydrostatic Münch flow across >100m vertical drop)",
      transpirationRate: "0.8 - 1.9 mmol H₂O m⁻² s⁻¹",
      turgorPressure: "0.15 - 0.35 MPa at 110m canopy apex",
    },
    geometryConfig: {
      modelType: "sequoia",
      leafCount: 16,
      baseColor: "#14532d",
      accentColor: "#15803d",
      veinColor: "#4ade80",
      stemColor: "#78350f",
      scale: 1.25,
    },
    histologicalLayers: [
      {
        id: "rhytidome-bark",
        name: "Fibrous Rhytidome (Outer Bark)",
        scientificTerm: "Rhytidoma fibrosum suberosum",
        depthRangeUm: "15,000 - 300,000 µm (15-30 cm)",
        description: "Thick spongy, fire-resistant outer bark composed of alternating layers of dead phloem and phellem (cork).",
        cellularDetails: "Cells heavily impregnated with suberin waxes and high concentrations of condensed tannins.",
        chloroplastDensity: "Absent",
        keyMolecules: ["Suberin", "Tannins (>15% dry weight)", "Lignin"],
        physiologicalRole: "Thermal insulation shielding the living vascular cambium from intense forest wildfire heat.",
        colorHex: "#78350f",
      },
      {
        id: "vascular-cambium",
        name: "Vascular Cambium Meristem",
        scientificTerm: "Meristema cambiale laterale",
        depthRangeUm: "Cellular layer (15 - 40 µm)",
        description: "Bifacial lateral meristem responsible for continuous secondary xylem (wood) and phloem (bark) generation.",
        cellularDetails: "Fusiform initials yielding axial tracheids, and ray initials yielding radial parenchyma rays.",
        chloroplastDensity: "Absent",
        keyMolecules: ["Auxin (IAA)", "Cyclins", "Cellulose synthases (CesA)"],
        physiologicalRole: "Indefinite radial stem growth enabling trees to live for more than 2,000 years.",
        colorHex: "#eab308",
      },
      {
        id: "secondary-xylem",
        name: "Secondary Xylem Wood (Tracheids)",
        scientificTerm: "Xylema secundarium tracheidale",
        depthRangeUm: "Trunk interior (up to 4.5 meters radius)",
        description: "Homoxylous gymnosperm wood composed entirely of narrow, bordered-pitted tracheids.",
        cellularDetails: "Dead hollow spindle-shaped cells with thick lignified secondary cell walls and torus-margo pits.",
        chloroplastDensity: "Absent",
        keyMolecules: ["Guaiacyl Lignin", "Cellulose microfibrils (S2 layer angle 10-15°)", "Hemicellulose (glucomannan)"],
        physiologicalRole: "Conducts water under extreme hydrostatic tension while providing structural load support.",
        colorHex: "#06b6d4",
      },
      {
        id: "needle-hypodermis",
        name: "Sclerified Needle Hypodermis",
        scientificTerm: "Hypodermis sclerotica foliaris",
        depthRangeUm: "8 - 35 µm below epidermis",
        description: "Layer of thick-walled fiber-like cells directly beneath the needle epidermis.",
        cellularDetails: "Narrow lumina with heavily lignified, multi-layered cell walls.",
        chloroplastDensity: "Absent",
        keyMolecules: ["Lignin", "Cellulose"],
        physiologicalRole: "Prevents mechanical needle collapse under extreme leaf water deficits (-2.5 MPa).",
        colorHex: "#15803d",
      },
      {
        id: "transfusion-tissue",
        name: "Transfusion Tissue & Resin Canal",
        scientificTerm: "Textus transfusionis cum canali resinifero",
        depthRangeUm: "Central needle core",
        description: "Specialized parenchyma and pitted transfusion tracheids flanking the solitary needle vein.",
        cellularDetails: "Epithelial cells lining an axial resin duct that secretes defensive terpenes.",
        chloroplastDensity: "Low to moderate",
        keyMolecules: ["Monoterpenes", "Resin acids (Abietic acid)"],
        physiologicalRole: "Transfers water radially from central vein to photosynthetic mesophyll; synthesizes defensive resin.",
        colorHex: "#10b981",
      },
    ],
    hotspots: [
      {
        id: "torus-margo",
        label: "Bordered Pit Valve",
        category: "histology",
        position: [0.0, 0.4, 0.15],
        title: "Torus-Margo Pit Membrane",
        description: "Nano-engineered microfluidic check valve between tracheids.",
        detailData: {
          metric: "Safety Margin",
          value: "Cavitation threshold: -4.5 MPa",
          significance: "Torus seals pit aperture instantly if an embolism forms, saving neighboring conduits.",
        },
      },
      {
        id: "fog-uptake",
        label: "Foliar Fog Condenser",
        category: "physiology",
        position: [0.45, 0.9, -0.1],
        title: "Reverse Hydraulic Fog Absorption",
        description: "Direct retrograde hydration across needle cuticular pores.",
        detailData: {
          metric: "Water Contribution",
          value: "Up to 34% total seasonal water",
          significance: "Bypasses 100m gravity gradient by taking water directly from atmospheric fog banks.",
        },
      },
      {
        id: "tannin-bark",
        label: "Tannin Fire Armor",
        category: "biochemistry",
        position: [-0.2, -0.6, 0.1],
        title: "Condensed Tannin Barrier",
        description: "Fibrous bark impregnated with high concentrations of polyphenols.",
        detailData: {
          metric: "Bark Thickness",
          value: "Up to 30 cm",
          significance: "Acts as a thermal ablative shield that self-extinguishes ground fire flames.",
        },
      },
    ],
  },
  {
    id: "arabidopsis-thaliana",
    commonName: "Thale Cress",
    scientificName: "Arabidopsis thaliana (L.) Heynh.",
    family: "Brassicaceae",
    order: "Brassicales",
    clade: "Eudicotyledons",
    habitat: "Disturbed open soils, Eurasia & North Africa",
    photosynthesisType: "C3",
    primaryMetabolites: {
      cellulosePercent: 32,
      ligninPercent: 14,
      hemicellulosePercent: 24,
      pectinPercent: 11,
      waterContentPercent: 91,
    },
    keyPhytochemicals: [
      {
        name: "Glucosinolates (Aliphatic/Indolic)",
        category: "Secondary Glucoside",
        formula: "R-C(=N-O-SO₃⁻)-S-Glc",
        role: "The 'Mustard Oil Bomb': cleaved by myrosinase upon cell rupture to release toxic isothiocyanates.",
      },
      {
        name: "Sinapoyl Malate",
        category: "Phenylpropanoid",
        formula: "C₁₅H₁₆O₉",
        role: "Accumulates in upper epidermal vacuoles to provide UV-B optical shielding.",
      },
      {
        name: "Brassinosteroids (Brassinolide)",
        category: "Phytochrome Hormone",
        formula: "C₂₈H₄₈O₆",
        role: "Master steroid hormone regulating cell elongation, vascular differentiation, and senescence.",
      },
    ],
    overview:
      "Arabidopsis thaliana is the preeminent model organism in plant biology and genomics. With a small, sequenced genome (~135 Mb), a 6-week rapid generation cycle, and straightforward genetic transformation via floral dipping, Arabidopsis has illuminated photomorphogenesis, circadian clocks, and hormone signaling pathways.",
    evolutionaryAdaptation:
      "One-Cell Spacing Stomatal Patterning: Driven by peptide ligands (EPF1/EPF2) and receptor kinases (ERECTA/TMM), epidermal cell division strictly enforces the 'one-cell spacing rule', guaranteeing that two stomata never touch, optimizing gas diffusion boundaries.",
    vascularBiomechanics: {
      xylemConductivity: "2.1 × 10⁻⁴ kg m⁻¹ s⁻¹ MPa⁻¹",
      phloemOsmoticPressure: "1.2 MPa",
      transpirationRate: "1.8 - 3.2 mmol H₂O m⁻² s⁻¹",
      turgorPressure: "0.40 - 0.60 MPa",
    },
    geometryConfig: {
      modelType: "arabidopsis",
      leafCount: 12,
      baseColor: "#16a34a",
      accentColor: "#4ade80",
      veinColor: "#bbf7d0",
      stemColor: "#15803d",
      scale: 0.9,
    },
    histologicalLayers: [
      {
        id: "trichome-unicellular",
        name: "Stellate Unicellular Trichomes",
        scientificTerm: "Trichoma unicellulare stellatum",
        depthRangeUm: "100 - 300 µm projection",
        description: "Giant single-cell, 3-branched hair projecting above the rosette leaf epidermis.",
        cellularDetails: "Single cell with endoreduplicated polyploid nucleus (up to 32C DNA content).",
        chloroplastDensity: "Absent",
        keyMolecules: ["Callose", "Cellulose", "Microtubule organizing proteins"],
        physiologicalRole: "Forms an air boundary layer reducing transpiration and physically deterring small insect walk.",
        colorHex: "#86efac",
      },
      {
        id: "adaxial-epidermis",
        name: "Pavement Cells & Puzzle Morphology",
        scientificTerm: "Epidermis adaxialis sinuosa",
        depthRangeUm: "0 - 18 µm",
        description: "Epidermal pavement cells interlocking like jigsaw puzzle pieces with alternating convex/concave necks.",
        cellularDetails: "Interlocking controlled by Rho of Plants (ROP) GTPase-regulated actin and microtubule arrays.",
        chloroplastDensity: "Absent",
        keyMolecules: ["Pectin", "Hemicellulose (xyloglucan)", "Sinapate esters"],
        physiologicalRole: "Minimizes mechanical stress concentrations across the rapidly expanding leaf blade.",
        colorHex: "#22c55e",
      },
      {
        id: "palisade-chlorenchyma",
        name: "Palisade Chlorenchyma",
        scientificTerm: "Chlorenchyma palissadense",
        depthRangeUm: "18 - 65 µm",
        description: "Single uniseriate layer of columnar cells packed with actively photorelocating chloroplasts.",
        cellularDetails: "Chloroplasts move via actin filaments to leaf surface in dim light (accumulation) or side walls in intense light (avoidance).",
        chloroplastDensity: "High (30-40 per cell)",
        keyMolecules: ["Phototropin 1 & 2", "CHUP1 (Chloroplast Unusual Positioning 1)", "Rubisco"],
        physiologicalRole: "Maximizes light absorption while avoiding photodamage via phototropin-mediated chloroplast relocation.",
        colorHex: "#15803d",
      },
      {
        id: "myrosin-cells",
        name: "Idioblastic Myrosin Cells",
        scientificTerm: "Idioblastus myrosiniferus",
        depthRangeUm: "Near phloem poles (30 - 70 µm)",
        description: "Specialized protein-rich idioblasts containing myrosinase enzyme in dedicated vacuoles.",
        cellularDetails: "Spatially separated from glucosinolate-rich S-cells until cellular crushing occurs.",
        chloroplastDensity: "Absent",
        keyMolecules: ["Myrosinase (Thioglucosidase)", "Ascorbate cofactor"],
        physiologicalRole: "Chemical landmine: instantly produces toxic mustard oils upon tissue mastication by pests.",
        colorHex: "#fbbf24",
      },
      {
        id: "abaxial-stomata",
        name: "Abaxial Guard Cells & Stomatal Pore",
        scientificTerm: "Apparatus stomatalis abaxialis",
        depthRangeUm: "65 - 85 µm",
        description: "Stomatal complexes complying with the one-cell spacing rule.",
        cellularDetails: "Paired guard cells with SLAC1 anion channels and KAT1/KAT2 potassium channels.",
        chloroplastDensity: "Present (4-8 per guard cell)",
        keyMolecules: ["SLAC1 (Slow Anion Channel 1)", "OST1 kinase", "Abscisic acid"],
        physiologicalRole: "Ultra-sensitive drought detection closing pores within minutes to prevent desiccation.",
        colorHex: "#10b981",
      },
    ],
    hotspots: [
      {
        id: "puzzle-pavement",
        label: "Jigsaw Pavement Cell",
        category: "histology",
        position: [-0.3, 0.4, 0.08],
        title: "Puzzle-Piece Epidermal Wall",
        description: "Intricately lobed cells balancing turgor pressure stresses.",
        detailData: {
          metric: "Mechanical Stress Reduction",
          value: "42% peak wall stress reduction",
          significance: "Permits ultra-thin leaf lamina construction without risking cellular rupture under turgor.",
        },
      },
      {
        id: "mustard-bomb",
        label: "Myrosinase Idioblast",
        category: "biochemistry",
        position: [0.15, 0.2, 0.05],
        title: "Glucosinolate 'Mustard Bomb'",
        description: "Compartmentalized pro-toxin defense system.",
        detailData: {
          metric: "Activation Time",
          value: "< 500 milliseconds upon chewing",
          significance: "Enzymatically converts glucosinolates into isothiocyanates, stopping insect larvae feeding immediately.",
        },
      },
      {
        id: "chloroplast-movement",
        label: "Phototropin Photoreceptor",
        category: "physiology",
        position: [0.0, 0.6, 0.04],
        title: "Chloroplast Relocation Engine",
        description: "Blue light-driven intracellular organelle migration.",
        detailData: {
          metric: "Movement Velocity",
          value: "0.2 - 0.5 µm/min",
          significance: "Shifts chloroplasts to side walls during excess irradiation, preventing photoinhibition.",
        },
      },
    ],
  },
  {
    id: "dionaea-muscipula",
    commonName: "Venus Flytrap",
    scientificName: "Dionaea muscipula Ellis",
    family: "Droseraceae",
    order: "Caryophyllales",
    clade: "Eudicotyledons",
    habitat: "Nitrogen-poor acidic peat bogs, coastal Carolinas, USA",
    photosynthesisType: "C3",
    primaryMetabolites: {
      cellulosePercent: 36,
      ligninPercent: 10,
      hemicellulosePercent: 21,
      pectinPercent: 9,
      waterContentPercent: 89,
    },
    keyPhytochemicals: [
      {
        name: "Plumbagin",
        category: "Naphthoquinone",
        formula: "C₁₁H₈O₃",
        role: "Yellow antimicrobial naphthoquinone preventing bacterial rotting of prey inside closed digestion trap.",
      },
      {
        name: "Digestive Acid Phosphatases & Proteases",
        category: "Enzyme Cocktail",
        formula: "Proteinaceous enzymes",
        role: "Hydrolyzes prey exoskeleton and proteins, releasing soluble nitrogen, phosphorus, and potassium.",
      },
      {
        name: "Anthocyanins (Cyanidin-3-glucoside)",
        category: "Flavonoid Pigment",
        formula: "C₂₁H₂₁O₁₁⁺",
        role: "Imparts vivid crimson-red color to inner trap lobes, acting as visual floral mimic to attract prey insects.",
      },
    ],
    overview:
      "Dionaea muscipula is a carnivorous plant renowned for its ultra-rapid thigmonastic trap mechanism. Growing in nitrogen- and phosphorus-depleted peat bogs, it derives essential macronutrients by capturing and enzymatically digesting insects and arachnids.",
    evolutionaryAdaptation:
      "Snap-Trap Instability & Action Potential Memory: Three mechanosensory trigger hairs on each trap lobe act as levers. Bending a hair generates a receptor potential triggering an electrical action potential (AP). Two APs within 20 seconds cause instantaneous release of elastic shell instability, snapping the trap shut in 100 milliseconds.",
    vascularBiomechanics: {
      xylemConductivity: "1.1 × 10⁻⁴ kg m⁻¹ s⁻¹ MPa⁻¹",
      phloemOsmoticPressure: "1.5 MPa",
      transpirationRate: "0.9 - 1.6 mmol H₂O m⁻² s⁻¹",
      turgorPressure: "0.55 MPa (Rapidly drops in motor cells during trap snapping)",
    },
    geometryConfig: {
      modelType: "dionaea",
      leafCount: 6,
      baseColor: "#15803d",
      accentColor: "#ef4444",
      veinColor: "#fca5a5",
      stemColor: "#166534",
      scale: 1.0,
    },
    histologicalLayers: [
      {
        id: "trigger-hair",
        name: "Mechanosensory Trigger Hairs",
        scientificTerm: "Seta mechanosensoria",
        depthRangeUm: "1,500 - 2,200 µm projection",
        description: "Three erect multicellular bristles located on the adaxial surface of each trap lobe.",
        cellularDetails: "Articulated podium base contains mechanosensitive ion channels (MSL10 / Flycatcher1).",
        chloroplastDensity: "Low",
        keyMolecules: ["Mechanosensitive Piezo/Flycatcher ion channels", "Calmodulin", "ATP"],
        physiologicalRole: "Transduces mechanical torque from insect deflection into a propagated Ca²⁺/K⁺ electrical action potential.",
        colorHex: "#fbbf24",
      },
      {
        id: "digestive-glands",
        name: "Sessile Digestive Glands",
        scientificTerm: "Glandulae digestivae sessiles",
        depthRangeUm: "Adaxial surface (40 - 70 µm)",
        description: "Round, multicellular red glands covering the interior trap surface.",
        cellularDetails: "Two-tiered secretory head cells rich in rough ER, Golgi, and secretory vesicles.",
        chloroplastDensity: "Absent in secretory cells; high in underlying stalk cells",
        keyMolecules: ["Dionaein (aspartic protease)", "Acid phosphatase", "Glucosaminidase", "Plumbagin"],
        physiologicalRole: "Secretes acidic digestive fluid (pH ~2.0) and reabsorbs solubilized ammonium, phosphate, and amino acids.",
        colorHex: "#ef4444",
      },
      {
        id: "motor-mesophyll",
        name: "Motor Tissue & Hydraulic Hinge",
        scientificTerm: "Chlorenchyma motorium",
        depthRangeUm: "Midrib junction (80 - 220 µm)",
        description: "Specialized parenchyma along the midrib exhibiting rapid differential turgor collapse.",
        cellularDetails: "Abrupt opening of vacuolar anion and K⁺ efflux channels causes rapid water exit into apoplast.",
        chloroplastDensity: "Moderate",
        keyMolecules: ["H⁺-ATPase proton pumps", "Aquaporins (PIPs)"],
        physiologicalRole: "Shifts the trap lobe geometry from convex (open) to concave (closed) via snap-buckling elasticity.",
        colorHex: "#10b981",
      },
      {
        id: "marginal-cilia",
        name: "Interlocking Marginal Teeth (Cilia)",
        scientificTerm: "Fimbriae marginales",
        depthRangeUm: "Edge projection (3,000 - 5,000 µm)",
        description: "Comb-like marginal bristles rimming the periphery of both trap lobes.",
        cellularDetails: "Reinforced sclerenchyma fibers providing rigid interlocking cage bars.",
        chloroplastDensity: "Low",
        keyMolecules: ["Lignin", "Cellulose"],
        physiologicalRole: "Forms an escape-proof cage preventing larger prey from squeezing out while letting tiny non-nutritive gnats escape.",
        colorHex: "#22c55e",
      },
    ],
    hotspots: [
      {
        id: "trigger-sensor",
        label: "Trigger Hair Lever",
        category: "physiology",
        position: [0.2, 0.5, 0.1],
        title: "Piezo-Electric Action Potential",
        description: "Bending generates an electrical spike traversing the trap lobe.",
        detailData: {
          metric: "Action Potential Speed",
          value: "10 m/s electrical wave",
          significance: "Requires 2 distinct mechanical taps within 20 seconds to prevent false triggers by raindrops.",
        },
      },
      {
        id: "acid-gland",
        label: "Red Digestive Gland",
        category: "biochemistry",
        position: [-0.25, 0.45, 0.05],
        title: "Acidic Chemical Stomach",
        description: "Produces digestive juice with pH 2.0.",
        detailData: {
          metric: "Secretory Fluid pH",
          value: "pH 1.8 - 2.5",
          significance: "Dissolves chitinous insect bodies while antimicrobial plumbagin stops putrefaction.",
        },
      },
      {
        id: "snap-hinge",
        label: "Hydro-Elastic Midrib",
        category: "morphology",
        position: [0.0, 0.2, -0.05],
        title: "Elastic Snap-Buckling Instability",
        description: "Pre-stressed bi-stable mechanical shell.",
        detailData: {
          metric: "Closure Duration",
          value: "100 milliseconds",
          significance: "Among the fastest physical movements in the entire plant kingdom.",
        },
      },
    ],
  },
  {
    id: "ginkgo-biloba",
    commonName: "Ginkgo Biloba",
    scientificName: "Ginkgo biloba L.",
    family: "Ginkgoaceae",
    order: "Ginkgoales",
    clade: "Gymnosperms",
    habitat: "Montane valley refugia, Zhejiang, China",
    photosynthesisType: "C3",
    primaryMetabolites: {
      cellulosePercent: 46,
      ligninPercent: 27,
      hemicellulosePercent: 18,
      pectinPercent: 4,
      waterContentPercent: 72,
    },
    keyPhytochemicals: [
      {
        name: "Ginkgolides (A, B, C, J, M)",
        category: "Diterpene Trilactone",
        formula: "C₂₀H₂₄O₉ (Ginkgolide B)",
        role: "Unique diterpenes featuring a caged tertiary butyl group; potent antagonist of Platelet-Activating Factor (PAF).",
      },
      {
        name: "Bilobalide",
        category: "Sesquiterpene Trilactone",
        formula: "C₁₅H₁₈O₈",
        role: "Neuroprotective sesquiterpenoid conferring extraordinary resistance against pathogens and fungal decay.",
      },
      {
        name: "Ginkgetin / Sciadopitysin",
        category: "Biflavonoid",
        formula: "C₃₂H₂₂O₁₀",
        role: "Potent UV-absorbing and antioxidant biflavonoids protecting leaves from high solar irradiance.",
      },
    ],
    overview:
      "Ginkgo biloba is the sole surviving species of the division Ginkgophyta, an ancient botanical lineage that flourished over 270 million years ago before the rise of dinosaurs. Often termed a 'living fossil', Ginkgo possesses unique fan-shaped leaves with dichotomous flabellate venation, swimming multi-flagellated motile spermatozoids, and unparalleled resistance to pollution, fungal parasites, and ionizing radiation.",
    evolutionaryAdaptation:
      "Open Dichotomous Venation & Chemical Immortality: Unlike modern angiosperms with reticulate netted veins, Ginkgo retains primitive dichotomous venation where veins repeatedly fork in pairs without anastomosis (cross-connections). Its tissues produce bilobalides and ginkgolides that inhibit wood-rot fungi and insect feeding, allowing trees to live over 3,000 years.",
    vascularBiomechanics: {
      xylemConductivity: "2.4 × 10⁻⁴ kg m⁻¹ s⁻¹ MPa⁻¹",
      phloemOsmoticPressure: "1.7 MPa",
      transpirationRate: "1.4 - 2.8 mmol H₂O m⁻² s⁻¹",
      turgorPressure: "0.50 - 0.75 MPa",
    },
    geometryConfig: {
      modelType: "ginkgo",
      leafCount: 14,
      baseColor: "#15803d",
      accentColor: "#eab308", // Golden yellow autumn transition capability
      veinColor: "#86efac",
      stemColor: "#57534e",
      scale: 1.15,
    },
    histologicalLayers: [
      {
        id: "waxy-cuticle",
        name: "Upper Cuticle & Striae",
        scientificTerm: "Cuticula adaxialis striata",
        depthRangeUm: "0 - 5.5 µm",
        description: "Thick cuticle marked by longitudinal micro-ridges and platelet-like wax crystals.",
        cellularDetails: "Extensive cuticular striations parallel to the underlying dichotomous veins.",
        chloroplastDensity: "Absent",
        keyMolecules: ["Nonacosan-10-ol", "Cutin", "Triterpenoid oleanolic acid"],
        physiologicalRole: "Prevents particulate matter and acid pollutants from penetrating leaf tissue.",
        colorHex: "#86efac",
      },
      {
        id: "dichotomous-vein",
        name: "Dichotomous Collateral Vascular Bundle",
        scientificTerm: "Fasciculus vascularis dichotomus",
        depthRangeUm: "Leaf core (40 - 120 µm)",
        description: "Open collateral vein branching in pairs toward the notched distal leaf margin.",
        cellularDetails: "Scalariform and bordered-pitted tracheids accompanied by mucilage secretory cavities.",
        chloroplastDensity: "Absent in conducting tracheids",
        keyMolecules: ["Lignin", "Mucilage polysaccharides", "Ginkgolides"],
        physiologicalRole: "Parallel hydraulic distribution to both lobes of the fan without horizontal reconnecting cross-veins.",
        colorHex: "#06b6d4",
      },
      {
        id: "palisade-mesophyll",
        name: "Arm-Palisade Parenchyma",
        scientificTerm: "Chlorenchyma palissadense plicatum",
        depthRangeUm: "25 - 80 µm",
        description: "Specialized lobed cells with internal wall folds (arms) that dramatically expand cell surface area.",
        cellularDetails: "Folded invaginations of cell walls provide larger internal perimeter for chloroplast docking.",
        chloroplastDensity: "High (40-55 per cell)",
        keyMolecules: ["Chlorophyll a/b", "Ginkgetin", "Rubisco"],
        physiologicalRole: "Maximized light and CO₂ interaction within a compact leaf volume.",
        colorHex: "#15803d",
      },
      {
        id: "secretory-cavity",
        name: "Mucilage & Terpene Secretory Cavities",
        scientificTerm: "Cavitas secretoria resinifera",
        depthRangeUm: "Intercellular spaces (50 - 180 µm)",
        description: "Large spherical schizogenous cavities lined with secretory epithelium.",
        cellularDetails: "Epithelial cells synthesize and discharge ginkgolides and bilobalide into central lumen.",
        chloroplastDensity: "Low",
        keyMolecules: ["Ginkgolide B", "Bilobalide", "Pectic mucilage"],
        physiologicalRole: "Chemical armor defending vascular conduits against fungal hyphae and boring insects.",
        colorHex: "#eab308",
      },
      {
        id: "abaxial-stomata",
        name: "Sunken Haplocheilic Stomata",
        scientificTerm: "Stomata immersa haplocheilica",
        depthRangeUm: "Lower epidermis (120 - 150 µm)",
        description: "Stomatal apparatus sunken beneath the epidermal surface within subtle stomatal pits.",
        cellularDetails: "Flanked by 4-6 subsidiary cells forming an epistomatal chamber.",
        chloroplastDensity: "Present in guard cells",
        keyMolecules: ["Potassium ions", "Lipids"],
        physiologicalRole: "Reduces transpiration losses in high winds by creating a boundary layer of still humid air above the pore.",
        colorHex: "#10b981",
      },
    ],
    hotspots: [
      {
        id: "dichotomous-fork",
        label: "Dichotomous Vein Fork",
        category: "morphology",
        position: [0.0, 0.4, 0.05],
        title: "Primitive Forking Venation",
        description: "Repetitive binary branching without cross-vein anastomoses.",
        detailData: {
          metric: "Branching Angle",
          value: "22° - 35° bifurcation",
          significance: "Ancient architectural relic characteristic of early Mesozoic seed plants.",
        },
      },
      {
        id: "ginkgolide-gland",
        label: "Secretory Reservoir",
        category: "biochemistry",
        position: [0.35, 0.6, 0.08],
        title: "Ginkgolide Biosynthesis Vault",
        description: "Intercellular cavity holding diterpene trilactones.",
        detailData: {
          metric: "Concentration",
          value: "0.25% leaf dry weight",
          significance: "Unique cage molecule with tertiary butyl moiety; potent platelet-activating factor inhibitor.",
        },
      },
      {
        id: "bilobed-sinus",
        label: "Bilobed Leaf Notch",
        category: "morphology",
        position: [0.0, 0.95, 0.02],
        title: "Apical Sinus & Lamina Split",
        description: "Central indentation dividing the leaf into two symmetrical lobes.",
        detailData: {
          metric: "Notch Depth",
          value: "15% - 60% leaf length",
          significance: "Reduces wind boundary layer resistance and facilitates rapid rain drainage.",
        },
      },
    ],
  },
];
