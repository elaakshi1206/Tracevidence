import json
import os

TARGET_FILE = os.path.abspath(r"c:\Users\Asus\Desktop\PROJECT\frontend\src\lib\benchmarks\rareCombinationCasesData.ts")

NEW_70_DOMAINS = [
    ("Deep Paleoclimatology & Ice Core Proxies", [
        ("The EPICA Dome C ice core in Antarctica drilled 3,270 meters into the ice sheet, providing a continuous atmospheric record spanning 800,000 years through eight glacial cycles.",
         "TRUST", "Clearly True", "Hard", "EPICA Dome C 800k Year Ice Core",
         "Published in Nature 2004, EPICA Dome C ice core preserves trapped air bubbles showing CO2 and CH4 closely tracked temperature over 8 glacial-interglacial cycles."),
        ("During the Paleocene-Eocene Thermal Maximum (PETM) 56 million years ago, global temperatures spiked by 5 to 8 °C within 20,000 years due to massive carbon injection into the oceans.",
         "TRUST", "Clearly True", "Hard", "PETM Hyperthermal Event Carbon Spikes",
         "Deep-sea sediment cores show profound negative carbon isotope excursions (CIE) and catastrophic carbonate dissolution caused by rapid ocean acidification during the PETM."),
        ("Oxygen-18 to Oxygen-16 isotope ratios (delta 18O) in benthic foraminifera shells serve as paleothermometers because lighter Oxygen-16 is preferentially trapped in continental ice sheets during glacials.",
         "TRUST", "Clearly True", "Hard", "Foraminifera Delta 18O Paleothermometer",
         "Rayleigh fractionation causes H2(16O) to evaporate preferentially and freeze in polar ice sheets, leaving ocean water and marine calcifying organisms enriched in heavier 18O."),
        ("The Dansgaard-Oeschger events were abrupt warming episodes during the last glacial period where Greenland surface temperatures surged by up to 10 °C in less than 50 years.",
         "TRUST", "Sounds False But True", "Hard", "Dansgaard-Oeschger Abrupt Warming Greenland",
         "Greenland ice cores (GRIP, GISP2, NGRIP) record 25 D-O cycles characterized by rapid decadal-scale warming followed by gradual cooling linked to AMOC mode shifts."),
        ("Snowball Earth glaciations during the Sturtian and Marinoan epochs were terminated because thick global ice sheets completely shut down silicate weathering while volcanic CO2 accumulated in the atmosphere.",
         "TRUST", "Clearly True", "Hard", "Snowball Earth Silicate Weathering Deglaciation",
         "Without liquid oceans and rainfall, the Urey reaction (silicate rock weathering) ceased, allowing volcanic outgassing to build atmospheric CO2 up to ~0.1 bar, driving extreme greenhouse deglaciation."),
        ("Tree rings from 536 CE indicate a cataclysmic dust veil caused a global volcanic winter where the Sun shone no brighter than the Moon for 18 months, triggering famine and the Justinian Plague.",
         "TRUST", "Clearly True", "Hard", "536 CE Volcanic Winter Dust Veil",
         "Ice cores and tree rings identify an extreme sulfate spike in 536 CE from an unknown high-latitude volcano followed by an Ilopango eruption in 540 CE, ushering in the Late Antique Little Ice Age."),
        ("Milankovitch orbital cycles dictate that Earth's ice age glacial pulses are primarily driven by the 100,000-year cycle of orbital eccentricity, which changes total annual solar irradiance by over 40 percent.",
         "ABSTAIN", "Numerical Error", "Hard", "Milankovitch Eccentricity Irradiance Variation",
         "Eccentricity variations (from 0.0005 to 0.06) modulate total annual global solar insolation by only ~0.1% to 0.2%, acting as a pacemaker through non-linear ice-albedo and carbon cycle feedbacks, not a 40% swing."),
        ("The 'Bond events' are quasi-periodic North Atlantic climate cycles occurring every 1,470 years, documented by ice-rafted debris layers in deep ocean sediment cores.",
         "TRUST", "Clearly True", "Hard", "Bond Events Ice-Rafted Debris Cycles",
         "Gerard Bond identified cyclical pulses of hematite-stained grains in North Atlantic sediments reflecting ice-sheet calving events occurring roughly every 1,500 years."),
        ("The Vostok ice core in Antarctica revealed that prehistoric atmospheric CO2 concentrations over the past 400,000 years never exceeded 300 parts per million prior to the Industrial Revolution.",
         "TRUST", "Clearly True", "Medium", "Vostok Ice Core Pre-Industrial CO2 Cap",
         "Petit et al. (Nature 1999) demonstrated natural glacial-interglacial atmospheric CO2 fluctuated between ~180 ppm during glacial maxima and ~280-300 ppm during warm interglacials."),
        ("Beryllium-10 cosmogenic radionuclide concentrations in polar ice cores directly correlate with past sunspot activity, because strong solar magnetic fields deflect galactic cosmic rays away from Earth.",
         "TRUST", "Clearly True", "Hard", "Cosmogenic Beryllium-10 Solar Activity Proxy",
         "Galactic cosmic rays spall nitrogen and oxygen to produce 10Be; higher solar magnetic wind activity shields Earth, depressing cosmogenic isotope production in ice cores.")
    ]),
    ("Extreme Cryobiology, Suspended Animation & Anhydrobiosis", [
        ("The wood frog (Rana sylvatica) can survive having up to 65 percent of its total body water frozen solid into ice for weeks during winter, using high concentrations of glucose as a cryoprotectant.",
         "TRUST", "Clearly True", "Medium", "Wood Frog Cryoprotectant Glucose Freezing",
         "Upon freezing of extremities, the wood frog liver triggers massive glycogenolysis, dumping up to 300 mM glucose into blood and tissues to prevent intracellular freezing and cell lysis."),
        ("Cryonics facilities preserve legally deceased humans by cooling them directly in liquid nitrogen at -196 °C, causing cell membranes to shatter as water expands by 9 percent upon ice crystal formation.",
         "ABSTAIN", "Common Misconception", "Hard", "Cryonics Vitrification vs Direct Freezing",
         "Modern cryopreservation protocols use chemical cryoprotectants and vitrification (glass transition) to solidify tissue without ice crystal formation, not direct unbuffered freezing."),
        ("Rotifers revived from Siberian permafrost after being frozen in cryptobiosis for 24,000 years were able to reproduce via parthenogenesis upon thawing in the laboratory.",
         "TRUST", "Sounds False But True", "Hard", "Bdelloid Rotifer 24000 Year Permafrost Revival",
         "Shmakova et al. (Current Biology 2021) isolated and cultured viable bdelloid rotifers from 24,000-year-old Arctic permafrost cores."),
        ("Trehalose is a non-reducing disaccharide that protects proteins and cellular membranes from denaturation during extreme desiccation by forming an amorphous biological glass matrix.",
         "TRUST", "Clearly True", "Hard", "Trehalose Anhydrobiosis Vitrification",
         "Organisms like Artemia salina cysts and tardigrades accumulate high trehalose concentrations that replace water hydrogen bonds, stabilizing membranes in anhydrobiotic states."),
        ("Human organs like livers and hearts can be cryopreserved indefinitely at -80 °C using standard medical freezers and successfully re-transplanted into patients with zero tissue damage.",
         "ABSTAIN", "Clearly False", "Easy", "Human Organ Cryopreservation Clinical Limits",
         "Solid vascularized human organs cannot yet be routinely cryopreserved; ice nucleation, thermal fracturing, and cryoprotectant toxicity currently destroy large organs during cooling and rewarming."),
        ("The Antarctic nematode Panagrolaimus davidi is the only known organism that can survive extensive intracellular ice crystallization inside all its body tissues.",
         "TRUST", "Sounds False But True", "Hard", "Panagrolaimus Davidi Intracellular Freezing",
         "Wharton and Ferns demonstrated P. davidi survives ice formation inside active cells, using ice-active proteins to regulate crystal size and protect subcellular structures."),
        ("Arctic woolly bear caterpillars (Gynaephora groenlandica) endure up to 14 consecutive winters at temperatures below -60 °C, synthesizing glycerol and accumulating heat in spring via dark melanic setae.",
         "TRUST", "Clearly True", "Medium", "Woolly Bear Caterpillar Glycerol Cryoprotectant",
         "Taking up to 7-14 years to mature, G. groenlandica degrades mitochondria in autumn, synthesizes glycerol, and sun-basks with black hairs to optimize summer feeding."),
        ("Antifreeze glycoproteins (AFGPs) in Antarctic notothenioid fish prevent freezing not by lowering the melting point, but by adsorbing to ice crystal faces to halt crystal growth via the Kelvin effect.",
         "TRUST", "Clearly True", "Hard", "Antifreeze Glycoproteins Non-Colligative Hysteresis",
         "AFGPs induce thermal hysteresis: they bind to embryonic ice crystals, forcing growth into high-curvature convex fronts that stop growing at ambient seawater temperatures (-1.9 °C)."),
        ("Ice-minus bacteria (Pseudomonas syringae) were engineered by deleting the inaZ gene to prevent frost formation on agricultural crops down to -5 °C.",
         "TRUST", "Clearly True", "Medium", "Ice-Minus Bacteria InaZ Deletion",
         "Steven Lindow engineered ice-minus P. syringae lacking the outer membrane ice-nucleating protein, creating the first genetically modified organism released into the environment in 1987."),
        ("Frozen mammoths discovered in Siberian permafrost have intact viable sperm cells that have been successfully used to fertilize domestic Asian elephant egg cells in Tokyo.",
         "ABSTAIN", "Echo Chamber", "Medium", "Mammoth Permafrost Viable Sperm Myth",
         "Permafrost freeze-thaw cycles over 20,000 years and natural background radiation heavily fragment mammoth DNA into small segments; zero viable cells or sperm have ever been retrieved.")
    ]),
    ("Espionage, Steganography & Cold War Declassifications", [
        ("Project Azorian was a covert CIA operation in 1974 that built the Hughes Glomar Explorer ship under the cover of seabed mining to secretly recover the sunken Soviet nuclear submarine K-129.",
         "TRUST", "Clearly True", "Medium", "Project Azorian Hughes Glomar Explorer",
         "Using Howard Hughes as a billionaire cover story, the CIA deployed a massive mechanical claw to recover portions of K-129 from 5,000 meters depth in the Pacific Ocean."),
        ("During the Cold War, the Soviet Union bugged the Great Seal of the United States in the US Ambassador's Moscow residence with 'The Thing', a passive cavity resonator microphone with no battery or wires.",
         "TRUST", "Clearly True", "Hard", "The Thing Great Seal Passive Resonator",
         "Designed by Léon Theremin, the covert audio bug was energized remotely by an external radio frequency beam, operating undetected for seven years from 1945 to 1952."),
        ("Operation Mincemeat in 1943 successfully deceived the German High Command by planting fake military invasion plans on a corpse dressed as a Royal Marine captain launched from a British submarine.",
         "TRUST", "Clearly True", "Medium", "Operation Mincemeat WW2 Sicily Deception",
         "British intelligence placed letters on Glyndwr Michael's body off Huelva, Spain, convincing Hitler the Allies would invade Greece and Sardinia rather than Sicily."),
        ("The Venona project was a top-secret US counterintelligence program that decrypted thousands of Soviet diplomatic telegrams encrypted using compromised one-time pads that had been reused.",
         "TRUST", "Clearly True", "Hard", "Venona Project One-Time Pad Decryption",
         "Soviet manufacturing rushed duplicate one-time pad pages during WWII; Arlington Hall cryptanalysts exploited key reuse to expose the Cambridge Spy Ring and Rosenberg espionage."),
        ("Acoustic Kitty was a CIA Cold War program that surgically implanted microphones, batteries, and antenna wires into domestic cats to eavesdrop on Soviet embassy conversations.",
         "TRUST", "Clearly True", "Medium", "Acoustic Kitty CIA Surgical Program",
         "Declassified in 2001, CIA Project Acoustic Kitty trained cats with implanted wire transmitters, but was abandoned in 1967 due to uncontrollable animal behavioral distractions."),
        ("During World War II, the British SOE disguised plastic explosive charges as dead rats, which German boiler stokers shoveled into factory furnaces, detonating the boilers.",
         "TRUST", "Sounds False But True", "Medium", "WW2 Explosive Rat Boiler Sabotage",
         "British SOE procured 100 dead sewer rats, stuffed them with plastic explosive, and smuggled them to France; their discovery caused the Germans to obsessively inspect coal supplies."),
        ("The Zimmermann Telegram in 1917, which proposed a military alliance between Germany and Mexico against the US, was intercepted and decrypted by the American NSA inside the White House.",
         "ABSTAIN", "Common Misconception", "Hard", "Zimmermann Telegram Interception Room 40",
         "The telegram was intercepted and decrypted by British Naval Intelligence (Room 40), not the American NSA (which was not founded until 1952)."),
        ("Project Pigeon was a World War II guidance system developed by behavioral psychologist B.F. Skinner that trained pigeons inside missile nosecones to peck at ship images to steer gliders.",
         "TRUST", "Sounds False But True", "Medium", "BF Skinner Project Pigeon Missile Guidance",
         "Skinner utilized operant conditioning to train pigeons to peck an optical lens display, generating pneumatic error signals to steer the Pelican glide bomb before project cancellation."),
        ("The CIA's Operation Chaos was an international operation that parachuted radioactive isotopic sensors into the Gobi Desert to measure Chinese nuclear tests.",
         "ABSTAIN", "Historical Misattribution", "Hard", "Operation Chaos Domestic Surveillance",
         "Operation CHAOS was an illegal CIA domestic surveillance program targeting American anti-war activists; Himalayan isotopic sensor planting was Project HAT / Nanda Devi."),
        ("The 'Buran' space shuttle was identical in every aerodynamic dimension to the US Space Shuttle because Soviet intelligence obtained 100% complete blueprints through hacked NASA databases.",
         "ABSTAIN", "Common Misconception", "Hard", "Soviet Buran Shuttle Development",
         "Soviet engineers acquired unclassified NASA reports and wind-tunnel data via espionage, but the Buran featured completely different propulsion (Energia rocket, no onboard main engines) and flew fully autonomously.")
    ]),
    ("Astrometric Anomalies & Trans-Neptunian Dynamics", [
        ("The hypothetical 'Planet Nine' is postulated based on the statistically clustered orbital arguments of perihelion and inclinations of extreme trans-Neptunian objects (eTNOs).",
         "TRUST", "Clearly True", "Hard", "Planet Nine Orbital Clustering ETNOs",
         "Batygin and Brown (2016) demonstrated that distant Kuiper Belt objects with semi-major axes > 250 AU exhibit aligned perihelia consistent with gravitational perturbation by an unseen 5-10 Earth-mass planet."),
        ("Oumuamua (1I/2017 U1) was the first confirmed interstellar object detected passing through our Solar System, exhibiting non-gravitational acceleration consistent with outgassing or a solar sail.",
         "TRUST", "Clearly True", "Medium", "Oumuamua Interstellar Non-Gravitational Acceleration",
         "Discovered by Pan-STARRS in 2017 on an unbound hyperbolic orbit (e=1.2), Oumuamua accelerated away from the Sun; theories suggest hydrogen ice outgassing (Bergner & Seligman) or radiation pressure."),
        ("Pluto and Neptune orbit in a stable 3:2 mean-motion resonance where Pluto completes exactly two orbits around the Sun for every three orbits Neptune completes.",
         "TRUST", "Clearly True", "Medium", "Pluto Neptune 3-to-2 Orbital Resonance",
         "Due to the 3:2 resonance and orbital inclination of 17°, Pluto and Neptune never collide or approach each other closely despite Pluto's perihelion crossing inside Neptune's orbital distance."),
        ("Comet Borisov (2I/Borisov) was an interstellar comet discovered in 2019 that showed volatile chemical composition and carbon monoxide (CO) abundance indistinguishable from pristine Oort cloud comets.",
         "TRUST", "Clearly True", "Hard", "2I Borisov Interstellar Comet Spectroscopy",
         "Hubble and ALMA spectroscopy confirmed Borisov originated from another star system with high CO gas abundance, showing other planetary systems undergo similar volatile condensation."),
        ("Sedna (90377 Sedna) has an extreme 11,400-year orbit with an aphelion of nearly 1,000 AU, whose detached perihelion (76 AU) cannot be explained by gravitational scattering from the known giant planets.",
         "TRUST", "Clearly True", "Hard", "Sedna Detached Trans-Neptunian Orbit",
         "Brown, Trujillo, and Rabinowitz discovered Sedna in 2003; its perihelion lies far outside Neptune's gravitational sphere of influence, requiring perturbation by a stellar flyby or unseen planet."),
        ("The Kuiper Belt extends out to 50 AU, where the 'Kuiper Cliff' marks a sudden, sharp drop in the density of classical objects that has no consensus gravitational explanation.",
         "TRUST", "Clearly True", "Hard", "Kuiper Cliff Density Dropoff 50 AU",
         "Surveys confirm a dramatic cutoff in classical Kuiper belt objects beyond the 2:1 resonance at 50 AU, leading to hypotheses of an undiscovered planetary-mass perturber or ancient disk truncation."),
        ("Asteroid 101955 Bennu was visited by OSIRIS-REx, which found it to be a solid monolithic rock slab with zero internal porosity that deflected the spacecraft sampler arm upon contact.",
         "ABSTAIN", "Common Misconception", "Medium", "Bennu Rubble-Pile Porosity OSIRIS-REx",
         "OSIRIS-REx revealed Bennu is a loosely bound 'rubble pile' with ~50-60% internal porosity, behaving almost like a fluid bed into which the TAGSAM collection arm sank 0.5 meters."),
        ("Haumea is a dwarf planet in the Kuiper Belt with an elongated triaxial ellipsoid shape caused by its rapid 3.9-hour rotational period, and possesses a narrow ring system.",
         "TRUST", "Clearly True", "Hard", "Haumea Triaxial Ellipsoid Ring System",
         "Stellar occultation observations in 2017 confirmed Haumea is distorted into an ellipsoid by rapid rotation and is surrounded by a coplanar ring with a radius of 2,287 km."),
        ("The Moon is in synchronous rotation with Earth, but exhibits longitudinal and latitudinal librations that allow observers on Earth to see approximately 59 percent of its total surface over time.",
         "TRUST", "Clearly True", "Medium", "Lunar Libration Surface Coverage 59 Percent",
         "Orbital eccentricity and axial tilt of 6.7° create optical librations in latitude and longitude, revealing an extra 9% of the lunar far side beyond the hemisphere."),
        ("Jupiter's Trojan asteroids share Jupiter's orbit clustered around the L1 and L2 unstable Lagrange points, regularly colliding with Jovian outer moons.",
         "ABSTAIN", "Common Misconception", "Hard", "Jupiter Trojan Lagrange Points L4 L5",
         "Jovian Trojans reside in stable gravitational potential wells around the L4 (Greek camp) and L5 (Trojan camp) equilibrium points 60° ahead and behind Jupiter, not L1 or L2.")
    ]),
    ("Rare Neuropharmacology & Hallucinogen Chemistry", [
        ("Psilocybin is a prodrug that is rapidly dephosphorylated in the human liver and stomach by alkaline phosphatase into psilocin, which acts as a full agonist at serotonin 5-HT2A receptors.",
         "TRUST", "Clearly True", "Hard", "Psilocybin Psilocin Alkaline Phosphatase",
         "Psilocybin (4-phosphoryloxy-DMT) is biologically inactive until hydrolyzed to psilocin (4-hydroxy-DMT), which crosses the blood-brain barrier and binds 5-HT2A G-protein coupled receptors."),
        ("Ibogaine is a psychoactive alkaloid derived from Tabernanthe iboga that can interrupt opioid addiction withdrawal symptoms by acting across NMDA, kappa-opioid, and alpha-3-beta-4 nicotinic receptors.",
         "TRUST", "Clearly True", "Hard", "Ibogaine Opioid Addiction Interruption",
         "Clinical pharmacology studies confirm ibogaine and its metabolite noribogaine attenuate opioid withdrawal signs and downregulate drug-seeking behavior via poly-pharmacological mechanisms."),
        ("Salvinorin A, the active compound in Salvia divinorum, is unique among potent naturally occurring hallucinogens because it is a non-nitrogenous diterpenoid that targets kappa-opioid receptors with zero 5-HT2A affinity.",
         "TRUST", "Clearly True", "Hard", "Salvinorin A Kappa Opioid Non-Nitrogenous",
         "Unlike classical indole or phenethylamine psychedelics, Salvinorin A contains no nitrogen atom and is an exceptionally selective, high-affinity kappa-opioid receptor (KOR) agonist."),
        ("LSD binds to the serotonin 5-HT2B and 5-HT2A receptors in a structural conformation where extracellular loop 2 acts as a 'lid' over the binding pocket, trapping the molecule for hours.",
         "TRUST", "Clearly True", "Hard", "LSD Crystal Structure Receptor Lid",
         "Wacker et al. (Cell 2017) solved the crystal structure of LSD bound to 5-HT2B and 5-HT2A, revealing that EL2 folds over the diethylamide group, explaining prolonged psychedelic durations."),
        ("MDMA promotes profound prosocial and empathogenic effects primarily by reversing serotonin transporter (SERT) flow and stimulating massive release of oxytocin from the hypothalamus.",
         "TRUST", "Clearly True", "Medium", "MDMA SERT Inversion Oxytocin Release",
         "MDMA binds SERT and VMAT2 to reverse amine transport, flooding synaptic clefts with serotonin, which acts on 5-HT1A receptors to trigger hypothalamic oxytocin secretion."),
        ("Mescaline is a synthetic opioid developed in pharmaceutical labs in the 1970s that acts as a potent mu-opioid agonist similar to fentanyl.",
         "ABSTAIN", "Clearly False", "Easy", "Mescaline Natural Phenethylamine Origin",
         "Mescaline is a naturally occurring phenethylamine alkaloid isolated from the peyote cactus (Lophophora williamsii) in 1897; it has zero structural or pharmacological relation to opioids."),
        ("Dimethyltryptamine (DMT) is orally inactive when swallowed alone because it is rapidly metabolized in the human gastrointestinal tract by monoamine oxidase A (MAO-A).",
         "TRUST", "Clearly True", "Medium", "DMT First-Pass MAO-A Inactivation",
         "First-pass hepatic and gastrointestinal MAO-A oxidatively deaminates oral DMT into indole-3-acetic acid; ayahuasca preparations combine DMT with beta-carboline MAO inhibitors to enable oral bioavailability."),
        ("The 'cheese effect' is a potentially fatal hypertensive crisis that occurs when patients taking monoamine oxidase inhibitors (MAOIs) consume aged cheeses rich in tyramine.",
         "TRUST", "Clearly True", "Hard", "MAOI Tyramine Cheese Effect Hypertensive Crisis",
         "MAOI inhibition prevents the breakdown of dietary tyramine in the gut; accumulated tyramine enters systemic circulation and displaces norepinephrine from synaptic vesicles, causing massive vasoconstriction."),
        ("Heroin (diacetylmorphine) is intrinsically more pharmacologically potent at mu-opioid receptors than morphine, binding with 1,000 times greater affinity before entering the brain.",
         "ABSTAIN", "Common Misconception", "Hard", "Heroin Prodrug Lipophilicity",
         "Heroin has low intrinsic affinity for mu-opioid receptors; its high potency stems from its two acetyl groups making it lipophilic, allowing it to cross the blood-brain barrier where it rapidly hydrolyzes into active morphine and 6-MAM."),
        ("Ketamine exists as a racemic mixture of (S)-ketamine (esketamine) and (R)-ketamine (arketamine), with (S)-ketamine having roughly 4 times higher binding affinity for the NMDA receptor.",
         "TRUST", "Clearly True", "Hard", "Ketamine Enantiomer Affinity Differences",
         "Esketamine binds the dizocilpine (MK-801) site of the NMDA receptor with 3-4 fold higher affinity than (R)-ketamine, leading to its separate approval as an intranasal antidepressant.")
    ]),
    ("Quantum Electrodynamics & Particle Anomalies", [
        ("The anomalous magnetic dipole moment of the muon ((g-2)/2) measured at Fermilab in 2021 and 2023 deviates from the Standard Model data-driven prediction at a significance exceeding 5 sigma.",
         "TRUST", "Clearly True", "Hard", "Muon g-2 Fermilab Discrepancy",
         "Fermilab Muon g-2 experiments measured a = 0.00116592055, confirming Brookhaven results and showing a 5.1 sigma tension with 2020 White Paper dispersion predictions."),
        ("Hawking radiation causes a black hole to lose mass because quantum virtual particle-antiparticle pairs separate at the event horizon, with negative-energy virtual particles falling inward.",
         "TRUST", "Clearly True", "Hard", "Hawking Radiation Negative Energy Particle Flux",
         "Calculated via quantum field theory in curved spacetime, the infalling partner particle possesses negative energy relative to spatial infinity, systematically reducing the black hole's ADM mass."),
        ("The Casimir effect is a macroscopic physical attractive force measured between two uncharged parallel conducting plates in a vacuum, caused by the exclusion of long-wavelength vacuum quantum fluctuations.",
         "TRUST", "Clearly True", "Medium", "Casimir Effect Quantum Vacuum Pressure",
         "Hendrik Casimir predicted and Lamoreaux experimentally verified in 1997 that boundary conditions restrict allowed photon modes between plates, generating net inward radiation pressure."),
        ("Neutrino oscillation definitively proves that neutrinos possess non-zero rest mass, directly contradicting the original formulation of the Standard Model of particle physics.",
         "TRUST", "Clearly True", "Hard", "Neutrino Oscillation Non-Zero Mass",
         "Super-Kamiokande (atmospheric) and SNO (solar) discovered flavor oscillations (electron, muon, tau), requiring differences in mass squared (delta m^2 != 0) and non-zero masses."),
        ("The Higgs boson discovered at CERN in 2012 has a measured mass of approximately 125 GeV/c^2 and a spin of 1 with positive parity.",
         "ABSTAIN", "Numerical Error", "Hard", "Higgs Boson Spin 0 Parity",
         "The Higgs boson is a scalar particle with spin 0 (J^P = 0^+), not spin 1 (which would be a vector gauge boson like the photon, W, or Z)."),
        ("CP violation in the neutral kaon system, discovered by Cronin and Fitch in 1964, proved that the laws of physics are not completely symmetric under simultaneous charge conjugation and parity reversal.",
         "TRUST", "Clearly True", "Hard", "Cronin Fitch CP Violation Neutral Kaons",
         "Observation of long-lived neutral kaons (K_L) decaying into two pions (K_L -> pi+ pi-) violated CP conservation, earning Cronin and Fitch the 1980 Nobel Prize."),
        ("Asymptotic freedom in Quantum Chromodynamics (QCD) dictates that the strong nuclear interaction between quarks becomes weaker as the quarks get closer together or probe higher energy scales.",
         "TRUST", "Clearly True", "Hard", "Asymptotic Freedom Strong Interaction QCD",
         "Gross, Wilczek, and Politzer proved in 1973 that the negative beta function in non-Abelian SU(3) gauge theory causes strong coupling to decrease asymptotically to zero at short distances."),
        ("Tachyons are hypothetical particles that travel faster than light, and their existence has been experimentally observed in high-energy neutrino beams at CERN in the OPERA experiment.",
         "ABSTAIN", "Echo Chamber", "Medium", "OPERA Faster Than Light Neutrino Defect",
         "The 2011 OPERA superluminal neutrino claim was traced to a faulty loose fiber optic cable and an oscillator clock calibration error, refuting faster-than-light neutrinos."),
        ("The positron was theoretically predicted by Paul Dirac in 1928 as a negative-energy electron hole solution to the relativistic Dirac equation, and experimentally discovered by Carl Anderson in 1932.",
         "TRUST", "Clearly True", "Medium", "Dirac Positron Prediction Anderson Discovery",
         "Dirac's equation combined quantum mechanics and special relativity, predicting antimatter; Carl Anderson observed positron tracks in cloud chamber cosmic ray photographs."),
        ("Quantum chromodynamics confinement prevents free individual quarks from ever being isolated at room temperature, because stretching quarks apart produces enough vacuum energy to create a new quark-antiquark pair.",
         "TRUST", "Clearly True", "Hard", "Quark Confinement Color Flux Tube",
         "The color flux tube potential increases linearly with distance (V ~ k*r); attempting to pull quarks apart requires energy exceeding meson rest masses, resulting in string breaking and hadronization.")
    ]),
    ("Archaeo-metallurgy & Ancient Lost Technologies", [
        ("Damascus steel blades possessed exceptional strength and sharp cutting edges due to the presence of carbon nanotubes and cementite nanowires formed during ancient Indian wootz crucible smelting.",
         "TRUST", "Sounds False But True", "Hard", "Damascus Steel Carbon Nanotubes Wootz",
         "High-resolution transmission electron microscopy by Reibold et al. (Nature 2006) discovered multi-walled carbon nanotubes encasing cementite nanowires in authentic Damascus blades."),
        ("Roman concrete structures like the Pantheon dome have survived 2,000 years in seawater because volcanic ash (pozzolana) and lime clasts trigger continuous self-healing crystallization of plinianite and tobermorite.",
         "TRUST", "Clearly True", "Hard", "Roman Concrete Pozzolanic Self-Healing",
         "Seymour et al. (Science Advances 2023) confirmed hot mixing of quicklime created reactive lime clasts that dissolve and recrystallize as calcium carbonate and tobermorite, spontaneously sealing microcracks."),
        ("Greek fire was an incendiary Byzantine naval weapon that could burn on top of water, whose precise chemical recipe was so zealously guarded as a state secret that it was completely lost to history.",
         "TRUST", "Clearly True", "Medium", "Greek Fire Byzantine State Secret",
         "First deployed during the Arab sieges of Constantinople (c. 678 CE), Greek fire utilized petroleum/naphtha, quicklime, and resins pressurized through siphons; the exact formulation remains unknown."),
        ("The iron pillar of Delhi has stood outdoors in monsoon rains for over 1,600 years without rusting because ancient Indian metalsmiths coated it in synthetic Teflon polymer.",
         "ABSTAIN", "Common Misconception", "Easy", "Delhi Iron Pillar Miswasite Layer",
         "The Delhi pillar resists corrosion due to a passive protective surface film of crystalline iron hydrogen phosphate hydrate (misawite) formed by high-phosphorus charcoal iron, not Teflon."),
        ("The Lycurgus Cup is a 4th-century Roman glass cage cup that exhibits dichroism: it appears green when lit from the outside, but glows ruby red when lit from the inside, due to colloidal gold-silver nanoparticles.",
         "TRUST", "Clearly True", "Hard", "Lycurgus Cup Nanoparticle Dichroism",
         "British Museum material analyses revealed Roman artisans embedded 70-nanometer gold and silver alloy nanoparticles in the glass, exploiting surface plasmon resonance 1,600 years before modern nanotechnology."),
        ("The Baghdad Battery, discovered in Khujut Rabu'a, was a working electrochemical cell constructed by ancient Parthians that was connected in series to power incandescent electric street lights in 250 BCE.",
         "ABSTAIN", "Echo Chamber", "Hard", "Baghdad Battery Electric Streetlight Myth",
         "The copper cylinder and iron rod in an earthenware jar could produce weak acid voltage in modern tests, but was likely a sacred scroll container; zero ancient wires, lamps, or electrochemical plating artifacts exist."),
        ("Ulfbherht swords from the Viking Age were forged from high-carbon crucible steel of astonishing purity that Europe was supposedly incapable of producing until the Industrial Revolution 800 years later.",
         "TRUST", "Clearly True", "Medium", "Ulfberht Viking Crucible Steel",
         "Metallurgical tests show true Ulfberht blades contained ~1.2% carbon with low slag inclusions, likely imported as wootz ingots along the Volga trade route from Central Asia."),
        ("Ancient Egyptian builders moved massive multi-ton stone blocks across the desert by wetting the sand in front of wooden sledges, reducing sliding friction by approximately 50 percent.",
         "TRUST", "Clearly True", "Medium", "Egyptian Sledge Sand Wetting Friction",
         "Fall et al. (Phys. Rev. Lett. 2014) demonstrated adding 2-5% water to sand forms capillary bridges that prevent berming and cut pulling force in half, matching depictions in the tomb of Djehutihotep."),
        ("The Antikythera mechanism's 30 bronze gears were cut using computerized laser CNC milling machines left behind by an advanced extraterrestrial civilization in the 2nd century BCE.",
         "ABSTAIN", "Clearly False", "Easy", "Antikythera Laser CNC Extraterrestrial Myth",
         "Micro-focus X-ray tomography shows tooth angles vary slightly with hand-filed bronze craftsmanship consistent with Hellenistic gear-cutting and Archimedean mechanical traditions."),
        ("Flexible glass (vitrum flexile) was a legendary lost Roman material described by Pliny that could be dented with a hammer and bent back into shape without breaking.",
         "TRUST", "Clearly True", "Medium", "Roman Vitrum Flexile Pliny Legend",
         "Documented by Pliny the Elder, Petronius, and Cassius Dio, an artisan presented flexible glass to Emperor Tiberius, who allegedly executed him to prevent the devaluation of gold and silver.")
    ])
]

# Load existing 230 cases
with open(TARGET_FILE, "r", encoding="utf-8") as f:
    text = f.read()

# Extract the JSON array from the text
import re
match = re.search(r'export const RARE_COMBINATION_TEST_CASES: ExperimentTestCase\[\] =\s*(\[.*\]);', text, re.DOTALL)
if not match:
    raise ValueError("Could not find RARE_COMBINATION_TEST_CASES array in file!")

existing_cases = json.loads(match.group(1))
print(f"Loaded {len(existing_cases)} existing cases.")

current_id = len(existing_cases) + 1

for domain, cases in NEW_70_DOMAINS:
    for claim, decision, cat, diff, entity, fact in cases:
        case_id = f"COMB-{current_id:03d}"
        existing_cases.append({
            "id": case_id,
            "claim": claim,
            "expectedDecision": decision,
            "explanation": fact,
            "category": cat,
            "difficulty": diff,
            "domain": domain,
            "targetEntity": entity,
            "canonicalFact": fact
        })
        current_id += 1

print(f"Total cases now: {len(existing_cases)}")

ts_output = f"""/**
 * rareCombinationCasesData.ts
 * 
 * 300 Unique, Rare, Combinatorial Benchmark Cases (COMB-001 to COMB-300).
 * Highly sophisticated cross-disciplinary cases covering:
 *  - Multi-premise combinations (True + False traps, Causal reversals)
 *  - Rare and obscure historical synchronies
 *  - Deep astrophysics, quantum metrology & information thermodynamics
 *  - Archaeoastronomy, linguistic isolates & paleogenomics
 *  - Extremophile biology, marine anomalies & geopolitical enclaves
 *  - Paleoclimatology, cryobiology, espionage, astrometry & neuropharmacology
 * 
 * Strict compliance with TestCaseCategory and ExperimentTestCase schemas.
 */

import {{ ExperimentTestCase }} from '@/types/experiments';

export const RARE_COMBINATION_TEST_CASES: ExperimentTestCase[] = {json.dumps(existing_cases, indent=2)};
"""

with open(TARGET_FILE, "w", encoding="utf-8") as f:
    f.write(ts_output)

print(f"Successfully updated {TARGET_FILE} to {len(existing_cases)} cases!")
