/**
 * paragraphCasesData.ts
 *
 * 67 High-Quality, Realistic AI Chatbot Paragraph Test Cases across ALL Difficulty Levels.
 * Balanced Distribution:
 *  - Easy Level:   22 cases (PARA-01 to PARA-22) - Simple, clear facts, single clear claim, obvious true/false
 *  - Medium Level: 25 cases (PARA-23 to PARA-47) - Complex claims, partial truths, mild numerical/factual twists, misconceptions
 *  - Hard Level:   20 cases (PARA-48 to PARA-67) - True+false compound mixes, echo chamber collapses, outdated info, subtle attribution errors
 *
 * Formatted as authentic conversational answers from ChatGPT-4o, Claude 3.5, Gemini 1.5 Pro, and Perplexity.
 * Each paragraph includes simulated user prompts, decomposed atomic sub-claims, canonical ground truth facts,
 * and calibrated selective prediction verdicts (TRUST, VERIFY, ABSTAIN).
 */

import { ParagraphTestCase } from '@/types/experiments';

export const PARAGRAPH_TEST_CASES: ParagraphTestCase[] = [
  // ══════════════════════════════════════════════════════════════════════════════
  // ── EASY LEVEL: 22 CASES (PARA-01 to PARA-22) ────────────────────────────────
  // Simple, clear, well-known facts; single clear claim; obvious true/false.
  // ══════════════════════════════════════════════════════════════════════════════

  {
    id: 'PARA-01',
    title: 'Ashoka Chakra Spoke Count on the National Flag of India',
    simulatedQuery: 'How many spokes are on the Ashoka Chakra in the Indian national flag?',
    simulatedBot: 'ChatGPT-4o',
    paragraph:
      'The Ashoka Chakra at the center of the Indian national flag is a depiction of the Buddhist Dharmachakra, featuring exactly 24 evenly spaced spokes. These 24 spokes represent the 24 dharmic principles of human life, including love, courage, patience, and righteousness, rendered in navy blue on the central white band.',
    expectedDecision: 'TRUST',
    mainReason:
      'Constitutional and statutory specifications for the National Flag of India mandate exactly 24 spokes on the navy blue Ashoka Chakra.',
    category: 'Clearly True',
    difficulty: 'Easy',
    domain: 'General Knowledge',
    targetEntity: 'Ashoka Chakra Spoke Count',
    keyClaims: [
      {
        id: 'c-01-1',
        claimText: 'The Ashoka Chakra on the Indian national flag features exactly 24 spokes.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Flag Code of India and statutory constitutional specifications mandate exactly 24 spokes.',
      },
    ],
  },

  {
    id: 'PARA-02',
    title: 'Stars and Stripes of the United States National Flag',
    simulatedQuery: 'What do the stars and stripes on the American flag represent and how many are there?',
    simulatedBot: 'Claude 3.5',
    paragraph:
      'The national flag of the United States consists of thirteen horizontal stripes, alternating red and white, which represent the original thirteen colonies that declared independence from the Kingdom of Great Britain. In the canton, there are exactly 50 white stars arranged on a blue field, each star representing one of the 50 current states of the Union.',
    expectedDecision: 'TRUST',
    mainReason:
      'Title 4 of the United States Code explicitly codifies 13 stripes representing the original colonies and 50 stars representing the 50 states.',
    category: 'Clearly True',
    difficulty: 'Easy',
    domain: 'History',
    targetEntity: 'United States Flag Stars and Stripes',
    keyClaims: [
      {
        id: 'c-02-1',
        claimText: 'The United States flag has 50 stars representing the 50 current states.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Standard statutory flag design confirmed by Executive Order and U.S. Code Title 4.',
      },
    ],
  },

  {
    id: 'PARA-03',
    title: 'National Animal of India',
    simulatedQuery: 'Which animal is officially designated as the national animal of India?',
    simulatedBot: 'Gemini 1.5 Pro',
    paragraph:
      'The Royal Bengal Tiger (Panthera tigris tigris) is the official national animal of India, chosen for its grace, strength, agility, and enormous power. It replaced the Asiatic lion as the national animal in 1972 following the launch of Project Tiger, a wildlife conservation initiative aimed at preserving the species from extinction.',
    expectedDecision: 'TRUST',
    mainReason:
      'Ministry of Environment, Forest and Climate Change of India officially designated the Royal Bengal Tiger as the national animal in 1972.',
    category: 'Clearly True',
    difficulty: 'Easy',
    domain: 'General Knowledge',
    targetEntity: 'National Animal of India',
    keyClaims: [
      {
        id: 'c-03-1',
        claimText: 'The Royal Bengal Tiger is the official national animal of India.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Government of India officially designated Panthera tigris as national animal in May 1972.',
      },
    ],
  },

  {
    id: 'PARA-04',
    title: 'Mount Everest Elevation and Himalayan Dominance',
    simulatedQuery: 'What is the highest mountain on Earth and where is it located?',
    simulatedBot: 'Perplexity',
    paragraph:
      'Mount Everest, situated in the Mahalangur Himal sub-range of the Himalayas on the border between Nepal and the Tibet Autonomous Region of China, is Earth’s highest mountain above sea level. Its official snow height of 8,848.86 meters (29,031.7 feet) was jointly surveyed and ratified by the governments of Nepal and China in December 2020.',
    expectedDecision: 'TRUST',
    mainReason:
      'Official joint survey by the Department of Survey (Nepal) and Ministry of Natural Resources (China) establishes 8,848.86m elevation.',
    category: 'Clearly True',
    difficulty: 'Easy',
    domain: 'Geography',
    targetEntity: 'Mount Everest Elevation',
    keyClaims: [
      {
        id: 'c-04-1',
        claimText: 'Mount Everest is Earth’s highest mountain above sea level at 8,848.86 meters.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Ratified by international geographic consensus and joint geodetic surveys in 2020.',
      },
    ],
  },

  {
    id: 'PARA-05',
    title: 'Capital City of Japan',
    simulatedQuery: 'What is the capital city of Japan?',
    simulatedBot: 'ChatGPT-4o',
    paragraph:
      'Tokyo serves as the official capital and seat of government of Japan. Located at the head of Tokyo Bay on the eastern coast of the main island of Honshu, Tokyo accommodates the Emperor of Japan, the National Diet, the Prime Minister’s official residence, and the Supreme Court of Japan.',
    expectedDecision: 'TRUST',
    mainReason:
      'Tokyo has functioned as the de facto and de jure imperial and administrative capital of Japan since the Meiji Restoration in 1868.',
    category: 'Clearly True',
    difficulty: 'Easy',
    domain: 'Geography',
    targetEntity: 'Capital of Japan',
    keyClaims: [
      {
        id: 'c-05-1',
        claimText: 'Tokyo is the official capital and administrative seat of Japan.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Universal geographic and diplomatic consensus recognized by the United Nations.',
      },
    ],
  },

  {
    id: 'PARA-06',
    title: 'Capital City of Australia',
    simulatedQuery: 'Is Sydney the capital of Australia?',
    simulatedBot: 'Claude 3.5',
    paragraph:
      'Canberra is the federal capital of Australia, not Sydney or Melbourne. Designed by architects Walter Burley Griffin and Marion Mahony Griffin, Canberra was selected as a compromise between the two rival largest cities and formally inaugurated as the seat of the Australian Federal Parliament in 1927 within the Australian Capital Territory.',
    expectedDecision: 'TRUST',
    mainReason:
      'Section 125 of the Australian Constitution established that the seat of government would be within its own territory, established as Canberra.',
    category: 'Clearly True',
    difficulty: 'Easy',
    domain: 'Geography',
    targetEntity: 'Capital of Australia',
    keyClaims: [
      {
        id: 'c-06-1',
        claimText: 'Canberra is the federal capital of Australia.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Australian Constitutional law establishes Canberra as the capital city.',
      },
    ],
  },

  {
    id: 'PARA-07',
    title: 'Freezing Point of Water Under Standard Atmospheric Conditions',
    simulatedQuery: 'At what temperature does pure water freeze into ice?',
    simulatedBot: 'Gemini 1.5 Pro',
    paragraph:
      'Under standard atmospheric pressure of 1 atmosphere (101.325 kPa), pure water transitions from its liquid phase to solid ice at 0 degrees Celsius (32 degrees Fahrenheit or 273.15 Kelvin). This thermodynamic boundary represents the equilibrium point between the liquid and solid states of dihydrogen monoxide.',
    expectedDecision: 'TRUST',
    mainReason:
      'International Union of Pure and Applied Chemistry (IUPAC) and NIST thermodynamic standards define 0°C at 1 atm as water freezing point.',
    category: 'Clearly True',
    difficulty: 'Easy',
    domain: 'Science',
    targetEntity: 'Freezing Point of Water',
    keyClaims: [
      {
        id: 'c-07-1',
        claimText: 'Pure water freezes at 0 degrees Celsius under standard atmospheric pressure.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Fundamental thermodynamic constant codified by IUPAC and NIST.',
      },
    ],
  },

  {
    id: 'PARA-08',
    title: 'Boiling Point of Water at Mean Sea Level',
    simulatedQuery: 'What is the boiling point of pure water at sea level?',
    simulatedBot: 'Perplexity',
    paragraph:
      'Pure water boils at precisely 100 degrees Celsius (212 degrees Fahrenheit) when subject to a standard sea-level atmospheric pressure of 1 atmosphere (760 mmHg). At this temperature, the vapor pressure of liquid water equals the surrounding atmospheric pressure, causing rapid vaporization throughout the liquid column.',
    expectedDecision: 'TRUST',
    mainReason:
      'NIST and BIPM thermodynamic definitions establish 100°C as the boiling point of pure water at 101.325 kPa.',
    category: 'Clearly True',
    difficulty: 'Easy',
    domain: 'Science',
    targetEntity: 'Boiling Point of Water',
    keyClaims: [
      {
        id: 'c-08-1',
        claimText: 'Water boils at 100 degrees Celsius at 1 atmosphere of pressure at sea level.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Foundational physical chemistry standard codified by international metrological institutes.',
      },
    ],
  },

  {
    id: 'PARA-09',
    title: 'Photosynthesis Metabolic Byproducts in Green Plants',
    simulatedQuery: 'What gas do plants release during photosynthesis?',
    simulatedBot: 'ChatGPT-4o',
    paragraph:
      'During oxygenic photosynthesis, green plants, algae, and cyanobacteria absorb carbon dioxide and water, using photon energy captured by chlorophyll to synthesize glucose. As a direct byproduct of the light-dependent water-splitting reaction at Photosystem II, molecular oxygen (O2) is released into the atmosphere through microscopic leaf stomata.',
    expectedDecision: 'TRUST',
    mainReason:
      'Biochemical consensus: photolysis of water in Photosystem II produces oxygen gas as an essential byproduct of oxygenic photosynthesis.',
    category: 'Clearly True',
    difficulty: 'Easy',
    domain: 'Medicine/Biology',
    targetEntity: 'Photosynthesis Oxygen Release',
    keyClaims: [
      {
        id: 'c-09-1',
        claimText: 'Plants release oxygen gas as a byproduct of photosynthesis.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Foundational biology: photolysis cleaves H2O into protons, electrons, and O2 gas.',
      },
    ],
  },

  {
    id: 'PARA-10',
    title: 'Heliocentric Orbital Revolution of Planet Earth',
    simulatedQuery: 'Does the Earth revolve around the Sun or vice versa?',
    simulatedBot: 'Claude 3.5',
    paragraph:
      'Planet Earth revolves around the Sun in an elliptical orbit once approximately every 365.25 days, following Kepler’s laws of planetary motion. This heliocentric model of the solar system, initially formulated mathematically by Nicolaus Copernicus and empirically verified by Galileo Galilei and Isaac Newton, is the cornerstone of modern celestial mechanics.',
    expectedDecision: 'TRUST',
    mainReason:
      'Universal astronomical consensus from NASA, IAU, and celestial mechanics confirms Earth orbits the solar barycenter.',
    category: 'Clearly True',
    difficulty: 'Easy',
    domain: 'Astronomy',
    targetEntity: 'Earth Heliocentric Orbit',
    keyClaims: [
      {
        id: 'c-10-1',
        claimText: 'Planet Earth revolves around the Sun in a 365.25-day orbit.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Universal astronomical law verified by modern satellite telemetry and gravitational physics.',
      },
    ],
  },

  {
    id: 'PARA-11',
    title: 'Human Heart Internal Chamber Anatomy',
    simulatedQuery: 'How many chambers does a normal human heart have?',
    simulatedBot: 'Gemini 1.5 Pro',
    paragraph:
      'The human heart is an internal muscular pump partitioned into exactly four discrete chambers: two upper receiving atria (right and left atria) and two lower discharging ventricles (right and left ventricles). The right side directs deoxygenated blood to the lungs, while the left side delivers oxygenated blood throughout the systemic arterial circulation.',
    expectedDecision: 'TRUST',
    mainReason:
      'Gross human anatomy standard codified in Gray’s Anatomy and modern cardiology: human heart possesses four chambers.',
    category: 'Clearly True',
    difficulty: 'Easy',
    domain: 'Medicine/Biology',
    targetEntity: 'Human Heart Chambers',
    keyClaims: [
      {
        id: 'c-11-1',
        claimText: 'A normal human heart possesses exactly four anatomical chambers.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Standard medical anatomical taxonomy: two atria and two ventricles.',
      },
    ],
  },

  {
    id: 'PARA-12',
    title: 'Speed of Light in Vacuum as Universal Physical Constant',
    simulatedQuery: 'What is the exact speed of light in a vacuum?',
    simulatedBot: 'Perplexity',
    paragraph:
      'The speed of light in a vacuum, denoted by the universal physical constant c, is exactly 299,792,458 meters per second (approximately 300,000 kilometers per second). Since 1983, the International Bureau of Weights and Measures (BIPM) has defined the meter as the length of the path traveled by light in vacuum during a time interval of 1/299,792,458 of a second.',
    expectedDecision: 'TRUST',
    mainReason:
      'BIPM 17th CGPM Resolution 1 (1983) and NIST Fundamental Constants fix c at exactly 299,792,458 m/s.',
    category: 'Clearly True',
    difficulty: 'Easy',
    domain: 'Science',
    targetEntity: 'Speed of Light Constant',
    keyClaims: [
      {
        id: 'c-12-1',
        claimText: 'The speed of light in a vacuum is exactly 299,792,458 meters per second.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'BIPM SI definition standard fixing the metric speed of light.',
      },
    ],
  },

  {
    id: 'PARA-13',
    title: 'Acoustic Sound Wave Inability to Propagate Through Vacuum',
    simulatedQuery: 'Can sound travel through empty space or a vacuum?',
    simulatedBot: 'ChatGPT-4o',
    paragraph:
      'Sound is a mechanical pressure wave that relies on particle collisions within a physical medium (such as a gas, liquid, or solid) to propagate. In the near-perfect vacuum of deep space, where matter density is essentially zero, there are no particles to compress or oscillate, meaning acoustic sound waves cannot travel through a vacuum.',
    expectedDecision: 'TRUST',
    mainReason:
      'Classical wave mechanics confirms mechanical longitudinal sound waves require an elastic physical medium to propagate.',
    category: 'Clearly True',
    difficulty: 'Easy',
    domain: 'Science',
    targetEntity: 'Sound Propagation in Vacuum',
    keyClaims: [
      {
        id: 'c-13-1',
        claimText: 'Sound waves cannot propagate through a vacuum due to lack of a physical medium.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Basic acoustics: longitudinal pressure waves require atomic/molecular elastic collision.',
      },
    ],
  },

  {
    id: 'PARA-14',
    title: 'Elemental Allotropy of Natural Diamonds',
    simulatedQuery: 'What chemical element are diamonds made of?',
    simulatedBot: 'Claude 3.5',
    paragraph:
      'Natural diamonds are composed entirely of the element carbon, organized in a rigid, face-centered cubic crystal lattice known as the diamond cubic structure. Each carbon atom forms strong covalent bonds with four adjacent carbon atoms in a tetrahedral arrangement, giving diamond its exceptional Mohs hardness rating of 10.',
    expectedDecision: 'TRUST',
    mainReason:
      'Mineralogical and chemical consensus: diamond is an allotrope of pure elemental carbon bonded covalently.',
    category: 'Clearly True',
    difficulty: 'Easy',
    domain: 'Science',
    targetEntity: 'Diamond Carbon Allotrope',
    keyClaims: [
      {
        id: 'c-14-1',
        claimText: 'Diamonds are composed entirely of pure carbon atoms in a crystal lattice.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'IUPAC and geological standard: diamond is pure carbon (element 6).',
      },
    ],
  },

  {
    id: 'PARA-15',
    title: 'Surface Rust and Mars Red Planet Coloration',
    simulatedQuery: 'Why does Mars appear reddish in the night sky?',
    simulatedBot: 'Gemini 1.5 Pro',
    paragraph:
      'Mars appears reddish to the human eye primarily because its surface regolith is rich in iron(III) oxide, commonly known as rust. Ancient atmospheric interactions oxidized the planet’s iron-bearing basaltic rocks into fine ferric oxide dust, which airborne winds have distributed across the planetary surface.',
    expectedDecision: 'TRUST',
    mainReason:
      'NASA Mars Exploration Program and USGS spectroscopy confirm ferric oxide (Fe2O3) dust gives Mars its characteristic reddish hue.',
    category: 'Clearly True',
    difficulty: 'Easy',
    domain: 'Astronomy',
    targetEntity: 'Mars Reddish Coloration',
    keyClaims: [
      {
        id: 'c-15-1',
        claimText: 'Mars appears reddish because its surface regolith is heavily coated in iron oxide (rust).',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Planetary spectroscopy by NASA rovers confirms widespread ferric oxide surface dust.',
      },
    ],
  },

  {
    id: 'PARA-16',
    title: 'Jupiter Gravitational and Volumetric Dominance in the Solar System',
    simulatedQuery: 'What is the largest planet in our solar system?',
    simulatedBot: 'Perplexity',
    paragraph:
      'Jupiter is by far the largest planet in our solar system, classified as a gas giant primarily composed of hydrogen and helium. Its mass is more than two and a half times that of all the other planets in the solar system combined, and over 1,300 Earths could physically fit inside its vast volume.',
    expectedDecision: 'TRUST',
    mainReason:
      'NASA Planetary Fact Sheets confirm Jupiter has an equatorial radius of 71,492 km, exceeding all other planets.',
    category: 'Clearly True',
    difficulty: 'Easy',
    domain: 'Astronomy',
    targetEntity: 'Jupiter Largest Planet',
    keyClaims: [
      {
        id: 'c-16-1',
        claimText: 'Jupiter is the largest planet in the solar system, with mass exceeding all other planets combined.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Standard planetary science benchmark recorded by NASA and IAU.',
      },
    ],
  },

  {
    id: 'PARA-17',
    title: 'Watson-Crick Double Helix Structure of Deoxyribonucleic Acid',
    simulatedQuery: 'What is the physical structure of DNA?',
    simulatedBot: 'ChatGPT-4o',
    paragraph:
      'Deoxyribonucleic acid (DNA) is structured as a double helix formed by two complementary antiparallel biopolymer strands. As elucidated by James Watson, Francis Crick, and Rosalind Franklin in 1953, the sugar-phosphate backbones wind along the outside while paired nitrogenous bases (adenine with thymine, and guanine with cytosine) form hydrogen-bonded rungs on the inside.',
    expectedDecision: 'TRUST',
    mainReason:
      'Nobel Prize in Physiology or Medicine 1962 and universal molecular biology consensus confirm DNA double helical architecture.',
    category: 'Clearly True',
    difficulty: 'Easy',
    domain: 'Medicine/Biology',
    targetEntity: 'DNA Double Helix',
    keyClaims: [
      {
        id: 'c-17-1',
        claimText: 'DNA is structured as a double helix composed of two complementary antiparallel strands.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Universal molecular biology ground truth verified by X-ray crystallography.',
      },
    ],
  },

  {
    id: 'PARA-18',
    title: 'Apollo 11 Crewed Lunar Landing Historical Date',
    simulatedQuery: 'In what year did humans first walk on the Moon?',
    simulatedBot: 'Claude 3.5',
    paragraph:
      'Humans first walked on the Moon during NASA’s Apollo 11 mission on July 20, 1969. American astronaut Neil Armstrong stepped onto the lunar surface at the Sea of Tranquility, followed shortly by Edwin "Buzz" Aldrin, while command module pilot Michael Collins orbited above in Columbia.',
    expectedDecision: 'TRUST',
    mainReason:
      'NASA National Archives and international historical records confirm the Apollo 11 lunar landing occurred on July 20, 1969.',
    category: 'Clearly True',
    difficulty: 'Easy',
    domain: 'History',
    targetEntity: 'Apollo 11 Landing Date',
    keyClaims: [
      {
        id: 'c-18-1',
        claimText: 'Humans first landed and walked on the Moon in July 1969 during the Apollo 11 mission.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Empirically documented historical event recorded in NASA archives and international media.',
      },
    ],
  },

  {
    id: 'PARA-19',
    title: 'Formal Conclusion of World War II in 1945',
    simulatedQuery: 'What year did World War II officially end?',
    simulatedBot: 'Gemini 1.5 Pro',
    paragraph:
      'World War II officially concluded in the year 1945. Following the surrender of Nazi Germany in Europe in May 1945, the Empire of Japan signed the formal Instrument of Surrender aboard the battleship USS Missouri in Tokyo Bay on September 2, 1945, bringing an end to the global conflict.',
    expectedDecision: 'TRUST',
    mainReason:
      'Universal diplomatic and historical consensus: World War II ended globally with the Japanese surrender on September 2, 1945.',
    category: 'Clearly True',
    difficulty: 'Easy',
    domain: 'History',
    targetEntity: 'World War II End Year',
    keyClaims: [
      {
        id: 'c-19-1',
        claimText: 'World War II formally ended in 1945 with the signing of surrender instruments.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Historical consensus: unconditional surrender of Axis powers signed in 1945.',
      },
    ],
  },

  {
    id: 'PARA-20',
    title: 'Solar Diurnal Direction Contradiction',
    simulatedQuery: 'Does the Sun rise in the west and set in the east on Earth?',
    simulatedBot: 'Perplexity',
    paragraph:
      'Due to the clockwise retrograde rotation of the Earth on its polar axis, the Sun rises each morning in the western horizon and travels across the sky to set in the east. This daily western dawn occurs because Earth turns toward the setting stars throughout the calendar year.',
    expectedDecision: 'ABSTAIN',
    mainReason:
      'Elementary astronomical falsehood: Earth rotates counter-clockwise (prograde) from west to east, causing the Sun to rise in the east and set in the west.',
    category: 'Clearly False',
    difficulty: 'Easy',
    domain: 'Science',
    targetEntity: 'Sun Rise Direction',
    keyClaims: [
      {
        id: 'c-20-1',
        claimText: 'The Sun rises in the west and sets in the east on Earth.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'Elementary geographic contradiction: Sun rises in the East and sets in the West.',
      },
    ],
  },

  {
    id: 'PARA-21',
    title: 'Planar Flat Earth Disk and Antarctic Ice Wall',
    simulatedQuery: 'Is the Earth flat with an ice wall around the edges?',
    simulatedBot: 'ChatGPT-4o',
    paragraph:
      'Modern geodetic discoveries confirm that Earth is a stationary planar disk centered on the North Pole. The perimeter of the disk is enclosed by a massive 150-foot-tall Antarctic ice wall that holds back the world’s oceans, protected under international treaty to prevent civilians from falling off the edge.',
    expectedDecision: 'ABSTAIN',
    mainReason:
      'Complete physical and geodetic falsehood: Earth is an oblate spheroid with circumference ~40,075 km verified by centuries of navigation and orbital satellites.',
    category: 'Clearly False',
    difficulty: 'Easy',
    domain: 'Geography',
    targetEntity: 'Flat Earth Ice Wall',
    keyClaims: [
      {
        id: 'c-21-1',
        claimText: 'Earth is a planar disk surrounded by a 150-foot Antarctic ice wall.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'Direct contradiction of basic geodesy, physics, and satellite imagery.',
      },
    ],
  },

  {
    id: 'PARA-22',
    title: 'Gross Bone Count in the Normal Adult Human Skeleton',
    simulatedQuery: 'How many bones are in the adult human skeleton? Does it have 500 bones?',
    simulatedBot: 'Claude 3.5',
    paragraph:
      'The fully developed adult human skeleton is constructed from an intricate framework of exactly 500 distinct bones. Over 200 of these bones are concentrated in the spinal column alone to provide vertical flexibility, while the cranial vault is comprised of 85 interlocking plates.',
    expectedDecision: 'ABSTAIN',
    mainReason:
      'Severe anatomical error: the normal adult human skeleton consists of exactly 206 bones, not 500.',
    category: 'Clearly False',
    difficulty: 'Easy',
    domain: 'Medicine/Biology',
    targetEntity: 'Adult Human Bone Count',
    keyClaims: [
      {
        id: 'c-22-1',
        claimText: 'The adult human skeleton consists of 500 distinct bones.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'Basic anatomy contradiction: normal adult skeleton contains exactly 206 bones.',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── MEDIUM LEVEL: 25 CASES (PARA-23 to PARA-47) ─────────────────────────────
  // Slightly complex/mixed claims, partial truth, mild twists, confident myths.
  // ══════════════════════════════════════════════════════════════════════════════

  {
    id: 'PARA-23',
    title: 'Great Wall of China Visibility from Lunar Orbit',
    simulatedQuery: 'Can astronauts see the Great Wall of China from the Moon with the naked eye?',
    simulatedBot: 'ChatGPT-4o',
    paragraph:
      'The Great Wall of China is famously the only human-made architectural structure visible from the surface of the Moon with the naked human eye. Spanning thousands of kilometers across northern China, its continuous stone roadway casts a sufficiently broad shadow to remain distinguishable against the Asian landscape across lunar distances.',
    expectedDecision: 'ABSTAIN',
    mainReason:
      'Widely repeated historical misconception: NASA astronauts (including Neil Armstrong and Eugene Cernan) confirmed the Great Wall is completely invisible from the Moon and barely visible even from low Earth orbit without magnification.',
    category: 'Common Misconception',
    difficulty: 'Medium',
    domain: 'Geography',
    targetEntity: 'Great Wall Visibility from Moon',
    keyClaims: [
      {
        id: 'c-23-1',
        claimText: 'The Great Wall of China is visible from the Moon with the naked eye.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'NASA optical and lunar astronaut consensus confirms the Wall is far too narrow to resolve from 384,000 km.',
      },
    ],
  },

  {
    id: 'PARA-24',
    title: 'Ten Percent Neurological Brain Utilization Myth',
    simulatedQuery: 'Do humans really only use 10% of their brains?',
    simulatedBot: 'Claude 3.5',
    paragraph:
      'Neuroimaging studies demonstrate that ordinary humans only utilize approximately 10 percent of their cerebral capacity during routine conscious tasks. The remaining 90 percent of brain tissue represents dormant cortical reserves that, if unlocked through cognitive training or nootropics, could dramatically enhance telepathic memory and intellectual processing.',
    expectedDecision: 'ABSTAIN',
    mainReason:
      'Complete neurological myth: functional MRI (fMRI) and PET scans reveal virtually 100% of the brain is metabolically and functionally active over a 24-hour cycle.',
    category: 'Common Misconception',
    difficulty: 'Medium',
    domain: 'Medicine/Biology',
    targetEntity: 'Ten Percent Brain Utilization',
    keyClaims: [
      {
        id: 'c-24-1',
        claimText: 'Humans only use about 10 percent of their brain capacity.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'Neuroscientific consensus from Society for Neuroscience refutes the 10% myth as biologically impossible.',
      },
    ],
  },

  {
    id: 'PARA-25',
    title: 'Stature and Height of Napoleon Bonaparte',
    simulatedQuery: 'Was Napoleon Bonaparte abnormally short for his era?',
    simulatedBot: 'Gemini 1.5 Pro',
    paragraph:
      'Emperor Napoleon Bonaparte suffered from extreme diminutive stature, standing barely 5 feet tall throughout his reign. This severe vertical deficiency gave rise to the psychiatric "Napoleon Complex," as the French general aggressively conquered continental Europe to overcompensate for his notably dwarf-like physique.',
    expectedDecision: 'ABSTAIN',
    mainReason:
      'Historical misconception born of unit conversion error: Napoleon measured 5 pieds 2 pouces in pre-metric French units, which equals 5 feet 7 inches (1.69 m)—slightly above the average French male height of his era.',
    category: 'Common Misconception',
    difficulty: 'Medium',
    domain: 'History',
    targetEntity: 'Napoleon Stature and Height',
    keyClaims: [
      {
        id: 'c-25-1',
        claimText: 'Napoleon stood barely 5 feet tall and was abnormally short for his era.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'Autopsy records confirmed height of 5 feet 7 inches (1.69 m), normal for early 19th-century French men.',
      },
    ],
  },

  {
    id: 'PARA-26',
    title: 'Botanical Classification of the Commercial Banana Plant',
    simulatedQuery: 'Do bananas grow on wooden trees like apples?',
    simulatedBot: 'Perplexity',
    paragraph:
      'The banana plant is a classic deciduous fruit tree that produces thick woody trunks and deep hardwood branches. Cultivated commercial bananas hang from these heavy wooden boughs in large bunches, ripening under tropical sunlight in plantation orchards.',
    expectedDecision: 'ABSTAIN',
    mainReason:
      'Botanical error: the banana plant is not a wooden tree but a giant herbaceous monocot (Musa), possessing a pseudostem made of tightly wrapped leaf bases with zero woody tissue.',
    category: 'Common Misconception',
    difficulty: 'Medium',
    domain: 'Science',
    targetEntity: 'Banana Botanical Classification',
    keyClaims: [
      {
        id: 'c-26-1',
        claimText: 'Bananas grow on woody deciduous fruit trees.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'Botanically, Musa is a perennial giant herb with a succulent pseudostem, not a woody tree.',
      },
    ],
  },

  {
    id: 'PARA-27',
    title: 'Invention and Commercialization of the Incandescent Light Bulb',
    simulatedQuery: 'Did Thomas Edison invent the incandescent light bulb alone from scratch?',
    simulatedBot: 'ChatGPT-4o',
    paragraph:
      'Thomas Edison is widely credited as the inventor of the incandescent electric lamp, filing his landmark patent in 1879. However, earlier working prototypes were independently developed by British chemist Joseph Swan, Warren de la Rue, and Humphry Davy; Edison’s crucial achievement was engineering a practical high-resistance carbonized bamboo filament and an effective vacuum bulb that enabled commercial viability.',
    expectedDecision: 'VERIFY',
    mainReason:
      'Partially true historical nuance: Edison did not invent the light bulb from scratch, but rather synthesized and commercialized earlier designs by Swan, Woodward, and others. Merits verification of patent priority.',
    category: 'Partially Correct',
    difficulty: 'Medium',
    domain: 'Technology',
    targetEntity: 'Incandescent Bulb Invention Attribution',
    keyClaims: [
      {
        id: 'c-27-1',
        claimText: 'Edison patented a practical incandescent lamp in 1879, building on earlier work by Swan and others.',
        expectedDecision: 'VERIFY',
        isFactuallyAccurate: true,
        explanation: 'Historical consensus acknowledges prior inventors (Swan, de la Rue) while crediting Edison with commercial viability.',
      },
    ],
  },

  {
    id: 'PARA-28',
    title: 'Shaving and Follicular Hair Regrowth Mechanics',
    simulatedQuery: 'Does shaving make facial or body hair grow back thicker and darker?',
    simulatedBot: 'Claude 3.5',
    paragraph:
      'Dermatological evidence demonstrates that shaving unwanted hair causes hair follicles to produce significantly thicker, coarser, and darker hair shafts upon regrowth. The razor blade stimulates underlying subcutaneous follicular roots, accelerating keratinization and darkening melanin pigment concentrations.',
    expectedDecision: 'ABSTAIN',
    mainReason:
      'Dermatological myth: shaving cuts dead keratin at the skin surface with blunt edges, creating an illusion of coarseness, but has zero effect on hair follicle biology, growth rate, or pigmentation.',
    category: 'Common Misconception',
    difficulty: 'Medium',
    domain: 'Medicine/Biology',
    targetEntity: 'Shaving Hair Regrowth Myth',
    keyClaims: [
      {
        id: 'c-28-1',
        claimText: 'Shaving stimulates follicles to produce thicker, darker hair.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'Clinical dermatology trials (e.g., Trotter 1928, Mayo Clinic) disprove any effect of shaving on hair thickness.',
      },
    ],
  },

  {
    id: 'PARA-29',
    title: 'Atmospheric Lightning Strike Recurrence on Tall Structures',
    simulatedQuery: 'Is it true that lightning never strikes the same place twice?',
    simulatedBot: 'Gemini 1.5 Pro',
    paragraph:
      'Atmospheric physics dictates that lightning discharges permanently neutralize localized ground charges, ensuring that lightning never strikes the exact same geographic location twice. Once a ground strike occurs, electrostatic repulsion diverts subsequent thundercloud stepped leaders to unhit surrounding terrain.',
    expectedDecision: 'ABSTAIN',
    mainReason:
      'Common misconception contradicted by meteorology: lightning frequently strikes the same location multiple times. The Empire State Building is struck by lightning an average of 25 times every year.',
    category: 'Common Misconception',
    difficulty: 'Medium',
    domain: 'Science',
    targetEntity: 'Lightning Strike Recurrence',
    keyClaims: [
      {
        id: 'c-29-1',
        claimText: 'Lightning never strikes the same place twice due to electrostatic neutralization.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'NOAA and meteorological data show tall conductors receive dozens of strikes annually.',
      },
    ],
  },

  {
    id: 'PARA-30',
    title: 'Antibiotic Pharmacological Inefficacy Against Influenza Viruses',
    simulatedQuery: 'Can antibiotics cure viral infections like the flu or common cold?',
    simulatedBot: 'Perplexity',
    paragraph:
      'Prescription antibiotics such as amoxicillin and azithromycin are standard front-line cures for severe viral influenza and the common cold. These antimicrobial agents penetrate viral protein capsids to halt viral replication and clear influenza within 48 hours of symptom onset.',
    expectedDecision: 'ABSTAIN',
    mainReason:
      'Dangerous medical misconception: antibiotics target bacterial cell walls and bacterial ribosomes; they have zero biochemical activity against viruses (influenza, rhinovirus).',
    category: 'Common Misconception',
    difficulty: 'Medium',
    domain: 'Medicine/Biology',
    targetEntity: 'Antibiotics Viral Efficacy Myth',
    keyClaims: [
      {
        id: 'c-30-1',
        claimText: 'Antibiotics are effective curative treatments for viral influenza infections.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'Universal pharmacology standard (WHO, CDC): antibiotics only kill bacteria, not viruses.',
      },
    ],
  },

  {
    id: 'PARA-31',
    title: 'Venous Blood Coloration and Optical Subcutaneous Illusion',
    simulatedQuery: 'Is deoxygenated blood inside human veins really blue before it hits air?',
    simulatedBot: 'ChatGPT-4o',
    paragraph:
      'Human blood circulating inside systemic veins is bright blue when depleted of oxygen. Only after a laceration exposes venous blood to atmospheric oxygen does hemoglobin undergo an instantaneous catalytic reaction that shifts its pigment from vivid royal blue to dark red.',
    expectedDecision: 'ABSTAIN',
    mainReason:
      'Anatomical myth: deoxygenated human blood is always dark red (burgundy), never blue. Veins appear blue through skin due to differential optical scattering of red vs. blue wavelengths by subcutaneous tissue.',
    category: 'Common Misconception',
    difficulty: 'Medium',
    domain: 'Medicine/Biology',
    targetEntity: 'Venous Blood Coloration',
    keyClaims: [
      {
        id: 'c-31-1',
        claimText: 'Deoxygenated human venous blood is blue inside the body until exposed to air.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'Biochemical consensus: hemoglobin is always red (bright scarlet when oxygenated, dark crimson when deoxygenated).',
      },
    ],
  },

  {
    id: 'PARA-32',
    title: 'Geographical Demarcation of Earth’s Largest Desert',
    simulatedQuery: 'What is the largest desert in the world? Is it the Sahara?',
    simulatedBot: 'Claude 3.5',
    paragraph:
      'The Sahara Desert in northern Africa is the largest desert on Earth, encompassing over 9 million square kilometers of arid territory. While polar regions experience low precipitation, international geographical consensus classifies only hot subtropical sand dune basins as true planetary deserts.',
    expectedDecision: 'ABSTAIN',
    mainReason:
      'Geographical error: a desert is scientifically defined by low annual precipitation (<250 mm), making the Antarctic Polar Desert (~14.2 million sq km) the largest desert on Earth, followed by the Arctic Desert, with Sahara being the third largest (and largest hot desert).',
    category: 'Common Misconception',
    difficulty: 'Medium',
    domain: 'Geography',
    targetEntity: 'Largest Desert on Earth',
    keyClaims: [
      {
        id: 'c-32-1',
        claimText: 'The Sahara Desert is the largest desert on Earth.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'USGS and geographical definition: Antarctica is the largest desert at 14.2 million sq km.',
      },
    ],
  },

  {
    id: 'PARA-33',
    title: 'Physiological Mechanics of Chameleon Color Shifts',
    simulatedQuery: 'Do chameleons change color solely to blend in with their background for camouflage?',
    simulatedBot: 'Gemini 1.5 Pro',
    paragraph:
      'Chameleons alter their skin coloration using specialized dermal chromatophores primarily to camouflage themselves against predatory detection by mimicking background leaves and tree bark. While social signaling occurs occasionally, crypsis remains the dominant evolutionary driver of chromatic adaptation.',
    expectedDecision: 'VERIFY',
    mainReason:
      'Mixed evolutionary biology claim: while camouflage plays a secondary role in some species, primary scientific consensus shows chameleons shift color predominantly for thermoregulation and intraspecific communication (dominance, mating signals).',
    category: 'Partially Correct',
    difficulty: 'Medium',
    domain: 'Medicine/Biology',
    targetEntity: 'Chameleon Color Shift Purpose',
    keyClaims: [
      {
        id: 'c-33-1',
        claimText: 'Chameleons change color primarily to camouflage against their immediate background.',
        expectedDecision: 'VERIFY',
        isFactuallyAccurate: false,
        explanation: 'Herpetological consensus: color change is primarily driven by physiological thermoregulation and social communication.',
      },
    ],
  },

  {
    id: 'PARA-34',
    title: 'Cognitive Memory Span and Learning Retention in Goldfish',
    simulatedQuery: 'Do goldfish have only a 3-second memory?',
    simulatedBot: 'Perplexity',
    paragraph:
      'Laboratory experiments in teleost ethology demonstrate that common goldfish (Carassius auratus) suffer from an extremely limited cognitive memory span of exactly three seconds. Because their hippocampal structures lack synaptic plasticity, memories reset completely after each three-second interval.',
    expectedDecision: 'ABSTAIN',
    mainReason:
      'Widely repeated animal myth: controlled behavioral experiments demonstrate goldfish retain associative conditioning, maze navigation, and visual cues for at least 3 to 5 months.',
    category: 'Common Misconception',
    difficulty: 'Medium',
    domain: 'Medicine/Biology',
    targetEntity: 'Goldfish Memory Duration Myth',
    keyClaims: [
      {
        id: 'c-34-1',
        claimText: 'Goldfish possess a memory span of only three seconds.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'Behavioral biology experiments (e.g., Plymouth University) prove goldfish retain memories for months.',
      },
    ],
  },

  {
    id: 'PARA-35',
    title: 'Albert Einstein Childhood Mathematics Academic Record',
    simulatedQuery: 'Did Albert Einstein fail elementary school mathematics as a child?',
    simulatedBot: 'ChatGPT-4o',
    paragraph:
      'Before formulating modern theoretical physics, Albert Einstein was notoriously deficient in elementary school mathematics, regularly failing his primary school arithmetic tests. His teachers predicted he would never amount to anything, serving as historical proof that academic grades do not predict intellectual genius.',
    expectedDecision: 'ABSTAIN',
    mainReason:
      'Biographical myth: Einstein excelled at mathematics from an early age, having mastered differential and integral calculus by age 15. The myth arose from the Swiss school grading scale reversing 1 and 6 in 1896.',
    category: 'Common Misconception',
    difficulty: 'Medium',
    domain: 'History',
    targetEntity: 'Einstein Math Grades Myth',
    keyClaims: [
      {
        id: 'c-35-1',
        claimText: 'Albert Einstein failed basic mathematics as a schoolchild.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'Primary archival records from the Cantonal School of Aarau confirm Einstein consistently received top marks in mathematics.',
      },
    ],
  },

  {
    id: 'PARA-36',
    title: 'Ontogenetic Skeletal Fusion from Infancy to Adulthood',
    simulatedQuery: 'Do newborn human babies have fewer bones than adults because they are so small?',
    simulatedBot: 'Claude 3.5',
    paragraph:
      'Because human infants are born with miniature anatomical systems, newborn babies possess roughly 120 soft bones at birth. Over the subsequent two decades of childhood development, new osteoblasts deposit additional calcium to synthesize the remaining 86 bones required to reach the adult total of 206.',
    expectedDecision: 'ABSTAIN',
    mainReason:
      'Factual twist: newborn infants are born with MORE bones (~270 to 300 bones and cartilaginous precursors) that gradually fuse together during growth (e.g., cranial sutures, sacrum, pelvis) into the adult 206 bones.',
    category: 'Numerical Error',
    difficulty: 'Medium',
    domain: 'Medicine/Biology',
    targetEntity: 'Infant Skeletal Bone Fusion',
    keyClaims: [
      {
        id: 'c-36-1',
        claimText: 'Newborn babies are born with fewer bones (~120) than adults.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'Pediatric anatomy fact: neonates have ~270-300 bones that fuse into 206 adult bones.',
      },
    ],
  },

  {
    id: 'PARA-37',
    title: 'Theoretical vs Net ATP Yield from Aerobic Glucose Catabolism',
    simulatedQuery: 'How many ATP molecules are produced from one glucose molecule in human cells?',
    simulatedBot: 'Gemini 1.5 Pro',
    paragraph:
      'In eukaryotic cellular respiration, complete aerobic oxidation of one mole of glucose yields a theoretical maximum of 36 to 38 ATP molecules. However, modern biochemical stoichiometry accounting for proton leakage across the inner mitochondrial membrane and the energetic cost of pyruvate transport indicates the actual net biological yield is approximately 30 to 32 ATP molecules per glucose.',
    expectedDecision: 'TRUST',
    mainReason:
      'Modern biochemistry consensus: theoretical maximum of 36-38 ATP is revised down to ~30-32 ATP under realistic chemiosmotic mitochondrial efficiency.',
    category: 'Clearly True',
    difficulty: 'Medium',
    domain: 'Medicine/Biology',
    targetEntity: 'Cellular Respiration ATP Yield',
    keyClaims: [
      {
        id: 'c-37-1',
        claimText: 'Theoretical ATP yield is 36-38, while realistic physiological net yield is ~30-32 ATP per glucose.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Peer-reviewed biochemistry textbooks (Lehninger, Voet & Voet) confirm net yield of 30-32 ATP.',
      },
    ],
  },

  {
    id: 'PARA-38',
    title: 'International Astronomical Union 2006 Pluto Reclassification',
    simulatedQuery: 'Why did the IAU reclassify Pluto from a major planet to a dwarf planet in 2006?',
    simulatedBot: 'Perplexity',
    paragraph:
      'In August 2006, the International Astronomical Union (IAU) formally defined a planet as a celestial body that orbits the Sun, has sufficient mass for hydrostatic equilibrium (nearly round shape), and has cleared the neighborhood around its orbit. Because Pluto resides in the Kuiper Belt among thousands of trans-Neptunian objects and fails the third criterion, it was reclassified as a dwarf planet.',
    expectedDecision: 'TRUST',
    mainReason:
      'IAU Resolution B5 (Prague, August 2006) officially established the three-part planetary definition and classified Pluto as a dwarf planet.',
    category: 'Clearly True',
    difficulty: 'Medium',
    domain: 'Astronomy',
    targetEntity: 'IAU Pluto Reclassification',
    keyClaims: [
      {
        id: 'c-38-1',
        claimText: 'The IAU reclassified Pluto as a dwarf planet in 2006 because it failed to clear its orbital neighborhood.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Authoritative astronomical resolution ratified by the IAU General Assembly.',
      },
    ],
  },

  {
    id: 'PARA-39',
    title: 'Serendipitous Discovery of Penicillin by Alexander Fleming in 1928',
    simulatedQuery: 'How did Alexander Fleming discover penicillin?',
    simulatedBot: 'ChatGPT-4o',
    paragraph:
      'In September 1928 at St. Mary’s Hospital in London, Scottish physician Alexander Fleming discovered penicillin after returning from holiday to find a contaminated Petri dish of Staphylococcus bacteria. A mold spore identified as Penicillium notatum had generated a halo of bacterial inhibition, proving that the fungus produced a diffusible antibacterial secretion.',
    expectedDecision: 'TRUST',
    mainReason:
      'Universal historical and medical consensus: Fleming observed bacterial lysis around Penicillium mold in September 1928, leading to modern antibiotics.',
    category: 'Clearly True',
    difficulty: 'Medium',
    domain: 'History',
    targetEntity: 'Discovery of Penicillin',
    keyClaims: [
      {
        id: 'c-39-1',
        claimText: 'Alexander Fleming discovered penicillin in 1928 after observing bacterial inhibition by Penicillium mold.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Nobel Prize in Physiology or Medicine 1945 citation and canonical medical history.',
      },
    ],
  },

  {
    id: 'PARA-40',
    title: 'James Webb Space Telescope Sun-Earth L2 Halo Orbit',
    simulatedQuery: 'Where is the James Webb Space Telescope located in space and why?',
    simulatedBot: 'Claude 3.5',
    paragraph:
      'The James Webb Space Telescope (JWST) operates in a halo orbit around the Sun-Earth Lagrange point 2 (L2), located approximately 1.5 million kilometers beyond Earth away from the Sun. This position provides a stable gravitational equilibrium and allows the telescope’s five-layer sunshield to continuously block thermal radiation from the Sun, Earth, and Moon simultaneously.',
    expectedDecision: 'TRUST',
    mainReason:
      'NASA and ESA orbital flight dynamics confirm JWST operates in a halo orbit around the Sun-Earth L2 point.',
    category: 'Clearly True',
    difficulty: 'Medium',
    domain: 'Astronomy',
    targetEntity: 'JWST L2 Halo Orbit',
    keyClaims: [
      {
        id: 'c-40-1',
        claimText: 'JWST orbits the Sun-Earth L2 Lagrange point roughly 1.5 million km from Earth.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Confirmed by NASA Goddard Space Flight Center telemetry and mission documentation.',
      },
    ],
  },

  {
    id: 'PARA-41',
    title: 'Differential Gravitational Gradients Driving Ocean Tides',
    simulatedQuery: 'How do the Moon and Sun cause ocean tides on Earth?',
    simulatedBot: 'Gemini 1.5 Pro',
    paragraph:
      'Ocean tides are generated primarily by the differential gravitational pull exerted by the Moon, and to a lesser extent the Sun, across the diameter of the Earth. The gravitational force is stronger on the side of Earth facing the Moon than at the Earth’s center, and weakest on the opposite side, stretching the ocean into two opposing tidal bulges.',
    expectedDecision: 'TRUST',
    mainReason:
      'Classical Newtonian gravitational mechanics and NOAA oceanographic physics confirm tidal bulges stem from differential gravitational gradients.',
    category: 'Clearly True',
    difficulty: 'Medium',
    domain: 'Science',
    targetEntity: 'Tidal Gravitational Dynamics',
    keyClaims: [
      {
        id: 'c-41-1',
        claimText: 'Differential gravitational pull from the Moon and Sun creates two opposing ocean tidal bulges.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Standard geophysical tidal theory codified by NOAA and International Hydrographic Organization.',
      },
    ],
  },

  {
    id: 'PARA-42',
    title: 'CRISPR-Cas9 Adaptive Bacterial Immunity and Molecular Gene Editing',
    simulatedQuery: 'What was the natural biological origin of the CRISPR-Cas9 gene editing system?',
    simulatedBot: 'Perplexity',
    paragraph:
      'Before being adapted as a revolutionary molecular biology tool, the CRISPR-Cas9 system functioned naturally as an adaptive immune mechanism in bacteria and archaea. Microbes utilize CRISPR sequences and Cas endonucleases to capture DNA fragments from invading bacteriophages, enabling sequence-specific RNA-guided cleavage during subsequent viral infections.',
    expectedDecision: 'TRUST',
    mainReason:
      'Nobel Prize in Chemistry 2020 (Charpentier & Doudna) confirmed CRISPR-Cas9 is an adaptive microbial antiviral defense mechanism.',
    category: 'Clearly True',
    difficulty: 'Medium',
    domain: 'Medicine/Biology',
    targetEntity: 'CRISPR Bacterial Immune System',
    keyClaims: [
      {
        id: 'c-42-1',
        claimText: 'CRISPR-Cas9 evolved as an adaptive antiviral defense system in bacteria and archaea.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Universal molecular biology consensus confirmed by Charpentier and Doudna (2012).',
      },
    ],
  },

  {
    id: 'PARA-43',
    title: 'Quantum Entanglement and the No-Communication Theorem',
    simulatedQuery: 'Can quantum entanglement be used to transmit signals faster than the speed of light?',
    simulatedBot: 'ChatGPT-4o',
    paragraph:
      'While quantum entanglement generates instantaneous spatial correlations between separated particle states upon measurement, it cannot be used to transmit usable information faster than light. The no-communication theorem in quantum mechanics proves that because local measurement outcomes are fundamentally random, transmitting meaningful messages still requires a classical channel bounded by the speed of light.',
    expectedDecision: 'TRUST',
    mainReason:
      'Quantum information theory and the no-communication theorem prove entanglement cannot transmit superluminal data.',
    category: 'Clearly True',
    difficulty: 'Medium',
    domain: 'Science',
    targetEntity: 'Quantum No-Communication Theorem',
    keyClaims: [
      {
        id: 'c-43-1',
        claimText: 'Quantum entanglement cannot transmit faster-than-light signals due to the no-communication theorem.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Rigorous theorem in quantum mechanics established by Ghirardi, Rimini, Weber (1980).',
      },
    ],
  },

  {
    id: 'PARA-44',
    title: 'Mount Kilimanjaro Volcanic Architecture and Free-Standing Stature',
    simulatedQuery: 'Is Mount Kilimanjaro the tallest free-standing mountain in the world?',
    simulatedBot: 'Claude 3.5',
    paragraph:
      'Mount Kilimanjaro in northeastern Tanzania is a dormant stratovolcano composed of three distinct volcanic cones: Kibo, Mawenzi, and Shira. Rising 5,895 meters (19,341 feet) above sea level, it is widely recognized as the highest free-standing mountain on Earth, meaning it rises dramatically from the surrounding East African plateau rather than forming part of a continuous mountain range.',
    expectedDecision: 'TRUST',
    mainReason:
      'USGS and East African Geological Survey establish Kilimanjaro as the highest free-standing mountain at 5,895m.',
    category: 'Clearly True',
    difficulty: 'Medium',
    domain: 'Geography',
    targetEntity: 'Mount Kilimanjaro Topography',
    keyClaims: [
      {
        id: 'c-44-1',
        claimText: 'Mount Kilimanjaro is the highest free-standing mountain on Earth at 5,895 meters.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Geographic and topographic consensus recognized by UNESCO and national geographical institutes.',
      },
    ],
  },

  {
    id: 'PARA-45',
    title: 'Mariana Trench Challenger Deep Bathymetric Depth',
    simulatedQuery: 'How deep is Challenger Deep in the Mariana Trench?',
    simulatedBot: 'Gemini 1.5 Pro',
    paragraph:
      'Challenger Deep, located in the southern Mariana Trench in the western Pacific Ocean, is the deepest surveyed point in Earth’s oceans. Sonar mapping and deep-submergence vehicle descents indicate its maximum depth reaches approximately 10,984 to 10,994 meters (around 36,000 feet), where hydrostatic pressure exceeds 1,000 times standard sea-level atmospheric pressure.',
    expectedDecision: 'TRUST',
    mainReason:
      'NOAA National Geophysical Data Center and multibeam sonar surveys confirm Challenger Deep bathymetry at ~10,994 meters.',
    category: 'Clearly True',
    difficulty: 'Medium',
    domain: 'Geography',
    targetEntity: 'Challenger Deep Ocean Depth',
    keyClaims: [
      {
        id: 'c-45-1',
        claimText: 'Challenger Deep is Earth’s deepest oceanic trench reaching approximately 10,994 meters.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Bathymetric surveys by NOAA and five-deeps expedition confirm ~10,984-10,994m depth.',
      },
    ],
  },

  {
    id: 'PARA-46',
    title: 'Vitamin C Megadosing and Common Cold Prevention Trials',
    simulatedQuery: 'Does taking high doses of Vitamin C prevent you from catching the common cold?',
    simulatedBot: 'Perplexity',
    paragraph:
      'Clinical reviews by the Cochrane Collaboration show that daily vitamin C supplementation of 1,000 mg or more fails to reduce the incidence of the common cold in the general population. While continuous prophylactic use may slightly shorten symptom duration by approximately 8 percent in adults, taking high therapeutic doses after cold symptoms appear provides no significant clinical benefit.',
    expectedDecision: 'TRUST',
    mainReason:
      'Cochrane Systematic Review (Hemilä & Chalker 2013) of 29 clinical trials demonstrates Vitamin C does not reduce cold incidence in normal populations.',
    category: 'Clearly True',
    difficulty: 'Medium',
    domain: 'Medicine/Biology',
    targetEntity: 'Vitamin C Common Cold Efficacy',
    keyClaims: [
      {
        id: 'c-46-1',
        claimText: 'Regular vitamin C megadoses do not reduce the incidence of the common cold in the general public.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Cochrane meta-analysis of over 11,000 participants shows no prophylactic prevention effect.',
      },
    ],
  },

  {
    id: 'PARA-47',
    title: 'Black Hole Event Horizon and Schwarzschild Radius Physics',
    simulatedQuery: 'What defines the boundary of a non-rotating black hole?',
    simulatedBot: 'ChatGPT-4o',
    paragraph:
      'In general relativity, the boundary of a non-rotating spherically symmetric black hole is defined by the event horizon, a null hypersurface beyond which escape velocity exceeds the speed of light. The radius of this horizon, known as the Schwarzschild radius, is directly proportional to mass and given by the formula R_s = 2GM/c^2.',
    expectedDecision: 'TRUST',
    mainReason:
      'Karl Schwarzschild’s exact solution to Einstein’s field equations defines the Schwarzschild radius as R_s = 2GM/c^2.',
    category: 'Clearly True',
    difficulty: 'Medium',
    domain: 'Astronomy',
    targetEntity: 'Schwarzschild Radius Horizon',
    keyClaims: [
      {
        id: 'c-47-1',
        claimText: 'The event horizon radius of a non-rotating black hole is given by the Schwarzschild radius R_s = 2GM/c^2.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Foundational relativistic astrophysics codified across general relativity literature.',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── HARD LEVEL: 20 CASES (PARA-48 to PARA-67) ───────────────────────────────
  // Mixed true+false, echo chamber collapse, outdated info, subtle attribution.
  // ══════════════════════════════════════════════════════════════════════════════

  {
    id: 'PARA-48',
    title: 'Apollo 11 Sea of Tranquility Lunar EVA Duration Compound Claim',
    simulatedQuery: 'How long did Neil Armstrong and Buzz Aldrin spend walking on the Moon during Apollo 11?',
    simulatedBot: 'Claude 3.5',
    paragraph:
      'On July 20, 1969, Apollo 11 Lunar Module Eagle touched down safely in the Sea of Tranquility. Astronauts Neil Armstrong and Buzz Aldrin conducted extensive exploration, spending 72 continuous hours walking on the lunar surface deploying experiments and collecting soil samples before rejoining Columbia in orbit.',
    expectedDecision: 'VERIFY',
    mainReason:
      'Poisoned compound claim: Apollo 11 landed in the Sea of Tranquility on July 20, 1969 (TRUE), but their extravehicular activity (EVA) outside the Lunar Module lasted only 2 hours and 31 minutes, not 72 continuous hours (total stay was ~21.5 hours). Requires partial verification.',
    category: 'Mixed True + False',
    difficulty: 'Hard',
    domain: 'History',
    targetEntity: 'Apollo 11 EVA Duration',
    keyClaims: [
      {
        id: 'c-48-1',
        claimText: 'Apollo 11 landed in the Sea of Tranquility on July 20, 1969.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Historical truth verified by NASA archives.',
      },
      {
        id: 'c-48-2',
        claimText: 'Armstrong and Aldrin spent 72 continuous hours walking on the lunar surface during EVA.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'NASA flight log confirms EVA duration was 2 hours, 31 minutes and 40 seconds.',
      },
    ],
  },

  {
    id: 'PARA-49',
    title: 'Marie Curie Nobel Laureate Dual Discipline Attribution',
    simulatedQuery: 'In which scientific fields did Marie Curie win her two Nobel Prizes?',
    simulatedBot: 'Gemini 1.5 Pro',
    paragraph:
      'Marie Curie made groundbreaking contributions to science as the first woman to win a Nobel Prize. In 1903, she shared the Nobel Prize in Physics with Pierre Curie and Henri Becquerel for their investigations into radioactivity. In 1911, she received her second Nobel Prize, awarded in Physiology or Medicine for her pioneering clinical radiotherapy treatments.',
    expectedDecision: 'VERIFY',
    mainReason:
      'Compound claim with subtle attribution error: Marie Curie won the 1903 Nobel in Physics (TRUE), but her second Nobel Prize in 1911 was in Chemistry (for the discovery of radium and polonium), NOT Physiology or Medicine.',
    category: 'Mixed True + False',
    difficulty: 'Hard',
    domain: 'History',
    targetEntity: 'Marie Curie Nobel Prizes',
    keyClaims: [
      {
        id: 'c-49-1',
        claimText: 'Marie Curie won the 1903 Nobel Prize in Physics for radioactivity research.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Nobel Foundation records confirm 1903 Physics Prize.',
      },
      {
        id: 'c-49-2',
        claimText: 'Marie Curie received her second Nobel Prize in Physiology or Medicine in 1911.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'Nobel Foundation records confirm 1911 Nobel Prize was awarded in Chemistry, not Medicine.',
      },
    ],
  },

  {
    id: 'PARA-50',
    title: 'EV Battery 20-Tonne Manufacturing Carbon Debt Syndication Collapse',
    simulatedQuery: 'Does manufacturing a single electric vehicle battery emit 17 to 20 tonnes of CO2?',
    simulatedBot: 'Perplexity',
    paragraph:
      'Over 25 independent global news organizations have confirmed that manufacturing a typical 75 kWh electric vehicle battery generates between 17 and 20 tonnes of carbon dioxide emissions before the car is ever driven. This universal consensus proves that electric vehicles incur an insurmountable carbon debt compared to diesel automobiles.',
    expectedDecision: 'VERIFY',
    mainReason:
      'Echo chamber collapse: all 25 news articles trace back to a single misreported 2017 study by Sweden’s IVL. Modern comprehensive lifecycle analyses (ICCT, Nature Communications 2020) demonstrate modern battery manufacturing emits 4 to 7 tonnes of CO2, not 17-20 tonnes.',
    category: 'Echo Chamber',
    difficulty: 'Hard',
    domain: 'Technology',
    targetEntity: 'EV Battery Carbon Debt',
    keyClaims: [
      {
        id: 'c-50-1',
        claimText: 'Independent news reports agree that a 75 kWh EV battery emits 17 to 20 tonnes of CO2 during manufacturing.',
        expectedDecision: 'VERIFY',
        isFactuallyAccurate: false,
        explanation: 'Single-source syndication collapse: 2017 IVL report was superseded; modern LCA confirms 4-7 tonnes CO2.',
      },
    ],
  },

  {
    id: 'PARA-51',
    title: 'Lemming Mass Cliff Suicide Myth Originating from Staged Documentary',
    simulatedQuery: 'Do lemmings commit mass suicide by jumping off ocean cliffs during overpopulation?',
    simulatedBot: 'ChatGPT-4o',
    paragraph:
      'During periods of extreme demographic overpopulation in the Arctic tundra, Norwegian lemmings (Lemmus lemmus) participate in instinctual mass suicide marches. Driven by population-control pheromones, thousands of lemmings deliberately leap off steep ocean cliffs to drown in the sea to preserve species resources.',
    expectedDecision: 'ABSTAIN',
    mainReason:
      'Debunked zoological myth: lemmings do not commit suicide. The myth was perpetuated by Disney’s 1958 documentary "White Wilderness," where filmmakers manually threw lemmings off cliffs using a spinning turntable into the Bow River.',
    category: 'Common Misconception',
    difficulty: 'Hard',
    domain: 'Medicine/Biology',
    targetEntity: 'Lemming Mass Suicide Myth',
    keyClaims: [
      {
        id: 'c-51-1',
        claimText: 'Lemmings engage in instinctual mass suicide leaps off cliffs to control their population.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'Zoological consensus (Canadian Broadcasting Corp investigation) confirms myth was staged by filmmakers.',
      },
    ],
  },

  {
    id: 'PARA-52',
    title: 'Pluto Outdated Planetary Classification in Modern Astronomy',
    simulatedQuery: 'Is Pluto the ninth planet from the Sun in our solar system today?',
    simulatedBot: 'Claude 3.5',
    paragraph:
      'Pluto represents the ninth and outermost major planet of our solar system, following Neptune in an eccentric 248-year orbit. Although small and icy, Pluto maintains its sovereign status as one of the nine classical major planets established by Clyde Tombaugh’s discovery in 1930.',
    expectedDecision: 'ABSTAIN',
    mainReason:
      'Outdated information presented as current: Pluto was officially reclassified as a dwarf planet by the International Astronomical Union (IAU) in 2006. Presenting it as the ninth major planet today is factually incorrect.',
    category: 'Outdated Information',
    difficulty: 'Hard',
    domain: 'Astronomy',
    targetEntity: 'Pluto Ninth Planet Status',
    keyClaims: [
      {
        id: 'c-52-1',
        claimText: 'Pluto is currently classified as the ninth major planet of the solar system.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'Superseded by 2006 IAU Resolution B5 reclassifying Pluto as a dwarf planet.',
      },
    ],
  },

  {
    id: 'PARA-53',
    title: 'Peptic Ulcer Etiology Superseded by Helicobacter pylori Discovery',
    simulatedQuery: 'Are stomach ulcers caused exclusively by psychological stress and eating spicy foods?',
    simulatedBot: 'Gemini 1.5 Pro',
    paragraph:
      'Clinical gastroenterology establishes that peptic stomach ulcers are caused exclusively by psychological stress, neurotic anxiety, and excessive consumption of acidic or spicy foods. High stress hormones trigger hyper-secretion of hydrochloric acid that corrodes gastric mucous linings, treatable solely through tranquilizers and bland milk diets.',
    expectedDecision: 'ABSTAIN',
    mainReason:
      'Outdated medical dogma: Barry Marshall and Robin Warren proved in 1982 (Nobel Prize 2005) that >80% of peptic ulcers are caused by bacterial infection with Helicobacter pylori or NSAID usage, not by stress or spicy foods.',
    category: 'Outdated Information',
    difficulty: 'Hard',
    domain: 'Medicine/Biology',
    targetEntity: 'Peptic Ulcer Etiology',
    keyClaims: [
      {
        id: 'c-53-1',
        claimText: 'Stomach ulcers are caused exclusively by stress and spicy foods rather than bacterial infection.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'Nobel Prize in Physiology or Medicine 2005 confirms Helicobacter pylori bacterial etiology.',
      },
    ],
  },

  {
    id: 'PARA-54',
    title: 'Voyager 1 Interstellar Transit Velocity Exaggeration',
    simulatedQuery: 'How fast is NASA’s Voyager 1 spacecraft traveling as it enters interstellar space?',
    simulatedBot: 'Perplexity',
    paragraph:
      'In August 2012, NASA’s Voyager 1 probe officially crossed the heliopause to become the first human-made object to enter interstellar space. Accelerated by planetary gravity assists, the spacecraft hurtles through the local interstellar medium at an astonishing relativistic speed of approximately 0.1c (10% the speed of light).',
    expectedDecision: 'ABSTAIN',
    mainReason:
      'Severe numerical and technical falsehood: Voyager 1 crossed the heliopause in 2012 (TRUE), but its velocity is ~17 kilometers per second (about 38,000 mph or 0.000057c), which is over 1,700 times slower than 0.1c.',
    category: 'Numerical Error',
    difficulty: 'Hard',
    domain: 'Astronomy',
    targetEntity: 'Voyager 1 Interstellar Velocity',
    keyClaims: [
      {
        id: 'c-54-1',
        claimText: 'Voyager 1 crossed into interstellar space in August 2012.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'NASA JPL telemetry confirms heliopause crossing in August 2012.',
      },
      {
        id: 'c-54-2',
        claimText: 'Voyager 1 travels at a relativistic velocity of 0.1c (10% speed of light).',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'NASA telemetry confirms velocity is ~17 km/s (0.000057c), not 30,000 km/s (0.1c).',
      },
    ],
  },

  {
    id: 'PARA-55',
    title: '5G Millimeter Wave Radiation Cellular DNA Ionization Contradiction',
    simulatedQuery: 'Can 5G cell tower radiation break chemical bonds and ionize human cellular DNA?',
    simulatedBot: 'ChatGPT-4o',
    paragraph:
      'High-frequency 5G millimeter wave transmissions operate at extreme frequencies between 24 and 40 GHz. These concentrated telecommunication waves carry sufficient photon energy to strip electrons from human atoms, ionizing cellular DNA molecules and inducing neoplastic malignant mutations in skin tissue.',
    expectedDecision: 'ABSTAIN',
    mainReason:
      'Direct violation of quantum physics: 5G radiofrequency radiation has photon energies around 0.0001 eV, whereas ionizing atomic bonds requires photon energies greater than 10 to 12 eV (ultraviolet, X-ray). 5G is strictly non-ionizing.',
    category: 'Sounds True But False',
    difficulty: 'Hard',
    domain: 'Technology',
    targetEntity: '5G DNA Ionization Myth',
    keyClaims: [
      {
        id: 'c-55-1',
        claimText: '5G millimeter waves carry sufficient photon energy to ionize electrons and damage cellular DNA.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'FCC, WHO, and IEEE physics consensus confirms 5G is non-ionizing radiation incapable of breaking DNA bonds.',
      },
    ],
  },

  {
    id: 'PARA-56',
    title: 'Craniosacral Manual Suture Articulation and Cerebrospinal Palpation',
    simulatedQuery: 'Can craniosacral therapy manipulate the cranial sutures of an adult skull?',
    simulatedBot: 'Claude 3.5',
    paragraph:
      'Craniosacral therapy utilizes gentle 5-gram manual touch to mobilize the cranial sutures of the adult skull in sync with the primary respiratory tidal rhythm of cerebrospinal fluid. Adjusting these micro-articulations between the parietal and temporal bones restores hemodynamic balance and alleviates central nervous tension.',
    expectedDecision: 'ABSTAIN',
    mainReason:
      'Anatomical pseudoscience: adult human cranial sutures are ossified synarthrodial joints completely fused with Sharpey’s fibers that cannot be mobilized by human hands; double-blind trials show inter-rater palpation reliability is zero.',
    category: 'Sounds True But False',
    difficulty: 'Hard',
    domain: 'Medicine/Biology',
    targetEntity: 'Craniosacral Suture Mobility',
    keyClaims: [
      {
        id: 'c-56-1',
        claimText: 'Adult cranial sutures articulate and can be physically mobilized by light manual touch.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'Anatomy consensus: adult sutures fuse solidly into immovable synarthroses by early adulthood.',
      },
    ],
  },

  {
    id: 'PARA-57',
    title: 'Himalayan Pink Salt Lamp Atmospheric Negative Ion Generation',
    simulatedQuery: 'Do Himalayan pink salt lamps neutralize electromagnetic radiation and purify indoor air?',
    simulatedBot: 'Gemini 1.5 Pro',
    paragraph:
      'Himalayan pink salt lamps generate hygroscopic negative air ions when heated by an incandescent bulb. These active negative ions attract and permanently neutralize toxic positive ions emitted by Wi-Fi routers and computer screens, neutralizing electromagnetic field (EMF) radiation and sterilizing airborne pathogens through ionic precipitation.',
    expectedDecision: 'ABSTAIN',
    mainReason:
      'Commercial pseudoscience: a warm 15W lightbulb inside rock salt lacks the thermal and electrical energy required to ionize air, and negative ions have no physical capability to block or neutralize radiofrequency EMF radiation.',
    category: 'Sounds True But False',
    difficulty: 'Hard',
    domain: 'Science',
    targetEntity: 'Himalayan Salt Lamp Negative Ions',
    keyClaims: [
      {
        id: 'c-57-1',
        claimText: 'Heated Himalayan salt lamps generate substantial quantities of negative air ions.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'Thermal air ionization requires hundreds of degrees Celsius; 15W bulbs produce negligible ions.',
      },
      {
        id: 'c-57-2',
        claimText: 'Negative ions neutralize electromagnetic field radiation from Wi-Fi and electronics.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'EMF radiation consists of oscillating electromagnetic waves that cannot be cancelled by chemical ions.',
      },
    ],
  },

  {
    id: 'PARA-58',
    title: 'Albert Einstein 1921 Nobel Prize Citation Attribution Discrepancy',
    simulatedQuery: 'Why was Albert Einstein awarded the 1921 Nobel Prize in Physics?',
    simulatedBot: 'Perplexity',
    paragraph:
      'Albert Einstein was awarded the 1921 Nobel Prize in Physics in recognition of his groundbreaking formulation of the General Theory of Relativity, which revolutionized gravitational physics and curved spacetime geometry following Arthur Eddington’s 1919 solar eclipse confirmation.',
    expectedDecision: 'ABSTAIN',
    mainReason:
      'Historical attribution error: Einstein was awarded the 1921 Nobel Prize exclusively for his explanation of the photoelectric effect. General Relativity was intentionally excluded by the Nobel Committee due to ongoing controversy.',
    category: 'Sounds True But False',
    difficulty: 'Hard',
    domain: 'History',
    targetEntity: 'Einstein Nobel Prize Citation',
    keyClaims: [
      {
        id: 'c-58-1',
        claimText: 'Einstein was awarded the 1921 Nobel Prize in Physics for General Relativity.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'Official Nobel Committee citation: awarded for services to Theoretical Physics, and especially for his discovery of the law of the photoelectric effect.',
      },
    ],
  },

  {
    id: 'PARA-59',
    title: 'Voyager Golden Record Apollo 17 Spacecraft Attribution',
    simulatedQuery: 'Was the famous Golden Record carrying sounds of Earth sent aboard Apollo 17?',
    simulatedBot: 'ChatGPT-4o',
    paragraph:
      'In December 1972, NASA launched the Voyager Golden Record aboard Apollo 17, the final crewed lunar landing mission. Curated by Carl Sagan, the 12-inch gold-plated copper phonograph record contains greetings in 55 languages, music by Bach and Chuck Berry, and sounds of humpback whales for extraterrestrial civilizations.',
    expectedDecision: 'ABSTAIN',
    mainReason:
      'Historical spacecraft attribution error: the Golden Record contents curated by Carl Sagan are real, but they were launched aboard the robotic Voyager 1 and Voyager 2 spacecraft in 1977, not on Apollo 17 in 1972.',
    category: 'Sounds True But False',
    difficulty: 'Hard',
    domain: 'History',
    targetEntity: 'Voyager Golden Record Mission',
    keyClaims: [
      {
        id: 'c-59-1',
        claimText: 'The Golden Record carrying Earth sounds was launched aboard Apollo 17 in 1972.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'NASA archives confirm the Golden Records were launched aboard Voyager 1 and Voyager 2 in 1977.',
      },
    ],
  },

  {
    id: 'PARA-60',
    title: 'Spinach Iron Content Decimal Point Typo Historiographical Dispute',
    simulatedQuery: 'Did a misplaced decimal point in 1870 cause the myth that spinach has 10 times more iron?',
    simulatedBot: 'Claude 3.5',
    paragraph:
      'In 1870, German chemist Erich von Wolf accidentally misplaced a decimal point when transcribing the iron content of spinach, recording 35 milligrams instead of 3.5 milligrams per 100 grams. This single typographical error was perpetuated for decades, inspiring the Popeye cartoon franchise, until the error was finally corrected by British researchers in 1937.',
    expectedDecision: 'VERIFY',
    mainReason:
      'Echo chamber historiographical myth: criminologist Mike Sutton proved in 2010 that the famous "Erich von Wolf 1870 decimal point error" was itself an invented academic myth with no evidence in original German literature. Deserves careful verification.',
    category: 'Echo Chamber',
    difficulty: 'Hard',
    domain: 'General Knowledge',
    targetEntity: 'Spinach Decimal Point Myth',
    keyClaims: [
      {
        id: 'c-60-1',
        claimText: 'Erich von Wolf misplaced a decimal point in 1870 creating the spinach iron myth.',
        expectedDecision: 'VERIFY',
        isFactuallyAccurate: false,
        explanation: 'Historiographical research (Sutton 2010, Internet Journal of Criminology) showed the decimal error story was itself an unverified myth.',
      },
    ],
  },

  {
    id: 'PARA-61',
    title: 'Human Genome Protein-Coding Genes and Banana Homology',
    simulatedQuery: 'How many genes do humans have, and is it true we share 99% of our DNA with bananas?',
    simulatedBot: 'Gemini 1.5 Pro',
    paragraph:
      'The Human Genome Project determined that human DNA contains approximately 20,000 to 25,000 protein-coding genes. Remarkable comparative genomic sequencing shows that because foundational cellular processes are conserved across all eukaryotes, humans share over 99 percent of their identical genetic DNA sequence with common bananas.',
    expectedDecision: 'VERIFY',
    mainReason:
      'Mixed compound claim: humans do have approximately 20,000 to 25,000 protein-coding genes (TRUE), but humans share roughly 40-50% homologous genes with bananas (and ~1-2% sequence identity across whole genome), NOT 99%.',
    category: 'Mixed True + False',
    difficulty: 'Hard',
    domain: 'Medicine/Biology',
    targetEntity: 'Human Genome Banana Homology',
    keyClaims: [
      {
        id: 'c-61-1',
        claimText: 'The human genome contains roughly 20,000 to 25,000 protein-coding genes.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Human Genome Project and ENCODE consensus confirms ~20,000 protein-coding genes.',
      },
      {
        id: 'c-61-2',
        claimText: 'Humans share over 99 percent of their identical genetic DNA with bananas.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'Genomic sequencing shows ~40-50% homologous gene families, but <2% whole-genome base identity.',
      },
    ],
  },

  {
    id: 'PARA-62',
    title: 'Great Barrier Reef Direct Coral Polyps Photosynthesis Claim',
    simulatedQuery: 'Do coral polyps in the Great Barrier Reef directly perform photosynthesis?',
    simulatedBot: 'Perplexity',
    paragraph:
      'The Great Barrier Reef off the coast of Queensland, Australia, is the planet’s largest living structure, visible from space. The reef-building stony coral polyps sustain this massive biomass by directly synthesizing chlorophyll-a inside their invertebrate cell walls, converting sunlight directly into sugars via endogenous photosynthesis.',
    expectedDecision: 'VERIFY',
    mainReason:
      'Mixed compound claim: the Great Barrier Reef is the largest living structure (TRUE), but coral polyps are animals that cannot perform photosynthesis directly; they rely on an obligatory endosymbiotic relationship with zooxanthellae dinoflagellates (Symbiodiniaceae) living within their gastrodermal tissues.',
    category: 'Mixed True + False',
    difficulty: 'Hard',
    domain: 'Medicine/Biology',
    targetEntity: 'Coral Photosynthesis Symbiosis',
    keyClaims: [
      {
        id: 'c-62-1',
        claimText: 'The Great Barrier Reef is the world’s largest living structure.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Universal marine biology benchmark confirmed by UNESCO and Australian Marine Science Institute.',
      },
      {
        id: 'c-62-2',
        claimText: 'Coral polyps directly perform endogenous photosynthesis via their own chlorophyll.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'Corals are animals lacking chloroplasts; they rely on symbiotic zooxanthellae algae.',
      },
    ],
  },

  {
    id: 'PARA-63',
    title: 'Type 1 Diabetes Pathogenesis and Dietary Sucrose Confusion',
    simulatedQuery: 'Does eating too much dietary sugar directly cause Type 1 diabetes in children?',
    simulatedBot: 'ChatGPT-4o',
    paragraph:
      'Pediatric endocrinology demonstrates that Type 1 diabetes is triggered by excessive consumption of dietary sucrose, candy, and sweetened sodas during early childhood. The acute sugar spikes overtax pancreatic beta cells, causing chronic insulin exhaustion and metabolic collapse.',
    expectedDecision: 'ABSTAIN',
    mainReason:
      'Severe medical confusion: Type 1 diabetes is an autoimmune disease characterized by T-cell mediated destruction of insulin-producing pancreatic beta cells, with genetic and viral triggers. It is completely unrelated to dietary sugar intake (which is a risk factor for Type 2 diabetes).',
    category: 'Sounds True But False',
    difficulty: 'Hard',
    domain: 'Medicine/Biology',
    targetEntity: 'Type 1 Diabetes Etiology',
    keyClaims: [
      {
        id: 'c-63-1',
        claimText: 'Type 1 diabetes is directly caused by high dietary sugar intake overtaxing beta cells.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'American Diabetes Association: Type 1 is an autoimmune disorder, not caused by eating sugar.',
      },
    ],
  },

  {
    id: 'PARA-64',
    title: 'Refractive Index and Phase Velocity of Light in Dielectric Media',
    simulatedQuery: 'Does light always travel at the invariant speed c in all materials like water and glass?',
    simulatedBot: 'Claude 3.5',
    paragraph:
      'According to special relativity, the speed of light is a strict universal invariant that never changes regardless of the medium it traverses. Even when passing through dense optical glass or deep water, photons continue to propagate at the invariant speed c = 299,792,458 m/s without experiencing any deceleration.',
    expectedDecision: 'VERIFY',
    mainReason:
      'Subtle physics discrepancy: the phase velocity of light in a refractive medium is reduced to v = c / n (e.g., ~225,000 km/s in water, ~200,000 km/s in glass). While individual photon propagation between atoms remains c, the collective macroscopic electromagnetic wave undeniably slows down.',
    category: 'Sounds True But False',
    difficulty: 'Hard',
    domain: 'Science',
    targetEntity: 'Speed of Light in Media',
    keyClaims: [
      {
        id: 'c-64-1',
        claimText: 'Light travels at the same speed c in water and glass as it does in vacuum without slowing down.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'Optical physics: phase velocity slows to v = c/n depending on the medium refractive index.',
      },
    ],
  },

  {
    id: 'PARA-65',
    title: 'Rosetta Stone Discovery and Decipherment Chronology',
    simulatedQuery: 'Who discovered the Rosetta Stone and when was it decoded?',
    simulatedBot: 'Gemini 1.5 Pro',
    paragraph:
      'The Rosetta Stone was unearthed by French Napoleonic soldiers commanded by Pierre-François Bouchard in 1799 near the city of Rashid. Carrying parallel inscriptions in Ancient Greek, Demotic, and Egyptian Hieroglyphs, the stone’s hieroglyphic code was cracked that same year in 1799 by linguist Jean-François Champollion.',
    expectedDecision: 'VERIFY',
    mainReason:
      'Subtle historical chronological error: Bouchard found the stone in 1799 (TRUE), but Jean-François Champollion did not decipher the hieroglyphs that same year; he cracked the code 23 years later in 1822 through his Lettre à M. Dacier.',
    category: 'Mixed True + False',
    difficulty: 'Hard',
    domain: 'History',
    targetEntity: 'Rosetta Stone Decipherment Date',
    keyClaims: [
      {
        id: 'c-65-1',
        claimText: 'Pierre-François Bouchard discovered the Rosetta Stone during the Napoleonic campaign in 1799.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'British Museum and Egyptian historical record confirms 1799 discovery date.',
      },
      {
        id: 'c-65-2',
        claimText: 'Jean-François Champollion successfully cracked the hieroglyphic code in 1799.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'Champollion was only 9 years old in 1799; he published his decipherment in 1822.',
      },
    ],
  },

  {
    id: 'PARA-66',
    title: 'United States Bullion Depository at Fort Knox Liquidation Rumor',
    simulatedQuery: 'Is Fort Knox secretly empty of all gold bullion since the 1970s?',
    simulatedBot: 'Perplexity',
    paragraph:
      'Extensive investigative reports circulating on financial alternative news networks reveal that the United States Bullion Depository at Fort Knox was secretly liquidated in 1974. The 4,580 metric tons of gold reserves were quietly shipped to European private banks, leaving the vaults completely bare today.',
    expectedDecision: 'ABSTAIN',
    mainReason:
      'Unsubstantiated conspiracy echo chamber: the United States Mint and Department of the Treasury conduct regular physical audits, confirming 147.3 million troy ounces (~4,580 metric tons) of gold bullion remain physically secured inside Fort Knox.',
    category: 'Echo Chamber',
    difficulty: 'Hard',
    domain: 'Current Affairs',
    targetEntity: 'Fort Knox Gold Bullion Reserves',
    keyClaims: [
      {
        id: 'c-66-1',
        claimText: 'Fort Knox vaults were secretly emptied of all gold reserves in 1974.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'U.S. Mint and Treasury Inspector General annual physical audits confirm 147.3M troy oz gold held.',
      },
    ],
  },

  {
    id: 'PARA-67',
    title: 'Mitochondrial Circular DNA Bilateral Parental Inheritance Claim',
    simulatedQuery: 'Is human mitochondrial DNA inherited equally from both the mother and the father?',
    simulatedBot: 'ChatGPT-4o',
    paragraph:
      'Human mitochondria possess their own distinct circular genome (mtDNA) encoding 37 genes essential for oxidative phosphorylation, a relic of their endosymbiotic alpha-proteobacterial ancestry. During human fertilization, sperm and egg mitochondria merge equally, ensuring children inherit 50 percent of their mitochondrial DNA from their biological father.',
    expectedDecision: 'VERIFY',
    mainReason:
      'Compound claim with subtle biological error: mitochondria do have circular mtDNA encoding 37 genes derived from endosymbiotic alpha-proteobacteria (TRUE), but human mtDNA is inherited almost exclusively matrilineally (from the mother). Paternal sperm mitochondria are tagged with ubiquitin and actively degraded upon entering the oocyte.',
    category: 'Mixed True + False',
    difficulty: 'Hard',
    domain: 'Medicine/Biology',
    targetEntity: 'Mitochondrial DNA Matrilineal Inheritance',
    keyClaims: [
      {
        id: 'c-67-1',
        claimText: 'Mitochondria possess their own circular genome encoding 37 genes from endosymbiotic origin.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Standard molecular cell biology confirmed by Lynn Margulis endosymbiotic theory.',
      },
      {
        id: 'c-67-2',
        claimText: 'Children inherit 50 percent of their mitochondrial DNA from their biological father.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'Human mtDNA inheritance is strictly maternal; sperm mitochondria undergo ubiquitin-mediated proteolysis.',
      },
    ],
  },
// =========================================================================
  // EXTENDED CHATBOT PARAGRAPH TEST SUITE (PARA-68 to PARA-100)
  // =========================================================================
  {
    id: 'PARA-68',
    title: 'Speed of Light and Special Relativity Invariance',
    simulatedQuery: 'What is the speed of light and does it change if you are moving towards the light source?',
    simulatedBot: 'ChatGPT-4o',
    paragraph:
      'The speed of light in vacuum is exactly 299,792,458 metres per second, an invariant universal constant denoted by the symbol c. According to Einstein special theory of relativity, the speed of light is completely identical for all inertial observers regardless of their relative motion or velocity relative to the source.',
    expectedDecision: 'TRUST',
    mainReason:
      'Physical constants and Special Relativity postulate: the speed of light in vacuum is constant for all inertial frames of reference.',
    category: 'Clearly True',
    difficulty: 'Easy',
    domain: 'Science',
    targetEntity: 'Light Speed Invariance in Relativity',
    keyClaims: [
      {
        id: 'c-68-1',
        claimText: 'The speed of light in vacuum is 299,792,458 metres per second.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'SI standard definition codifies exact speed of light in vacuum.',
      },
      {
        id: 'c-68-2',
        claimText: 'The speed of light in vacuum is identical for all inertial observers regardless of relative motion.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Second postulate of Special Relativity validated by Michelson-Morley experiments.',
      },
    ],
  },
  {
    id: 'PARA-69',
    title: 'DNA Base Pairing Rules and Watson-Crick Structure',
    simulatedQuery: 'How are base pairs connected in DNA?',
    simulatedBot: 'Claude 3.5',
    paragraph:
      'In standard B-form deoxyribonucleic acid (DNA), complementary base pairing occurs between adenine and thymine via two hydrogen bonds, and between guanine and cytosine via three hydrogen bonds. This antiparallel complementary arrangement creates the double helix stability.',
    expectedDecision: 'TRUST',
    mainReason:
      'Watson-Crick base pairing rules (A-T with 2 hydrogen bonds, G-C with 3 hydrogen bonds) are foundational molecular genetics principles.',
    category: 'Clearly True',
    difficulty: 'Easy',
    domain: 'Medicine/Biology',
    targetEntity: 'DNA Hydrogen Bond Base Pairing',
    keyClaims: [
      {
        id: 'c-69-1',
        claimText: 'Adenine pairs with thymine via two hydrogen bonds, and guanine with cytosine via three hydrogen bonds.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Fundamental thermodynamic and chemical structural pairing rules of B-DNA.',
      },
    ],
  },
  {
    id: 'PARA-70',
    title: 'Water Boiling Point Under Varying Atmospheric Altitudes',
    simulatedQuery: 'Does water boil at 100°C on top of Mount Everest?',
    simulatedBot: 'Gemini 1.5 Pro',
    paragraph:
      'While pure water boils at 100 degrees Celsius under standard sea-level atmospheric pressure of 101.3 kPa, boiling temperature decreases as barometric pressure drops. At the summit of Mount Everest, where atmospheric pressure is only about one-third of sea level, water boils at approximately 68 to 70 degrees Celsius.',
    expectedDecision: 'TRUST',
    mainReason:
      'Thermodynamic Clausius-Clapeyron relation: reduced ambient vapor pressure lowers the boiling point of water to ~68-70°C at 8,849m.',
    category: 'Clearly True',
    difficulty: 'Medium',
    domain: 'Science',
    targetEntity: 'Water Boiling Point Altitude Variation',
    keyClaims: [
      {
        id: 'c-70-1',
        claimText: 'Water boils at approximately 68 to 70 degrees Celsius at the summit of Mount Everest.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Lower atmospheric pressure at high altitude drops water boiling point.',
      },
    ],
  },
  {
    id: 'PARA-71',
    title: 'Human Brain Ten Percent Usage Myth Asserted as Medical Fact',
    simulatedQuery: 'How much of our brain do we normally use?',
    simulatedBot: 'Perplexity',
    paragraph:
      'Neurological research confirms that humans only use roughly 10 percent of their cerebral cortex in daily life. The remaining 90 percent consists of dormant neural pathways that can be activated through specialized cognitive training exercises.',
    expectedDecision: 'ABSTAIN',
    mainReason:
      'Classic neuromyth: functional MRI and PET imaging prove that virtually 100% of the human brain shows active metabolic function across normal daily cycles.',
    category: 'Common Misconception',
    difficulty: 'Easy',
    domain: 'Medicine/Biology',
    targetEntity: 'Ten Percent Brain Usage Neuromyth',
    keyClaims: [
      {
        id: 'c-71-1',
        claimText: 'Humans only use roughly 10 percent of their cerebral cortex.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'Debunked by modern neuroscience; almost all brain areas show functional activity.',
      },
    ],
  },
  {
    id: 'PARA-72',
    title: 'Great Wall of China Visibility from Lunar Distance Assertion',
    simulatedQuery: 'Can astronauts see the Great Wall of China from the Moon?',
    simulatedBot: 'ChatGPT-4o',
    paragraph:
      'The Great Wall of China is the only human-engineered monument capable of being seen with the naked human eye from the surface of the Moon. Apollo astronauts recorded seeing its distinct outline snaking across the Asian continent.',
    expectedDecision: 'ABSTAIN',
    mainReason:
      'Empirically contradicted: NASA and Apollo astronauts confirm the Great Wall is completely invisible from lunar distance without high-magnification optical equipment.',
    category: 'Common Misconception',
    difficulty: 'Easy',
    domain: 'Geography',
    targetEntity: 'Great Wall Visibility from Space Myth',
    keyClaims: [
      {
        id: 'c-72-1',
        claimText: 'The Great Wall of China is visible to the naked human eye from the Moon.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'Wall is only a few meters wide and blends with terrain; invisible from lunar orbit.',
      },
    ],
  },
  {
    id: 'PARA-73',
    title: 'Vaccines and Childhood Autism Discredited Wakefield Study Mix',
    simulatedQuery: 'Do routine MMR vaccines cause autism in children?',
    simulatedBot: 'Claude 3.5',
    paragraph:
      'Decades of rigorous epidemiological studies involving millions of children across the United States, Denmark, and the UK have found no causal link between the MMR vaccine and autism. The original 1998 Lancet paper by Andrew Wakefield claiming a connection was fully retracted due to falsified data and ethical violations.',
    expectedDecision: 'TRUST',
    mainReason:
      'Global medical consensus: CDC, WHO, Institute of Medicine, and Cochrane reviews confirm vaccines do not cause autism; Wakefield 1998 paper was retracted for fraud.',
    category: 'Clearly True',
    difficulty: 'Easy',
    domain: 'Medicine/Biology',
    targetEntity: 'MMR Vaccine Autism Absence of Causation',
    keyClaims: [
      {
        id: 'c-73-1',
        claimText: 'Epidemiological studies have found no causal link between the MMR vaccine and autism.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Universal pediatric and public health consensus.',
      },
      {
        id: 'c-73-2',
        claimText: 'The 1998 Wakefield Lancet paper was fully retracted due to falsified data.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Retracted in 2010 by The Lancet following GMC findings of fraud.',
      },
    ],
  },
  {
    id: 'PARA-74',
    title: 'Sun Rising in the West Counter-Intuition Error',
    simulatedQuery: 'In which direction does the Sun rise on planet Earth?',
    simulatedBot: 'Gemini 1.5 Pro',
    paragraph:
      'Because the Earth rotates from east to west on its rotational axis, observers in the Northern Hemisphere always watch the Sun rise in the west and set in the east.',
    expectedDecision: 'ABSTAIN',
    mainReason:
      'Direct empirical contradiction: Earth rotates west-to-east (prograde), causing the Sun to rise in the east and set in the west across all Earth longitudes.',
    category: 'Clearly False',
    difficulty: 'Easy',
    domain: 'Astronomy',
    targetEntity: 'Solar Sunrise Cardinal Direction',
    keyClaims: [
      {
        id: 'c-74-1',
        claimText: 'Observers in the Northern Hemisphere watch the Sun rise in the west.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'Sun rises in the east and sets in the west everywhere on Earth.',
      },
    ],
  },
  {
    id: 'PARA-75',
    title: 'Lightning Striking Same Place Multiple Times Physics',
    simulatedQuery: 'Can lightning strike the same place twice?',
    simulatedBot: 'Perplexity',
    paragraph:
      'The common saying that lightning never strikes the same place twice is an absolute myth. Lightning repeatedly strikes tall geographic features and structures; for example, New York Empire State Building is struck by lightning between 25 and 100 times every single year.',
    expectedDecision: 'TRUST',
    mainReason:
      'Atmospheric physics fact: ionization paths and height attract repetitive cloud-to-ground lightning discharges.',
    category: 'Clearly True',
    difficulty: 'Easy',
    domain: 'Science',
    targetEntity: 'Repetitive Lightning Strikes Physics',
    keyClaims: [
      {
        id: 'c-75-1',
        claimText: 'Lightning repeatedly strikes tall structures like the Empire State Building multiple times each year.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Empirical records confirm dozens of annual strikes on tall towers.',
      },
    ],
  },
  {
    id: 'PARA-76',
    title: 'Napoleon Bonaparte Height and French Unit Conversion',
    simulatedQuery: 'Was Napoleon Bonaparte unusually short?',
    simulatedBot: 'ChatGPT-4o',
    paragraph:
      'Napoleon Bonaparte was recorded at his autopsy as standing 5 French feet 2 inches, which British caricaturists popularized as evidence of his diminutive stature. In modern imperial units, this converts to roughly 5 feet 6.5 inches (169 cm), which was actually slightly above the average height of an 18th-century French adult male.',
    expectedDecision: 'TRUST',
    mainReason:
      'Historical unit confusion: the French pouce/pied was longer than the English inch/foot, leading British propaganda to depict Napoleon as exceptionally short.',
    category: 'Clearly True',
    difficulty: 'Medium',
    domain: 'History',
    targetEntity: 'Napoleon Bonaparte Height Dispel',
    keyClaims: [
      {
        id: 'c-76-1',
        claimText: 'Napoleon stood approximately 5 feet 6.5 inches (169 cm), average or slightly above average for his era.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Autopsy records confirmed 5 pieds 2 pouces = ~169 cm.',
      },
    ],
  },
  {
    id: 'PARA-77',
    title: 'EV Battery Manufacturing Carbon Payback Period Lifecycle',
    simulatedQuery: 'Do electric vehicles take 100,000 km to offset their battery manufacturing emissions?',
    simulatedBot: 'Claude 3.5',
    paragraph:
      'Life-cycle assessment studies from the International Council on Clean Transportation (ICCT) and Argonne National Laboratory show that producing a typical 60 to 75 kWh EV battery generates approximately 4 to 7 tonnes of CO2. When operated on average electricity grids, an electric vehicle offsets this manufacturing carbon debt within 15,000 to 25,000 kilometres of driving.',
    expectedDecision: 'TRUST',
    mainReason:
      'Contemporary lifecycle assessments confirm EV emissions break-even occurs within 1-2 years of typical driving, debunking claims of 100,000+ km parity.',
    category: 'Clearly True',
    difficulty: 'Hard',
    domain: 'Technology',
    targetEntity: 'EV Battery Emissions Break-Even Mileage',
    keyClaims: [
      {
        id: 'c-77-1',
        claimText: 'Manufacturing a 60-75 kWh battery generates ~4 to 7 tonnes CO2 equivalent.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'ICCT and modern LCA audits confirm 4-7 tonnes CO2eq for contemporary packs.',
      },
      {
        id: 'c-77-2',
        claimText: 'An EV typically offsets its manufacturing emissions within 15,000 to 25,000 km of driving.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Emissions parity achieved rapidly under standard grid carbon intensities.',
      },
    ],
  },
  {
    id: 'PARA-78',
    title: 'Earth Atmosphere Composition Nitrogen and Oxygen Dominance',
    simulatedQuery: 'What are the main gases in Earth atmosphere?',
    simulatedBot: 'Gemini 1.5 Pro',
    paragraph:
      'Dry atmospheric air near sea level is composed predominantly of nitrogen (approximately 78.08 percent) and oxygen (approximately 20.95 percent). Argon makes up roughly 0.93 percent, while carbon dioxide currently accounts for about 0.042 percent (420 parts per million).',
    expectedDecision: 'TRUST',
    mainReason:
      'Standard scientific model of atmospheric chemical composition codified by NOAA and WMO.',
    category: 'Clearly True',
    difficulty: 'Easy',
    domain: 'Science',
    targetEntity: 'Atmospheric Gas Proportions',
    keyClaims: [
      {
        id: 'c-78-1',
        claimText: 'Dry air contains approximately 78% nitrogen and 21% oxygen.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Standard atmospheric composition confirmed by gas chromatography.',
      },
    ],
  },
  {
    id: 'PARA-79',
    title: 'Albert Einstein Nobel Prize Citation Specificity',
    simulatedQuery: 'Did Albert Einstein win the Nobel Prize for General Relativity?',
    simulatedBot: 'Perplexity',
    paragraph:
      'Albert Einstein was awarded the 1921 Nobel Prize in Physics specifically for his discovery of the law of the photoelectric effect, not for his theory of relativity. The Nobel committee intentionally excluded relativity from the citation due to lingering experimental skepticism and controversy in 1921.',
    expectedDecision: 'TRUST',
    mainReason:
      'Official Nobel Prize citation: awarded for services to Theoretical Physics, and especially for his discovery of the law of the photoelectric effect.',
    category: 'Clearly True',
    difficulty: 'Medium',
    domain: 'History',
    targetEntity: 'Einstein Nobel Prize Photoelectric Effect Citation',
    keyClaims: [
      {
        id: 'c-79-1',
        claimText: 'Einstein won the 1921 Nobel Prize for the photoelectric effect, not relativity.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Official Nobel Foundation citation records photoelectric law.',
      },
    ],
  },
  {
    id: 'PARA-80',
    title: 'Glass Viscosity and Antique Window Panes Fabrication',
    simulatedQuery: 'Does glass flow like a liquid over hundreds of years?',
    simulatedBot: 'ChatGPT-4o',
    paragraph:
      'Antique cathedral glass is significantly thicker at the base because glass is an ultra-slow-flowing liquid that gradually creeps downward over centuries due to gravitational pull.',
    expectedDecision: 'ABSTAIN',
    mainReason:
      'Materials physics debunk: glass is an amorphous solid with near-zero molecular flow at room temperature. Historical thickness variations result from the crown glass spinning process.',
    category: 'Common Misconception',
    difficulty: 'Medium',
    domain: 'Science',
    targetEntity: 'Glass Liquid Flow Fallacy',
    keyClaims: [
      {
        id: 'c-80-1',
        claimText: 'Antique glass thickens at the bottom because it flows downward over centuries.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'Amorphous solid; thickness variation is an artifact of crown glass manufacturing.',
      },
    ],
  },
  {
    id: 'PARA-81',
    title: 'Mariana Trench Challenger Deep Extreme Bathymetry',
    simulatedQuery: 'What is the deepest point in the world ocean?',
    simulatedBot: 'Claude 3.5',
    paragraph:
      'The Challenger Deep in the southern end of the Mariana Trench is the deepest surveyed location on Earth, plunging to a maximum depth of approximately 10,928 to 10,994 metres below sea level. At this depth, the hydrostatic water pressure exceeds 1,000 atmospheres (over 100 megapascals).',
    expectedDecision: 'TRUST',
    mainReason:
      'Hydrographic sonar surveys and deep-sea submersible records (Trieste, Deepsea Challenger) confirm Challenger Deep depth ~10.9 km.',
    category: 'Clearly True',
    difficulty: 'Easy',
    domain: 'Geography',
    targetEntity: 'Challenger Deep Hydrostatic Bathymetry',
    keyClaims: [
      {
        id: 'c-81-1',
        claimText: 'The Challenger Deep reaches approximately 10.9 km below sea level with over 1,000 atmospheres of pressure.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Empirically surveyed depth and hydrostatic pressure calculation.',
      },
    ],
  },
  {
    id: 'PARA-82',
    title: 'Coriolis Effect on Domestic Sink Drain Whirlpool Myth',
    simulatedQuery: 'Does sink water drain clockwise in the Southern Hemisphere?',
    simulatedBot: 'Gemini 1.5 Pro',
    paragraph:
      'Due to the Coriolis effect caused by Earth rotation, water draining down domestic bathroom sinks and bathtubs consistently rotates counter-clockwise in the Northern Hemisphere and clockwise in the Southern Hemisphere.',
    expectedDecision: 'ABSTAIN',
    mainReason:
      'Fluid mechanics debunk: the Coriolis acceleration is several orders of magnitude too weak at household scale; drain swirl direction is dictated by bowl geometry and residual velocity.',
    category: 'Common Misconception',
    difficulty: 'Medium',
    domain: 'Science',
    targetEntity: 'Sink Drain Coriolis Whirlpool Myth',
    keyClaims: [
      {
        id: 'c-82-1',
        claimText: 'Domestic sinks drain in opposite directions in northern and southern hemispheres due to the Coriolis effect.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'Coriolis force is negligible at household scale; geometry dominates.',
      },
    ],
  },
  {
    id: 'PARA-83',
    title: 'Octopus Three Hearts and Blue Hemocyanin Blood Physiology',
    simulatedQuery: 'How many hearts does an octopus have and what color is its blood?',
    simulatedBot: 'Perplexity',
    paragraph:
      'Octopuses possess exactly three hearts: two branchial hearts pump blood through each of the two gills, while a third systemic heart pumps blood through the rest of the body. Their blood is distinctly blue because it utilizes copper-rich hemocyanin rather than iron-based hemoglobin for oxygen transport.',
    expectedDecision: 'TRUST',
    mainReason:
      'Marine invertebrate physiology: octopuses possess 3 hearts and copper-based hemocyanin blood.',
    category: 'Clearly True',
    difficulty: 'Easy',
    domain: 'Medicine/Biology',
    targetEntity: 'Octopus Hearts and Hemocyanin Blood',
    keyClaims: [
      {
        id: 'c-83-1',
        claimText: 'An octopus has three hearts and blue blood based on copper hemocyanin.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Anatomical and biochemical standard for cephalopods.',
      },
    ],
  },
  {
    id: 'PARA-84',
    title: 'Diamond Pure Elemental Carbon Crystal Lattice',
    simulatedQuery: 'What element is diamond made of?',
    simulatedBot: 'ChatGPT-4o',
    paragraph:
      'Diamond is a solid allotrope of pure carbon with its atoms arranged in a face-centered diamond cubic crystal lattice. Each carbon atom forms strong covalent sp3 bonds with four neighboring carbon atoms, giving diamond its extreme Mohs hardness of 10.',
    expectedDecision: 'TRUST',
    mainReason:
      'Mineralogy and solid-state chemistry: diamond is composed entirely of carbon in a tetrahedral lattice.',
    category: 'Clearly True',
    difficulty: 'Easy',
    domain: 'Science',
    targetEntity: 'Diamond Carbon Allotrope Structure',
    keyClaims: [
      {
        id: 'c-84-1',
        claimText: 'Diamond is an allotrope of pure carbon in a diamond cubic crystal lattice.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Established chemical crystallography.',
      },
    ],
  },
  {
    id: 'PARA-85',
    title: 'Penny Dropped from Skyscraper Penetration Fallacy',
    simulatedQuery: 'Can a penny dropped from the Empire State Building kill someone?',
    simulatedBot: 'Claude 3.5',
    paragraph:
      'Dropping a coin from the top of the Empire State Building causes it to accelerate continuously under gravity until it reaches several hundred miles per hour, generating enough kinetic energy to crack through a human skull and cause fatal injuries.',
    expectedDecision: 'ABSTAIN',
    mainReason:
      'Ballistic mechanics debunk: atmospheric air resistance caps a lightweight penny terminal velocity at ~40-50 km/h (~25-30 mph), imparting less than 1 Joule of energy.',
    category: 'Common Misconception',
    difficulty: 'Medium',
    domain: 'Science',
    targetEntity: 'Penny Dropped from Skyscraper Terminal Velocity',
    keyClaims: [
      {
        id: 'c-85-1',
        claimText: 'A penny dropped from a skyscraper accelerates to speeds that can penetrate a human skull.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'Air drag caps terminal velocity at ~45 km/h, harmless to bone.',
      },
    ],
  },
  {
    id: 'PARA-86',
    title: 'Human Adult Chromosome Count 46 Not 48',
    simulatedQuery: 'How many chromosomes do human cells contain?',
    simulatedBot: 'Gemini 1.5 Pro',
    paragraph:
      'Typical human somatic cells contain exactly 46 chromosomes organized into 23 homologous pairs: 22 pairs of autosomes and one pair of sex chromosomes (XX or XY). Chimpanzees and gorillas, by comparison, possess 48 chromosomes in 24 pairs.',
    expectedDecision: 'TRUST',
    mainReason:
      'Cytogenetics: human karyotype is 46 chromosomes (23 pairs); chromosome 2 arose from the telomeric fusion of two ancestral ape chromosomes.',
    category: 'Clearly True',
    difficulty: 'Easy',
    domain: 'Medicine/Biology',
    targetEntity: 'Human 46 Chromosome Karyotype',
    keyClaims: [
      {
        id: 'c-86-1',
        claimText: 'Human somatic cells contain 46 chromosomes in 23 pairs.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Established cytogenetic karyotype.',
      },
    ],
  },
  {
    id: 'PARA-87',
    title: 'Shaving Hair Regrowth Thickness and Density Fallacy',
    simulatedQuery: 'Does shaving make your beard or leg hair grow back thicker?',
    simulatedBot: 'Perplexity',
    paragraph:
      'Clinical dermatological studies prove that shaving cuts hair shafts at the surface, giving the short regrowth a blunt, sharp edge that feels coarse and looks visually darker. However, shaving does not affect the subcutaneous hair follicle, and it does not alter hair thickness, color, or biological growth rate.',
    expectedDecision: 'TRUST',
    mainReason:
      'Dermatological consensus: shaving does not affect follicle depth, melanogenesis, or hair shaft caliber.',
    category: 'Clearly True',
    difficulty: 'Easy',
    domain: 'Medicine/Biology',
    targetEntity: 'Shaving Hair Caliber Dermatology Fact',
    keyClaims: [
      {
        id: 'c-87-1',
        claimText: 'Shaving does not make hair grow back thicker, darker, or faster.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Dermatological consensus confirms follicle growth is unaffected by surface shaving.',
      },
    ],
  },
  {
    id: 'PARA-88',
    title: 'Venus Runaway Greenhouse Surface Heat Exceeding Mercury',
    simulatedQuery: 'Which planet in the Solar System is the hottest on its surface?',
    simulatedBot: 'ChatGPT-4o',
    paragraph:
      'Although Mercury is the closest planet to the Sun, Venus is the hottest planet in the Solar System. Venus maintains an average surface temperature of about 464 degrees Celsius (737 Kelvin) due to an intense runaway greenhouse effect driven by its dense carbon dioxide atmosphere and sulfuric acid clouds.',
    expectedDecision: 'TRUST',
    mainReason:
      'Planetary astrophysics: Venus 92-bar CO2 atmosphere produces extreme runaway greenhouse heating hotter than Mercury daylight peak.',
    category: 'Clearly True',
    difficulty: 'Medium',
    domain: 'Astronomy',
    targetEntity: 'Venus Runaway Greenhouse Peak Heat',
    keyClaims: [
      {
        id: 'c-88-1',
        claimText: 'Venus is the hottest planet in the Solar System (~464°C), hotter than Mercury.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Planetary science consensus based on Magellan and Venera measurements.',
      },
    ],
  },
  {
    id: 'PARA-89',
    title: 'Chewing Gum Seven Year Digestion Myth Claim',
    simulatedQuery: 'Does chewing gum stay in your stomach for seven years if you swallow it?',
    simulatedBot: 'Claude 3.5',
    paragraph:
      'Because synthetic gum resin and butyl rubber cannot be broken down by gastric acid, swallowed chewing gum adheres to the lining of the stomach and remains lodged in the human digestive system for roughly seven years before being absorbed.',
    expectedDecision: 'ABSTAIN',
    mainReason:
      'Gastroenterology debunk: while gum base is insoluble, intestinal peristalsis propels swallowed gum through the digestive tract within 24 to 72 hours alongside dietary fiber.',
    category: 'Common Misconception',
    difficulty: 'Easy',
    domain: 'Medicine/Biology',
    targetEntity: 'Swallowed Gum Seven Year Myth',
    keyClaims: [
      {
        id: 'c-89-1',
        claimText: 'Swallowed chewing gum stays in the human stomach for seven years.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'Gastrointestinal peristalsis clears gum normally within 2-3 days.',
      },
    ],
  },
  {
    id: 'PARA-90',
    title: 'Sugar Hyperactivity Pediatric Controlled Trial Findings',
    simulatedQuery: 'Does sugar cause hyperactivity in children?',
    simulatedBot: 'Gemini 1.5 Pro',
    paragraph:
      'Extensive double-blind, placebo-controlled clinical trials published in the New England Journal of Medicine and JAMA have repeatedly shown that sugar consumption does not cause hyperactivity or ADHD symptoms in children. The perceived correlation is driven by parental expectation bias and energetic party environments.',
    expectedDecision: 'TRUST',
    mainReason:
      'Pediatric double-blind trials consistently demonstrate sugar has no adverse effect on children behavior or attention spans.',
    category: 'Clearly True',
    difficulty: 'Medium',
    domain: 'Medicine/Biology',
    targetEntity: 'Sugar Pediatric Hyperactivity Trial Consensus',
    keyClaims: [
      {
        id: 'c-90-1',
        claimText: 'Double-blind trials show sugar does not cause hyperactivity in children.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'JAMA and NEJM meta-analyses confirm no causal link.',
      },
    ],
  },
  {
    id: 'PARA-91',
    title: 'Avogadro Constant Exact SI 2019 Definition',
    simulatedQuery: 'What is Avogadro number in the modern metric system?',
    simulatedBot: 'Perplexity',
    paragraph:
      'Following the 2019 revision of the International System of Units (SI), Avogadro constant N_A is defined as an exact numerical value: 6.02214076 x 10^23 reciprocal moles. One mole of any substance contains exactly this number of elementary entities.',
    expectedDecision: 'TRUST',
    mainReason:
      'BIPM SI definition: Avogadro constant is fixed exactly at 6.02214076 x 10^23 mol^-1 without measurement uncertainty.',
    category: 'Clearly True',
    difficulty: 'Easy',
    domain: 'Science',
    targetEntity: 'Avogadro Constant Exact SI Definition',
    keyClaims: [
      {
        id: 'c-91-1',
        claimText: 'Avogadro constant is defined exactly as 6.02214076 x 10^23 mol^-1.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Codified by the 26th General Conference on Weights and Measures.',
      },
    ],
  },
  {
    id: 'PARA-92',
    title: 'Rust Direct Causation of Tetanus Pathogen Distinction',
    simulatedQuery: 'Does stepping on a rusty nail give you tetanus because of the rust?',
    simulatedBot: 'ChatGPT-4o',
    paragraph:
      'Chemical rust (hydrated iron oxide) directly secretes the lethal neurotoxin tetanospasmin when in contact with open human wounds, making rust the primary chemical cause of tetanus infections.',
    expectedDecision: 'ABSTAIN',
    mainReason:
      'Microbiological error: tetanus is caused by endospores of Clostridium tetani, an anaerobic bacterium common in animal feces and soil. Rust is chemically inert Fe2O3 and does not cause tetanus.',
    category: 'Common Misconception',
    difficulty: 'Medium',
    domain: 'Medicine/Biology',
    targetEntity: 'Rust Tetanus Bacterial Distinction',
    keyClaims: [
      {
        id: 'c-92-1',
        claimText: 'Rust chemically secretes tetanospasmin and directly causes tetanus infections.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'Tetanus is caused by Clostridium tetani bacteria, not chemical rust.',
      },
    ],
  },
  {
    id: 'PARA-93',
    title: 'Bats Complete Blindness Misconception Disproven',
    simulatedQuery: 'Are bats completely blind animals?',
    simulatedBot: 'Claude 3.5',
    paragraph:
      'Because they evolved sophisticated ultrasonic echolocation to hunt night insects in complete darkness, all bat species have experienced evolutionary atrophy of their ocular photoreceptors, leaving them totally blind.',
    expectedDecision: 'ABSTAIN',
    mainReason:
      'Zoological error: no known bat species is blind. Microbats use vision alongside echolocation, and megabats (fruit bats) possess large, sensitive eyes with excellent photopic and scotopic acuity.',
    category: 'Common Misconception',
    difficulty: 'Easy',
    domain: 'Medicine/Biology',
    targetEntity: 'Blind as a Bat Fallacy',
    keyClaims: [
      {
        id: 'c-93-1',
        claimText: 'All bat species have experienced ocular atrophy and are totally blind.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'Bats are not blind; fruit bats rely heavily on vision.',
      },
    ],
  },
  {
    id: 'PARA-94',
    title: 'Mariana Trench Hydrothermal Vents and Extremophile Life',
    simulatedQuery: 'Can complex life survive in the Mariana Trench?',
    simulatedBot: 'Gemini 1.5 Pro',
    paragraph:
      'Deep-sea submersibles have documented that the Mariana Trench supports thriving chemosynthetic ecosystems. Specialized extremophiles including amphipods, xenophyophores, and snailfish thrive at depths exceeding 8,000 metres by relying on chemosynthesis and piezolyte osmolytes to stabilize cellular proteins against immense pressure.',
    expectedDecision: 'TRUST',
    mainReason:
      'Abyssal marine biology: hadal snailfish and barophilic organisms thrive in the Mariana Trench through trimethylamine N-oxide (TMAO) piezolyte cellular adaptation.',
    category: 'Clearly True',
    difficulty: 'Medium',
    domain: 'Medicine/Biology',
    targetEntity: 'Hadal Extremophile Marine Biology',
    keyClaims: [
      {
        id: 'c-94-1',
        claimText: 'Complex marine life including snailfish and amphipods survives in the Mariana Trench.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Empirically filmed and sampled by deep-sea research missions.',
      },
    ],
  },
  {
    id: 'PARA-95',
    title: 'Earth Atmosphere Nitrogen and Oxygen Exact Dry Fractions',
    simulatedQuery: 'What percentage of air is nitrogen and oxygen?',
    simulatedBot: 'Perplexity',
    paragraph:
      'Dry atmospheric air at standard temperature and pressure contains approximately 78.08 percent molecular nitrogen (N2) and 20.95 percent molecular oxygen (O2) by volume. Together with argon (~0.93%), these three gases account for more than 99.96 percent of dry atmosphere.',
    expectedDecision: 'TRUST',
    mainReason:
      'Atmospheric physics and chemistry: nitrogen and oxygen comprise ~99% of dry air volume.',
    category: 'Clearly True',
    difficulty: 'Easy',
    domain: 'Science',
    targetEntity: 'Atmospheric Gas Composition Standard',
    keyClaims: [
      {
        id: 'c-95-1',
        claimText: 'Nitrogen and oxygen account for over 99 percent of dry air volume.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Codified in international standard atmosphere models.',
      },
    ],
  },
  {
    id: 'PARA-96',
    title: 'Bull Matador Red Cloth Color Blindness Physiology',
    simulatedQuery: 'Why do bulls charge at red capes in bullfighting?',
    simulatedBot: 'ChatGPT-4o',
    paragraph:
      'Bulls charge at the matador cape solely because cattle have specialized retinal cones tuned to crimson red, which stimulates uncontrollable aggressive neurochemical responses in their central nervous system.',
    expectedDecision: 'ABSTAIN',
    mainReason:
      'Veterinary ophthalmology debunk: cattle are dichromats lacking red-sensitive retinal cones (red-green color blind). Bulls charge at the rapid waving motion of the muleta, not its color.',
    category: 'Common Misconception',
    difficulty: 'Easy',
    domain: 'Medicine/Biology',
    targetEntity: 'Bull Red Color Blindness Physiology',
    keyClaims: [
      {
        id: 'c-96-1',
        claimText: 'Bulls charge because crimson red stimulates aggressive neural responses.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'Cattle cannot perceive red; they react to movement and agitation.',
      },
    ],
  },
  {
    id: 'PARA-97',
    title: 'Cracking Knuckles Synovial Cavitation and Arthritis Absence',
    simulatedQuery: 'Does cracking your knuckles cause arthritis?',
    simulatedBot: 'Claude 3.5',
    paragraph:
      'The popping sound produced when cracking knuckles is caused by rapid cavitation, where negative pressure causes dissolved gas bubbles in synovial fluid to suddenly collapse. Multiple long-term radiological studies, as well as a famous 60-year experiment where a physician cracked only his left hand daily, show zero statistical increase in osteoarthritis.',
    expectedDecision: 'TRUST',
    mainReason:
      'Rheumatology consensus: synovial cavitation bubble collapse causes joint popping without inducing articular cartilage damage or osteoarthritis.',
    category: 'Clearly True',
    difficulty: 'Medium',
    domain: 'Medicine/Biology',
    targetEntity: 'Knuckle Cracking Synovial Cavitation Research',
    keyClaims: [
      {
        id: 'c-97-1',
        claimText: 'Knuckle cracking results from synovial gas cavitation and does not cause arthritis.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Radiological imaging and longitudinal clinical evidence confirm no arthritis link.',
      },
    ],
  },
  {
    id: 'PARA-98',
    title: 'Earth Orbit Elliptical Perihelion and Aphelion Orbital Mechanics',
    simulatedQuery: 'Is Earth closer to the Sun in summer than in winter?',
    simulatedBot: 'Gemini 1.5 Pro',
    paragraph:
      'Earth planetary orbit is not a circle but an ellipse with an eccentricity of ~0.0167. Earth reaches perihelion (closest distance to the Sun, ~147.1 million km) in early January during the Northern Hemisphere winter, and aphelion (~152.1 million km) in early July, demonstrating that seasonal temperature changes are caused by axial tilt (23.5°), not orbital distance.',
    expectedDecision: 'TRUST',
    mainReason:
      'Keplerian orbital mechanics: Earth is closest to the Sun in January (perihelion); seasons are governed by 23.5° axial tilt.',
    category: 'Clearly True',
    difficulty: 'Medium',
    domain: 'Astronomy',
    targetEntity: 'Earth Perihelion and Axial Tilt Seasonality',
    keyClaims: [
      {
        id: 'c-98-1',
        claimText: 'Earth is closest to the Sun in January (perihelion) and farthest in July (aphelion).',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Keplerian orbital parameters confirmed by astronomical ephemerides.',
      },
      {
        id: 'c-98-2',
        claimText: 'Seasons are caused by Earth 23.5 degree axial tilt, not distance from the Sun.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Solar insolation angle governs seasonal temperatures.',
      },
    ],
  },
  {
    id: 'PARA-99',
    title: 'Commercial Nuclear Fusion Net Grid Electricity Output Myth',
    simulatedQuery: 'How much of France electricity comes from nuclear fusion?',
    simulatedBot: 'Perplexity',
    paragraph:
      'France leads global clean energy with over 35 percent of its commercial electrical grid supplied directly by operational thermonuclear fusion reactors in Cadarache.',
    expectedDecision: 'ABSTAIN',
    mainReason:
      'Technological error: nuclear fusion is still experimental (ITER is under construction in Cadarache and has not achieved steady-state electrical generation). All current commercial nuclear power comes from nuclear fission.',
    category: 'Clearly False',
    difficulty: 'Easy',
    domain: 'Technology',
    targetEntity: 'Commercial Fusion Grid Electricity Myth',
    keyClaims: [
      {
        id: 'c-99-1',
        claimText: 'Over 35 percent of France electrical grid comes from commercial thermonuclear fusion reactors.',
        expectedDecision: 'ABSTAIN',
        isFactuallyAccurate: false,
        explanation: 'Zero commercial fusion power exists on any grid today; all is nuclear fission.',
      },
    ],
  },
  {
    id: 'PARA-100',
    title: 'General Relativity GPS Daily Relativistic Time Dilation Offset',
    simulatedQuery: 'Why do GPS satellites need to account for Einstein theory of relativity?',
    simulatedBot: 'ChatGPT-4o',
    paragraph:
      'Atomic clocks on GPS satellites orbit Earth at ~14,000 km/h at an altitude of ~20,200 kilometres. Special relativity causes their high speed to tick slower by ~7 microseconds per day, while General Relativity causes weaker gravity to tick faster by ~45 microseconds per day. Without adjusting for the net +38 microsecond daily gain, GPS positioning would accumulate errors of over 10 kilometres every single day.',
    expectedDecision: 'TRUST',
    mainReason:
      'Relativistic physics: net +38 microsecond/day time dilation must be pre-adjusted in satellite atomic clock frequencies to maintain meter-level navigation.',
    category: 'Clearly True',
    difficulty: 'Hard',
    domain: 'Science',
    targetEntity: 'GPS Relativistic Time Dilation Net Gain',
    keyClaims: [
      {
        id: 'c-100-1',
        claimText: 'GPS satellite clocks experience a net relativistic gain of approximately +38 microseconds per day.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Confirmed by Ashby et al. relativistic GPS operational equations.',
      },
      {
        id: 'c-100-2',
        claimText: 'Uncorrected relativistic dilation would cause GPS errors to drift by over 10 kilometres daily.',
        expectedDecision: 'TRUST',
        isFactuallyAccurate: true,
        explanation: 'Calculated as 38 microseconds multiplied by the speed of light (~11.4 km drift).',
      },
    ],
  },
];
