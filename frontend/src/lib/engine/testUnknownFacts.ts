import { executeTracevidencePipeline } from './pipelineOrchestrator';

interface FactTestItem {
  id: number;
  statement: string;
  category: string;
  realWorldVerdict: 'TRUE' | 'FALSE' | 'NEEDS_VERIFY';
  explanation: string;
}

const FACTS_TO_TEST: FactTestItem[] = [
  {
    id: 1,
    statement: 'The Great Wall of China is visible from the Moon with the naked eye',
    category: 'Popular Myth / Space',
    realWorldVerdict: 'FALSE',
    explanation: 'Debunked by NASA and astronauts; the wall is only a few meters wide and blends with the soil, completely invisible from lunar distance without optical aids.',
  },
  {
    id: 2,
    statement: 'Octopuses have three hearts and blue blood',
    category: 'Zoology / Marine Biology',
    realWorldVerdict: 'TRUE',
    explanation: 'Octopuses possess two branchial hearts to pump blood through gills and one systemic heart for the body. Blood is blue because it uses copper-based hemocyanin.',
  },
  {
    id: 3,
    statement: 'Humans typically have 46 chromosomes organized in 23 pairs',
    category: 'Genetics / Biology',
    realWorldVerdict: 'TRUE',
    explanation: 'Standard human somatic cells contain 23 pairs of homologous chromosomes (total 46).',
  },
  {
    id: 4,
    statement: 'Diamond is composed of pure elemental carbon in a crystal lattice',
    category: 'Chemistry / Materials',
    realWorldVerdict: 'TRUE',
    explanation: 'Diamond is an allotrope of pure carbon where atoms are arranged in a diamond cubic crystal lattice.',
  },
  {
    id: 5,
    statement: 'Lightning never strikes the same place twice',
    category: 'Atmospheric Physics / Myth',
    realWorldVerdict: 'FALSE',
    explanation: 'Lightning frequently strikes the same location; tall buildings like the Empire State Building are struck dozens of times annually.',
  },
  {
    id: 6,
    statement: 'Humans only use 10% of their brains',
    category: 'Neuroscience / Myth',
    realWorldVerdict: 'FALSE',
    explanation: 'Functional neuroimaging (fMRI/PET) proves almost 100% of the brain is active across normal daily tasks.',
  },
  {
    id: 7,
    statement: 'Light travels faster than sound in Earth atmosphere',
    category: 'Physics',
    realWorldVerdict: 'TRUE',
    explanation: 'Light speed is ~300,000 km/s while sound speed in air is only ~343 m/s (~1 million times slower).',
  },
  {
    id: 8,
    statement: 'Pure water boils at 100 degrees Celsius at standard sea-level atmospheric pressure',
    category: 'Thermodynamics',
    realWorldVerdict: 'TRUE',
    explanation: 'At 1 atm (101.325 kPa), the thermodynamic boiling point of pure water is precisely 100°C.',
  },
  {
    id: 9,
    statement: 'The Sun is classified as a G-type main-sequence star',
    category: 'Astrophysics',
    realWorldVerdict: 'TRUE',
    explanation: 'The Sun is a G2V star, commonly called a yellow dwarf, at the center of the solar system.',
  },
  {
    id: 10,
    statement: 'Mount Everest is the highest mountain above sea level on Earth',
    category: 'Geology / Geography',
    realWorldVerdict: 'TRUE',
    explanation: 'Mount Everest reaches 8,848.86 meters above sea level, highest on Earth.',
  },
  {
    id: 11,
    statement: 'Royal Bengal Tiger is the official National Animal of India',
    category: 'National Emblems',
    realWorldVerdict: 'TRUE',
    explanation: 'Adopted in May 1973 replacing the lion, Panthera tigris tigris is India\'s official National Animal.',
  },
  {
    id: 12,
    statement: 'Human deoxygenated blood in veins is bright blue inside the human body',
    category: 'Human Physiology / Myth',
    realWorldVerdict: 'FALSE',
    explanation: 'Human blood is always red. Deoxygenated blood is dark red/maroon; veins appear blue only due to subcutaneous light scattering through skin.',
  },
  {
    id: 13,
    statement: 'Producing a 75 kWh EV battery emits 20 tonnes of CO2 requiring 50000 km to break even',
    category: 'Climate & Energy / Echo Chamber',
    realWorldVerdict: 'NEEDS_VERIFY',
    explanation: 'Based on a single superseded 2017 IVL Swedish report that was syndicated across hundreds of blogs. 2024 grid greening and modern battery chemistry show much lower emissions.',
  },
  {
    id: 14,
    statement: 'Hydroxychloroquine eliminates COVID-19 with 100% cure rate in clinical trials',
    category: 'Clinical Medicine / Refuted',
    realWorldVerdict: 'FALSE',
    explanation: 'Rigorous multi-center randomized trials (RECOVERY, WHO Solidarity) found no therapeutic benefit and flagged cardiac arrhythmia risks.',
  },
  {
    id: 15,
    statement: 'Bananas are naturally slightly radioactive because they contain Potassium-40',
    category: 'Nuclear Physics / Everyday Science',
    realWorldVerdict: 'TRUE',
    explanation: 'Bananas are rich in potassium, of which ~0.012% is the naturally occurring radioactive isotope Potassium-40 (K-40).',
  },
  {
    id: 16,
    statement: 'Gold element is represented by chemical symbol Au on the periodic table',
    category: 'Chemistry',
    realWorldVerdict: 'TRUE',
    explanation: 'Gold\'s atomic symbol is Au, derived from the Latin word "aurum" meaning shining dawn.',
  },
];

async function runBatchTests() {
  console.log('========================================================================');
  console.log('  TRACEVIDENCE MULTI-DOMAIN BATCH AUDIT: 16 FACTS TEST SUITE');
  console.log('========================================================================\n');

  const report: any[] = [];

  for (const item of FACTS_TO_TEST) {
    const startTime = Date.now();
    try {
      const result = await executeTracevidencePipeline(item.statement, { mode: 'live' });
      const claim = result.claims[0];
      const elapsed = Date.now() - startTime;

      report.push({
        id: item.id,
        statement: item.statement,
        category: item.category,
        realWorldVerdict: item.realWorldVerdict,
        realWorldExplanation: item.explanation,
        systemDecision: claim ? claim.decision : 'ABSTAIN',
        confidence: claim ? Math.round(claim.confidence * 100) : 0,
        contradictionDetected: claim?.contradictionDetected || false,
        systemReason: claim?.decisionReason || 'N/A',
        retrievedSources: result.sources.length,
        elapsedMs: elapsed,
      });

      console.log(`[#${item.id}] "${item.statement.slice(0, 50)}..."`);
      console.log(`  -> Real Ground Truth: ${item.realWorldVerdict}`);
      console.log(`  -> System Verdict:   ${claim ? claim.decision : 'ABSTAIN'} (${claim ? Math.round(claim.confidence * 100) : 0}%)`);
      console.log(`  -> Contradiction:    ${claim?.contradictionDetected ? 'YES' : 'NO'}`);
      console.log(`  -> Reason:           ${claim?.decisionReason?.slice(0, 100)}...`);
      console.log(`  -> Sources Retrieved: ${result.sources.length}\n`);
    } catch (err: any) {
      console.error(`Error on item ${item.id}:`, err.message);
    }
  }

  console.log('========================================================================');
  console.log('  BATCH EVALUATION COMPLETED');
  console.log('========================================================================');
}

runBatchTests();
