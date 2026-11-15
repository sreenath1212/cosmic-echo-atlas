// SPHEREx Mission Data & Caltech/IPAC IRSA Resources
// Source: https://irsa.ipac.caltech.edu/Missions/spherex.html

export interface SPHERExBand {
  id: number;
  name: string;
  minWavelength: number; // in microns
  maxWavelength: number; // in microns
  resolvingPower: number; // R = lambda / delta_lambda
  channelCount: number;
  filterType: string;
  detector: string;
  description: string;
  keyScience: string[];
}

export interface CanonicalPaper {
  category: string;
  title: string;
  authors: string;
  year: number;
  journal: string;
  bibcode?: string;
  arxiv?: string;
  abstractUrl: string;
  summary: string;
}

export interface DataRelease {
  id: string;
  name: string;
  date: string;
  status: "active" | "reprocessed" | "retired";
  doi?: string;
  doiUrl?: string;
  s3Prefix: string;
  description: string;
  characteristics: string[];
  accessMethods: { label: string; url: string; type: "web" | "api" | "s3" | "ftp" }[];
}

export interface SplicesTarget {
  id: string;
  name: string;
  type: string;
  ra: number;
  dec: number;
  glon: number;
  glat: number;
  jMag: number;
  hMag: number;
  ksMag: number;
  w1Mag: number;
  w2Mag: number;
  iceFeatures: string[];
  opticalDepthH2O: number;
  opticalDepthCO2: number;
  notes: string;
}

export interface PythonTutorial {
  title: string;
  category: string;
  description: string;
  url: string;
  githubUrl?: string;
  keyTopics: string[];
  codeSnippet: string;
}

// 6 SPHEREx Detector Bands
export const SPHEREX_BANDS: SPHERExBand[] = [
  {
    id: 1,
    name: "Band 1",
    minWavelength: 0.75,
    maxWavelength: 1.1,
    resolvingPower: 39,
    channelCount: 17,
    filterType: "Linear Variable Filter (LVF)",
    detector: "H2RG HgCdTe (2.5 µm cut-off)",
    description:
      "Covers red to near-infrared, mapping galaxy clustering and large-scale cosmic structure.",
    keyScience: [
      "Cosmic Inflation (Primordial Non-Gaussianity)",
      "Galaxy Clustering",
      "EBL (Extragalactic Background Light)",
    ],
  },
  {
    id: 2,
    name: "Band 2",
    minWavelength: 1.1,
    maxWavelength: 1.6,
    resolvingPower: 41,
    channelCount: 17,
    filterType: "Linear Variable Filter (LVF)",
    detector: "H2RG HgCdTe (2.5 µm cut-off)",
    description:
      "Captures 1.6 µm stellar bump in redshifted galaxies; key for cosmological distances.",
    keyScience: [
      "Galaxy Redshifts (z ~ 0.1 to 1.5)",
      "Stellar Mass Assembly",
      "Epoch of Reionization Fluctuations",
    ],
  },
  {
    id: 3,
    name: "Band 3",
    minWavelength: 1.6,
    maxWavelength: 2.4,
    resolvingPower: 41,
    channelCount: 17,
    filterType: "Linear Variable Filter (LVF)",
    detector: "H2RG HgCdTe (2.5 µm cut-off)",
    description: "Spans the K-band atmospheric window from space with zero telluric absorption.",
    keyScience: [
      "Zodiacal Light Separation",
      "Diffuse Galactic Light",
      "Near-IR Galaxy Photometry",
    ],
  },
  {
    id: 4,
    name: "Band 4",
    minWavelength: 2.4,
    maxWavelength: 3.8,
    resolvingPower: 35,
    channelCount: 17,
    filterType: "Linear Variable Filter (LVF)",
    detector: "H2RG HgCdTe (5.3 µm cut-off)",
    description:
      "Captures prominent interstellar water ice (H2O) absorption at 3.05 µm and aliphatic hydrocarbons.",
    keyScience: [
      "3.05 µm H2O Ice Absorption",
      "3.3 µm PAH Emission",
      "Protoplanetary Disk Biogenic Reserves",
    ],
  },
  {
    id: 5,
    name: "Band 5",
    minWavelength: 3.8,
    maxWavelength: 4.4,
    resolvingPower: 112,
    channelCount: 17,
    filterType: "Linear Variable Filter (LVF)",
    detector: "H2RG HgCdTe (5.3 µm cut-off)",
    description:
      "High spectral resolution band targeted at the 4.27 µm carbon dioxide (CO2) ice absorption profile.",
    keyScience: [
      "4.27 µm CO2 Ice Profiles",
      "Interstellar Carbon Reservoir",
      "High-Resolution Ice Spectroscopy",
    ],
  },
  {
    id: 6,
    name: "Band 6",
    minWavelength: 4.4,
    maxWavelength: 5.0,
    resolvingPower: 128,
    channelCount: 17,
    filterType: "Linear Variable Filter (LVF)",
    detector: "H2RG HgCdTe (5.3 µm cut-off)",
    description:
      "Highest resolution band designed to detect 4.67 µm carbon monoxide (CO) ice and XCN features.",
    keyScience: ["4.67 µm CO Ice Line", "XCN & OCN- Complexes", "Dense Cloud Ice Evolution"],
  },
];

export const TOTAL_NOMINAL_CHANNELS = 102; // 6 bands x 17 channels

export const MISSION_METADATA = {
  fullName:
    "Spectro-Photometer for the History of the Universe, Epoch of Reionization and Ices Explorer",
  acronym: "SPHEREx",
  class: "NASA Astrophysics Medium Explorer (MIDEX)",
  launchDate: "March 2025",
  lifetime: "2025 – 2027 (planned)",
  orbit: "Sun-synchronous low Earth orbit (terminator orbit, ~700 km altitude)",
  skyCoverage: "100% of the entire sky (All-Sky Survey)",
  totalChannels: 102,
  wavelengthRange: "0.75 – 5.0 µm",
  instrument: "Wide Field Linear Variable Filter (LVF) Imaging Spectrograph",
  telescopeAperture: "20 cm (effective diameter)",
  fieldOfView: "3.5° × 11.3° dual field of view",
  fundingAgency: "NASA",
  leadInstitution: "Caltech & Jet Propulsion Laboratory (JPL)",
  contributingInstitutions: [
    {
      name: "JPL",
      fullName: "Jet Propulsion Laboratory",
      role: "Project Management, Payload Integration",
    },
    {
      name: "Caltech",
      fullName: "California Institute of Technology",
      role: "Principal Investigator (Jamie Bock), Science Operations",
    },
    {
      name: "IPAC",
      fullName: "Infrared Processing & Analysis Center",
      role: "IRSA Science Data Center & Archive",
    },
    {
      name: "RIT",
      fullName: "Rochester Institute of Technology",
      role: "Diffuse Light & Fluctuation Science",
    },
    {
      name: "Harvard/CfA",
      fullName: "Harvard-Smithsonian Center for Astrophysics",
      role: "Galaxy Clustering & Ice Science",
    },
    { name: "Arizona State", fullName: "Arizona State University", role: "Reionization Modeling" },
    {
      name: "Univ of Arizona",
      fullName: "University of Arizona",
      role: "Planetary & Cometary Science",
    },
    { name: "Ohio State", fullName: "The Ohio State University", role: "Cosmological Analysis" },
    {
      name: "KASI",
      fullName: "Korea Astronomy and Space Science Institute",
      role: "Cryogenic Optical Testing & Hardware",
    },
    {
      name: "UC Irvine",
      fullName: "University of California, Irvine",
      role: "Extragalactic Background Light",
    },
    { name: "Johns Hopkins", fullName: "Johns Hopkins University", role: "Cosmology Theory" },
    {
      name: "ASIAA",
      fullName: "Academia Sinica Institute of Astronomy & Astrophysics",
      role: "Hardware Subsystems",
    },
  ],
  acknowledgementText:
    "This publication makes use of data products from the Spectro-Photometer for the History of the Universe, Epoch of Reionization and Ices Explorer (SPHEREx), which is a joint project of the Jet Propulsion Laboratory and the California Institute of Technology, and is funded by the National Aeronautics and Space Administration.",
  irsaMissionUrl: "https://irsa.ipac.caltech.edu/Missions/spherex.html",
  caltechMissionUrl: "https://spherex.caltech.edu",
};

export const CANONICAL_PAPERS: CanonicalPaper[] = [
  {
    category: "Mission Architecture",
    title: "The SPHEREx Mission: An All-Sky Spectral Survey",
    authors: "Bock, J., et al.",
    year: 2026,
    journal: "ApJ, 999, 139",
    bibcode: "2026ApJ...999..139B",
    abstractUrl: "https://ui.adsabs.harvard.edu/abs/2026ApJ...999..139B/abstract",
    summary:
      "Comprehensive description of the SPHEREx mission architecture, scientific goals in cosmic inflation, galaxy formation, and interstellar ices, and orbital flight performance.",
  },
  {
    category: "Science Pipeline",
    title: "The SPHEREx Science Data Processing Pipeline",
    authors: "Akeson, R., et al.",
    year: 2026,
    journal: "ApJS, 285, 67",
    bibcode: "2026ApJS..285...67A",
    abstractUrl: "https://ui.adsabs.harvard.edu/abs/2026ApJS..285...67A/abstract",
    summary:
      "Details the automated end-to-end data processing system at IPAC, level 1 to level 2 calibration algorithms, artifact mitigation, and point-spread function modeling.",
  },
  {
    category: "Sky Simulator",
    title: "The SPHEREx All-Sky Spectral Simulator",
    authors: "Crill, B., et al.",
    year: 2025,
    journal: "ApJS, 281, 10",
    bibcode: "2025ApJS..281...10C",
    abstractUrl: "https://ui.adsabs.harvard.edu/abs/2025ApJS..281...10C/abstract",
    summary:
      "Presents the synthetic sky model incorporating galaxies, stars, diffuse Galactic emission, zodiacal light, and instrument noise used to validate science extraction.",
  },
  {
    category: "Instrument & Calibration",
    title: "SPHEREx Instrument Testing and Ground Calibration",
    authors: "Korngut, P., et al.",
    year: 2026,
    journal: "arXiv preprint",
    arxiv: "arXiv:2603.29835",
    abstractUrl: "https://ui.adsabs.harvard.edu/abs/2026arXiv260329835K/abstract",
    summary:
      "Laboratory cryogenic characterization of the 6 LVF detector arrays, relative spectral response functions, transmission curves, and optical distortion mapping.",
  },
];

export const DATA_RELEASES: DataRelease[] = [
  {
    id: "dr1",
    name: "Data Release 1 (DR1)",
    date: "November 2026",
    status: "active",
    doi: "10.26131/IRSA678 (Images) / 10.26131/IRSA679 (Cube)",
    doiUrl: "https://www.ipac.caltech.edu/doi/10.26131/IRSA678",
    s3Prefix: "dr1",
    description:
      "First major unified data release. Includes fully reprocessed QR2 spectral images and the complete Spectral All-Sky Cube spanning 102 nominal spectral channels across 100% of the sky.",
    characteristics: [
      "Full 100% all-sky coverage",
      "102 nominal spectral channels (0.75 - 5.0 µm)",
      "Uniform calibration matching QR3 standard",
      "All-Sky Spectral Cube in HiPS and FITS formats",
      "Level 2 calibrated Multi-Extension FITS (MEF) images",
    ],
    accessMethods: [
      {
        label: "SPHEREx Data Explorer",
        url: "https://irsa.ipac.caltech.edu/applications/spherex",
        type: "web",
      },
      {
        label: "IPAC Browsable Level 2",
        url: "https://irsa.ipac.caltech.edu/ibe/data/spherex/dr1/level2",
        type: "web",
      },
      {
        label: "IPAC Browsable HiPS5 Cube",
        url: "https://irsa.ipac.caltech.edu/ibe/data/spherex/dr1/hips5_cube/hips_20261026",
        type: "web",
      },
      {
        label: "AWS S3 Open Data (dr1/)",
        url: "https://registry.opendata.aws/spherex-dr1/",
        type: "s3",
      },
      {
        label: "SIA Program Interface",
        url: "https://irsa.ipac.caltech.edu/ibe/sia.html",
        type: "api",
      },
    ],
  },
  {
    id: "qr3",
    name: "Quick Release 3 (QR3)",
    date: "September 2026",
    status: "active",
    doi: "10.26131/IRSA662",
    doiUrl: "https://www.ipac.caltech.edu/doi/irsa/10.26131/IRSA662",
    s3Prefix: "qr3",
    description:
      "Weekly quick-release spectral images incorporating refined PSF models and enhanced flat-field calibrations for high-reliability forced photometry.",
    characteristics: [
      "Weekly cadence delivery",
      "Enhanced spatial PSF calibration",
      "Seamlessly paired with DR1 as uniformly calibrated dataset",
      "Available via AWS Open Data and IPAC servers",
    ],
    accessMethods: [
      {
        label: "SPHEREx Data Explorer",
        url: "https://irsa.ipac.caltech.edu/applications/spherex",
        type: "web",
      },
      {
        label: "IPAC Browsable Level 2",
        url: "https://irsa.ipac.caltech.edu/ibe/data/spherex/qr3/level2",
        type: "web",
      },
      {
        label: "AWS S3 Open Data (qr3/)",
        url: "https://registry.opendata.aws/spherex-qr3/",
        type: "s3",
      },
      {
        label: "Astroquery Python API",
        url: "https://astroquery.readthedocs.io/en/latest/ipac/irsa/irsa.html",
        type: "api",
      },
    ],
  },
  {
    id: "qr2",
    name: "Quick Release 2 (QR2)",
    date: "October 2025 (Updated Apr 2026)",
    status: "reprocessed",
    doi: "10.26131/IRSA652",
    doiUrl: "https://www.ipac.caltech.edu/doi/irsa/10.26131/IRSA652",
    s3Prefix: "qr2",
    description:
      "First major reprocessed data set replacing QR1. On April 10, 2026, headers were updated to correct a PSF extension header error. Available for direct download through February 2027.",
    characteristics: [
      "Reprocessed all QR1 data with improved laboratory flat fields",
      "April 10, 2026 PSF header error correction applied",
      "Direct archive download supported through Feb 2027",
    ],
    accessMethods: [
      {
        label: "IPAC Browsable QR Directory",
        url: "https://irsa.ipac.caltech.edu/ibe/data/spherex/",
        type: "web",
      },
      {
        label: "AWS S3 Open Data (qr2/)",
        url: "https://registry.opendata.aws/spherex-qr/",
        type: "s3",
      },
      {
        label: "PSF Header Fix Documentation",
        url: "https://irsa.ipac.caltech.edu/data/SPHEREx/docs/psfhdrerr.html",
        type: "web",
      },
    ],
  },
  {
    id: "qr1",
    name: "Quick Release 1 (QR1)",
    date: "July 2025",
    status: "retired",
    doi: "10.26131/IRSA629",
    doiUrl: "https://www.ipac.caltech.edu/doi/irsa/10.26131/IRSA629",
    s3Prefix: "qr1",
    description:
      "Initial first-look spectral image pipeline output. Formally retired in February 2026 in favor of QR2 and DR1.",
    characteristics: [
      "Initial in-flight performance validation",
      "Superseded by QR2 and DR1 reprocessings",
      "Retired February 2026",
    ],
    accessMethods: [
      {
        label: "IRSA QR Overview",
        url: "https://irsa.ipac.caltech.edu/data/SPHEREx/docs/overview_qr.html",
        type: "web",
      },
    ],
  },
];

export const SPLICES_INFO = {
  title: "SPHEREx Target List of Ice Sources (SPLICES)",
  itemCount: "8,970,000+ sources (~9 million)",
  selectionCriteria:
    "Spatially isolated, IR-bright point sources selected from all-sky 2MASS and WISE photometry",
  primaryPaper: {
    title: "The SPHEREx Target List of Ice Sources (SPLICES)",
    authors: "Ashby, M. L. N., et al.",
    year: 2023,
    journal: "ApJ, 955, 78",
    url: "https://iopscience.iop.org/article/10.3847/1538-4357/acc86b",
    doi: "10.26131/IRSA554",
    doiUrl: "https://doi.org/10.26131/IRSA554",
  },
  downloadFitsUrl:
    "https://irsa.ipac.caltech.edu/data/SPHEREx/SPLICES/20241107_SPLICESv8.6.fits.gz",
  downloadFitsSize: "3.1 GB (compressed FITS)",
  gatorSearchUrl:
    "https://irsa.ipac.caltech.edu/cgi-bin/Gator/nph-scan?submit=Select&projshort=SPHEREX",
  releaseNotesPdfUrl:
    "https://irsa.ipac.caltech.edu/data/SPHEREx/SPLICES/SPLICES_Release_Notes.pdf",
  colDescriptionsUrl:
    "https://irsa.ipac.caltech.edu/data/SPHEREx/SPLICES/gator_docs/splices_colDescriptions.html",
  scientificSignificance:
    "SPLICES targets span young stellar objects (YSOs), protoplanetary disks, asymptotic giant branch (AGB) carbon stars, and dense molecular cloud cores. SPHEREx 0.75-5.0 µm spectrophotometry reveals absorption profiles of solid-state H2O (3.05 µm), CO2 (4.27 µm), CO (4.67 µm), and methanol (3.53 µm) ice mantles on interstellar dust grains.",
};

// Sample high-priority representative SPLICES targets
export const SAMPLE_SPLICES_SOURCES: SplicesTarget[] = [
  {
    id: "SPLICES-0019284",
    name: "HH 100 IRS (Corona Australis YSO)",
    type: "Class I Young Stellar Object",
    ra: 285.3421,
    dec: -37.1068,
    glon: 359.88,
    glat: -17.82,
    jMag: 11.42,
    hMag: 9.15,
    ksMag: 7.34,
    w1Mag: 5.61,
    w2Mag: 4.22,
    iceFeatures: ["H2O Ice (3.05 µm)", "CO2 Ice (4.27 µm)", "CO Ice (4.67 µm)"],
    opticalDepthH2O: 2.14,
    opticalDepthCO2: 0.88,
    notes:
      "Deep water ice absorption trough with prominent shoulder and secondary CO2 ice resonance.",
  },
  {
    id: "SPLICES-0145892",
    name: "Elias 29 (Ophiuchus Core)",
    type: "Class II Protoplanetary Disk",
    ra: 246.7917,
    dec: -24.6225,
    glon: 353.05,
    glat: 16.64,
    jMag: 10.88,
    hMag: 8.64,
    ksMag: 6.92,
    w1Mag: 5.25,
    w2Mag: 3.98,
    iceFeatures: ["H2O Ice (3.05 µm)", "Methanol Ice (3.53 µm)", "CO2 Ice (4.27 µm)"],
    opticalDepthH2O: 3.05,
    opticalDepthCO2: 1.25,
    notes:
      "Heavily obscured protostar embedded in cold dust; strong methanol and volatile organics signatures.",
  },
  {
    id: "SPLICES-0829104",
    name: "IRAS 08544-4431 (Post-AGB Star)",
    type: "Post-AGB Binary with Disk",
    ra: 133.9125,
    dec: -44.7212,
    glon: 265.48,
    glat: -2.31,
    jMag: 7.82,
    hMag: 6.74,
    ksMag: 5.42,
    w1Mag: 3.84,
    w2Mag: 2.65,
    iceFeatures: ["Crystalline H2O (3.1 µm)", "CO Ice (4.67 µm)"],
    opticalDepthH2O: 0.94,
    opticalDepthCO2: 0.35,
    notes: "Circumbinary Keplerian disk showing cold crystalline ice mantle growth.",
  },
  {
    id: "SPLICES-0914231",
    name: "Taurus B10 Protostellar Core",
    type: "Pre-stellar Dense Core",
    ra: 68.9812,
    dec: 24.3855,
    glon: 174.12,
    glat: -15.45,
    jMag: 13.55,
    hMag: 11.2,
    ksMag: 9.38,
    w1Mag: 7.42,
    w2Mag: 5.81,
    iceFeatures: ["H2O Ice (3.05 µm)", "CO2 Ice (4.27 µm)", "CO Ice (4.67 µm)", "OCN- (4.62 µm)"],
    opticalDepthH2O: 3.82,
    opticalDepthCO2: 1.76,
    notes:
      "Pristine pre-collapse interstellar cloud core showing extensive grain surface chemistry.",
  },
];

export const COMET_3I_ATLAS = {
  title: "SPHEREx Observations of Comet 3I/ATLAS",
  objectName: "3I/ATLAS",
  type: "Interstellar Comet (Hyperbolic trajectory, eccentricity e > 1)",
  observationEpochs: [
    {
      period: "August 2025 (Pre-Perihelion)",
      distanceAU: 2.35,
      features: "Detection of strong water ice absorption and extended CO2 coma.",
      citation: "Lisse et al. 2026, RNAAS, 9, 242; Lisse et al. 2025, ApJL submitted",
    },
    {
      period: "December 2025 (Post-Perihelion)",
      distanceAU: 1.82,
      features:
        "Detection of increased post-perihelion outgassing, refractory coma dust, and new coma gas species.",
      citation: "Lisse et al. 2026, submitted to RNAAS",
    },
  ],
  observationTableVoUrl:
    "https://irsa.ipac.caltech.edu/data/SPHEREx/docs/comet3iatlas/obscore_3I_Atlas.vot",
  downloadWgetScriptUrl:
    "https://irsa.ipac.caltech.edu/data/SPHEREx/docs/comet3iatlas/3IATLASImages-wget.sh",
  downloadCurlScriptUrl:
    "https://irsa.ipac.caltech.edu/data/SPHEREx/docs/comet3iatlas/3IATLASImages-curl.sh",
  photometryGuidance:
    "At the spatial resolution of SPHEREx (6.2 arcsec/pixel), Comet 3I/ATLAS is spatially extended across many wavelength bands due to its expanding coma. Because of this, IPAC does NOT recommend using the point-source SPHEREx Spectrophotometry Tool for 3I/ATLAS. Instead, use custom aperture photometry or surface-brightness profile integration on cutouts.",
  irsaViewerUrl: "https://irsa.ipac.caltech.edu/irsaviewer/",
  nasaSolarSystemUrl: "https://science.nasa.gov/solar-system/comets/3i-atlas/",
};

export const CLOUD_ACCESS = {
  s3Bucket: "nasa-irsa-spherex",
  s3Region: "us-east-1",
  s3ConsoleUrl: "https://nasa-irsa-spherex.s3.us-east-1.amazonaws.com/index.html",
  openDataRegistry: {
    dr1: "https://registry.opendata.aws/spherex-dr1/",
    qr3: "https://registry.opendata.aws/spherex-qr3/",
    qr2: "https://registry.opendata.aws/spherex-qr/",
  },
  prefixes: [
    {
      prefix: "dr1/",
      description: "Data Release 1 calibrated spectral images, all-sky cube, and auxiliary data",
    },
    { prefix: "qr3/", description: "Quick Release 3 weekly calibrated spectral images" },
    { prefix: "qr2/", description: "Quick Release 2 spectral images (available through Feb 2027)" },
  ],
  awsCliExamples: {
    listDr1: "aws s3 ls s3://nasa-irsa-spherex/dr1/ --no-sign-request",
    listAllSkyCube: "aws s3 ls s3://nasa-irsa-spherex/dr1/hips5_cube/ --no-sign-request",
    syncSample:
      "aws s3 sync s3://nasa-irsa-spherex/dr1/level2/2025W19_2B/ ./spherex_data/ --no-sign-request",
  },
};

export const SPECTRAL_CALIBRATIONS = {
  title: "SPHEREx Spectral Calibrations",
  overview:
    "Laboratory-derived spectral calibration products delivered at 4 spectral granularities: 17, 34, 51, and 68 sub-channels per detector. Includes normalized spectral response functions (transmission curves).",
  tarDownloadUrl:
    "https://irsa.ipac.caltech.edu/data/SPHEREx/docs/spectral_files_20260812/SPHERExSpectralFiles_202607.tar",
  pdfDocsUrl: "https://irsa.ipac.caltech.edu/data/SPHEREx/docs/SPHERExSpectralFiles_202607.pdf",
  subdirectories: [
    {
      name: "ChannelMaps/",
      description:
        "FITS files describing pixel-to-channel assignments across each 2048x2048 detector",
    },
    {
      name: "MiddlePixel/",
      description:
        "Normalized transmission curves for central pixels of each channel (Cent response)",
    },
    {
      name: "MeanAllPixel/",
      description:
        "Averaged transmission curves across all pixels within each channel (Allpix response)",
    },
    {
      name: "FidSecSummary/",
      description:
        "CSV summaries with central wavelengths, band edges, and resolving power per channel",
    },
    {
      name: "ParameterFiles/",
      description:
        "FITS maps of continuous band-center and band-width parameters across the detector plane",
    },
  ],
  middleVsAllPixelExplanation: {
    middlePixel:
      "Represents the response of pixels landing exactly at the spectral center of a channel. Best for individual point-source exposures.",
    allPixel:
      "Represents the average measured transmission across all pixels belonging to the channel. Best when combining multiple observations (e.g. Deep Fields) where dithered pixels sample varying central wavelengths.",
  },
};

export const PYTHON_TUTORIALS: PythonTutorial[] = [
  {
    title: "Introduction to SPHEREx Spectral Images",
    category: "Getting Started",
    description:
      "Learn the Multi-Extension FITS (MEF) structure of SPHEREx level 2 images, inspect WCS, and plot image extensions.",
    url: "https://caltech-ipac.github.io/irsa-tutorials/spherex-intro/",
    keyTopics: [
      "MEF Structure",
      "Header Data Units (HDUs)",
      "WCS Coordinates",
      "Data Quality Flags",
    ],
    codeSnippet: `from astropy.io import fits
import matplotlib.pyplot as plt

# Read SPHEREx Level 2 Spectral Image
hdul = fits.open("https://irsa.ipac.caltech.edu/ibe/data/spherex/dr1/level2/sample.fits")
image_data = hdul['IMAGE'].data
header = hdul['IMAGE'].header
print(f"Observing Band: {header['BAND']}, Central Wavelength: {header['WAVELEN']} um")`,
  },
  {
    title: "SPHEREx Spectral Image Cutouts",
    category: "Data Extraction",
    description:
      "Extract spatial cutouts from large SPHEREx MEF files preserving all HDUs, WCS coordinates, and variance extensions.",
    url: "https://caltech-ipac.github.io/irsa-tutorials/spherex-cutouts/",
    keyTopics: ["Cutout Service", "Direct URL API", "WCS Reprojection", "Multi-Extension Handling"],
    codeSnippet: `import urllib.request

# Request a 0.1 degree cutout around Orion Nebula (RA 83.82, Dec -5.39)
cutout_url = (
    "https://irsa.ipac.caltech.edu/ibe/data/spherex/dr1/level2/sample.fits"
    "?center=83.82,-5.39&size=0.1"
)
urllib.request.urlretrieve(cutout_url, "orion_cutout.fits")`,
  },
  {
    title: "SPHEREx PSF in Spectral Image Cutouts",
    category: "Photometry & Calibration",
    description:
      "Understand and evaluate the position- and wavelength-dependent Point Spread Function (PSF) in SPHEREx cutouts.",
    url: "https://caltech-ipac.github.io/irsa-tutorials/spherex-psf/",
    keyTopics: [
      "PSF Extension",
      "Pixel Convolution",
      "Point Source Fitting",
      "Aperture Correction",
    ],
    codeSnippet: `from astropy.io import fits
import numpy as np

hdul = fits.open("orion_cutout.fits")
psf_data = hdul['PSF'].data
print(f"PSF dimensions: {psf_data.shape}, Peak amplitude: {np.max(psf_data):.3e}")`,
  },
  {
    title: "SPHEREx Source Discovery Tool Demo",
    category: "Science Analysis",
    description:
      "Identify and characterize significant detected sources without requiring external positional priors.",
    url: "https://caltech-ipac.github.io/irsa-tutorials/spherex-source-discovery-tool-demo/",
    keyTopics: [
      "Blind Source Detection",
      "SNR Thresholding",
      "Local Background Estimation",
      "Spectral Extraction",
    ],
    codeSnippet: `# Running Source Discovery across SPHEREx spectral channels
# Extracts candidate objects above 5-sigma detection limit
# and measures multi-band SEDs without input catalog priors`,
  },
  {
    title: "SPHEREx Mosaic Cubes",
    category: "Advanced Imaging",
    description:
      "Construct multi-wavelength spatial mosaics from multiple overlapping SPHEREx spectral image exposures.",
    url: "https://caltech-ipac.github.io/irsa-tutorials/spherex-mosaic/",
    keyTopics: ["Co-addition", "Drizzle / Resampling", "Channel Stacking", "Mosaic FITS Cubes"],
    codeSnippet: `# Resample overlapping exposures onto a unified celestial grid
# Combines multiple passes across the ecliptic poles for deep field mapping`,
  },
  {
    title: "SPHEREx HiPS Cubes",
    category: "Visualization",
    description:
      "Stream and visualize SPHEREx all-sky spectral cubes using Hierarchical Progressive Surveys (HiPS).",
    url: "https://caltech-ipac.github.io/irsa-tutorials/spherex-hipscube/",
    keyTopics: [
      "HiPS5 Cube",
      "Aladin / Web Viewers",
      "All-Sky Streaming",
      "102-channel navigation",
    ],
    codeSnippet: `# Connect to the SPHEREx DR1 HiPS Cube:
# URL: https://irsa.ipac.caltech.edu/ibe/data/spherex/dr1/hips5_cube/hips_20261026
# Open in Aladin Desktop or Aladin Lite web viewer for interactive spectral navigation`,
  },
];

// Helper to generate simulated SPHEREx 102-channel spectrophotometry data
export interface SpectrumPoint {
  channelIndex: number;
  bandId: number;
  wavelength: number; // microns
  resolvingPower: number;
  flux: number; // mJy
  error: number; // mJy
  continuum: number; // mJy
  absorptionFeature?: string;
}

export function generateSyntheticSpherexSpectrum(
  targetType: "yso" | "galaxy" | "ice_grain" | "comet" | "flat",
): SpectrumPoint[] {
  const points: SpectrumPoint[] = [];

  // Generate 102 channels across the 6 bands
  let globalIndex = 0;
  for (const band of SPHEREX_BANDS) {
    const step = (band.maxWavelength - band.minWavelength) / (band.channelCount - 1);
    for (let c = 0; c < band.channelCount; c++) {
      const lambda = band.minWavelength + c * step;

      // Base continuum depending on target type
      let continuum = 0;
      let featureDrop = 0;
      let featureName: string | undefined = undefined;

      if (targetType === "yso") {
        // Red protostellar continuum rising towards longer wavelengths
        continuum = 12 * Math.pow(lambda / 1.0, 1.35);

        // Water ice absorption at 3.05 um
        if (lambda >= 2.85 && lambda <= 3.35) {
          const depth = Math.exp(-Math.pow((lambda - 3.05) / 0.16, 2) * 2.2);
          featureDrop += depth * 0.72;
          featureName = "H2O Ice (3.05 µm)";
        }
        // CO2 ice absorption at 4.27 um
        if (lambda >= 4.2 && lambda <= 4.35) {
          const depth = Math.exp(-Math.pow((lambda - 4.27) / 0.05, 2) * 3.5);
          featureDrop += depth * 0.45;
          featureName = "CO2 Ice (4.27 µm)";
        }
        // CO ice absorption at 4.67 um
        if (lambda >= 4.62 && lambda <= 4.72) {
          const depth = Math.exp(-Math.pow((lambda - 4.67) / 0.03, 2) * 4.0);
          featureDrop += depth * 0.32;
          featureName = "CO Ice (4.67 µm)";
        }
      } else if (targetType === "galaxy") {
        // 1.6 um stellar bump from older stellar population at redshift z ~ 0.3
        const restBump = 1.6 * 1.3; // ~ 2.08 um
        continuum = 5.0 * Math.exp(-Math.pow((lambda - restBump) / 0.8, 2)) + 1.2;
        // PAH emission line at 3.3 um
        if (Math.abs(lambda - 3.3 * 1.3) < 0.12) {
          featureDrop = -0.55; // emission peak
          featureName = "PAH 3.3 µm (z=0.3)";
        }
      } else if (targetType === "ice_grain") {
        // Massive cold absorption
        continuum = 8.0 * Math.pow(lambda / 2.0, 0.8);
        if (lambda >= 2.8 && lambda <= 3.4) {
          featureDrop = 0.85 * Math.exp(-Math.pow((lambda - 3.05) / 0.18, 2));
          featureName = "Deep H2O Ice Mantle";
        }
        if (lambda >= 4.22 && lambda <= 4.32) {
          featureDrop = 0.65 * Math.exp(-Math.pow((lambda - 4.27) / 0.04, 2));
          featureName = "Solid CO2 Resonance";
        }
      } else if (targetType === "comet") {
        // Solar reflected continuum with CO2 and H2O emission / absorption
        continuum = 18.0 * Math.pow(lambda / 1.0, -1.8) + 2.0;
        if (lambda >= 4.24 && lambda <= 4.3) {
          featureDrop = -1.2; // Gas fluorescence peak
          featureName = "Cometary CO2 ν3 Gas Band";
        }
        if (lambda >= 2.95 && lambda <= 3.2) {
          featureDrop = 0.42 * Math.exp(-Math.pow((lambda - 3.05) / 0.1, 2));
          featureName = "Cometary Grain H2O Ice";
        }
      } else {
        // Flat standard
        continuum = 10.0;
      }

      // Add small instrumental noise
      const noise =
        (Math.sin(globalIndex * 13.7) * 0.04 + Math.cos(globalIndex * 7.9) * 0.03) * continuum;
      const flux = Math.max(0.1, continuum * (1 - featureDrop) + noise);
      const error = flux * 0.035;

      points.push({
        channelIndex: globalIndex,
        bandId: band.id,
        wavelength: Number(lambda.toFixed(3)),
        resolvingPower: band.resolvingPower,
        flux: Number(flux.toFixed(3)),
        error: Number(error.toFixed(3)),
        continuum: Number(continuum.toFixed(3)),
        absorptionFeature: featureName,
      });

      globalIndex++;
    }
  }

  return points;
}

// Generate exact Cutout URL according to IPAC documentation
export function buildCutoutUrl(options: {
  ra: number;
  dec: number;
  sizeDeg: number;
  release?: "dr1" | "qr3" | "qr2";
  fitsPath?: string;
}): string {
  const rel = options.release ?? "dr1";
  const defaultPath =
    rel === "dr1"
      ? "spherex/dr1/level2/2025W19_2B/l2b-v11-2025-163/3/level2_2025W19_2B_0073_2D3_spx_dr1.fits"
      : rel === "qr3"
        ? "spherex/qr3/level2/2026W36_1A/l2b-v14-2026-250/2/level2_2026W36_1A_0042_1D2_spx_qr3.fits"
        : "spherex/qr/level2/2025W19_2B/l2b-v11-2025-163/3/level2_2025W19_2B_0073_2D3_spx_l2b-v11-2025-163.fits";

  const path = options.fitsPath ?? defaultPath;
  return `https://irsa.ipac.caltech.edu/ibe/data/${path}?center=${options.ra.toFixed(6)},${options.dec.toFixed(6)}&size=${options.sizeDeg.toFixed(4)}`;
}

// Generate Python Astroquery snippet for SPHEREx query
export function generateAstroquerySnippet(
  ra: number,
  dec: number,
  radiusArcmin: number = 2.0,
): string {
  return `from astroquery.ipac.irsa import Irsa
import astropy.units as u
from astropy.coordinates import SkyCoord

# Define target coordinates
coord = SkyCoord(ra=${ra.toFixed(4)}*u.deg, dec=${dec.toFixed(4)}*u.deg, frame='icrs')

# Query SPHEREx observations table via IRSA
table = Irsa.query_region(
    coord,
    catalog="spherex_dr1_spectral_images",
    spatial="Cone",
    radius=${radiusArcmin.toFixed(1)}*u.arcmin
)

print(f"Found {len(table)} SPHEREx spectral exposures covering target.")
print(table['obs_id', 'band', 'wavelen_min', 'wavelen_max', 'access_url'])`;
}
