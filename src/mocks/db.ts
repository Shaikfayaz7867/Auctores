import { 
  User, Journal, Article, AuthorProfile, EditorProfile, 
  ReviewerProfile, Submission, Category, Announcement, 
  Testimonial, FAQ, AnalyticsSummary, ArticleAuthor,
  ReviewRound, DailyMetric, AppNotification
} from '../types';

// Simple seeded pseudo-random number generator for reproducibility
class SeededRandom {
  private seed: number;
  constructor(seed: number) {
    this.seed = seed;
  }
  next(): number {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
  intRange(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }
  pick<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }
  pickMany<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => this.next() - 0.5);
    return shuffled.slice(0, count);
  }
}

const rng = new SeededRandom(19980523); // Consistent seed

// --- GENERATOR DATA CONSTANTS ---
const SUBJECTS = [
  { cat: 'Medicine & Health', code: 'MED', icon: 'Stethoscope' },
  { cat: 'Computer Science & AI', code: 'CS', icon: 'Cpu' },
  { cat: 'Physical Sciences & Physics', code: 'PHYS', icon: 'Atom' },
  { cat: 'Life Sciences & Biology', code: 'BIO', icon: 'Dna' },
  { cat: 'Chemistry & Materials', code: 'CHEM', icon: 'FlaskConical' },
  { cat: 'Environmental & Earth Sciences', code: 'ENV', icon: 'Globe' },
  { cat: 'Engineering & Technology', code: 'ENG', icon: 'Cog' },
  { cat: 'Mathematics & Statistics', code: 'MATH', icon: 'Binary' },
  { cat: 'Social Sciences & Economics', code: 'SOC', icon: 'Users' },
  { cat: 'Arts & Humanities', code: 'HUM', icon: 'BookOpen' }
];

const JARGON = {
  MED: {
    nouns: ['Oncology', 'Therapeutics', 'Pathology', 'Neurology', 'Cardiovascular Medicine', 'Genomics', 'Epidemiology', 'Immunotherapy', 'Pharmacology', 'Endocrinology'],
    adjectives: ['Clinical', 'Molecular', 'Targeted', 'Translational', 'Synthetic', 'Pediatric', 'Systemic', 'Advanced', 'Diagnostic', 'Cellular']
  },
  CS: {
    nouns: ['Neural Networks', 'Distributed Ledger', 'Quantum Computing', 'Computer Vision', 'Natural Language Processing', 'Cryptography', 'Cybersecurity', 'Autonomous Systems', 'Edge Computing', 'Robotics'],
    adjectives: ['Heuristic', 'Algorithmic', 'Reinforced', 'Decentralized', 'Scalable', 'Cognitive', 'Neuromorphic', 'Asynchronous', 'Generative', 'Predictive']
  },
  PHYS: {
    nouns: ['Superconductivity', 'Astrophysics', 'Quantum Mechanics', 'Thermodynamics', 'Dark Matter', 'Gravitational Waves', 'Plasma Physics', 'Cosmology', 'Condensed Matter', 'Nanophotonics'],
    adjectives: ['Relativistic', 'Quantum', 'Thermal', 'High-Energy', 'Electromagnetic', 'Spectroscopic', 'Stochastic', 'Astrophysical', 'Non-linear', 'Kinetic']
  },
  BIO: {
    nouns: ['Microbiome', 'Photosynthesis', 'Genetics', 'Metabolism', 'Neurobiology', 'Ecosystems', 'Stem Cells', 'Enzymology', 'Biophysics', 'Evolutionary Biology'],
    adjectives: ['Epigenetic', 'Phylogenetic', 'Metabolic', 'Symbiotic', 'Recombinant', 'Structural', 'Ecological', 'Pathogenic', 'Mitochondrial', 'Somatic']
  },
  CHEM: {
    nouns: ['Catalysis', 'Polymers', 'Nanoparticles', 'Electrochemistry', 'Spectroscopy', 'Synthesis', 'Metallurgy', 'Crystallography', 'Biochemistry', 'Colloids'],
    adjectives: ['Inorganic', 'Organic', 'Macromolecular', 'Catalytic', 'Supramolecular', 'Covalent', 'Fluorescent', 'Polymeric', 'Asymmetric', 'Thermosetting']
  },
  ENV: {
    nouns: ['Climate Change', 'Biodiversity', 'Renewable Energy', 'Hydrology', 'Ecosystem Services', 'Pollution', 'Sustainability', 'Carbon Sequestration', 'Geology', 'Meteorology'],
    adjectives: ['Ecological', 'Atmospheric', 'Sustainable', 'Geothermal', 'Glaciological', 'Biospheric', 'Hydrological', 'Conservation', 'Anthropogenic', 'Marine']
  },
  ENG: {
    nouns: ['Aerodynamics', 'Optoelectronics', 'Mechatronics', 'Nanotechnology', 'Structural Integrity', 'Telecommunications', 'Signal Processing', 'Fluid Dynamics', 'Automation', 'Robotics'],
    adjectives: ['Mechanical', 'Electrical', 'Photonic', 'Acoustic', 'Microfabricated', 'Pneumatic', 'Nanostructured', 'Biomimetic', 'Aerospace', 'Thermal']
  },
  MATH: {
    nouns: ['Topology', 'Algebraic Geometry', 'Stochastic Calculus', 'Graph Theory', 'Differential Equations', 'Combinatorics', 'Number Theory', 'Numerical Analysis', 'Functional Analysis', 'Probability'],
    adjectives: ['Non-commutative', 'Linear', 'Combinatorial', 'Asymptotic', 'Hermitian', 'Isometric', 'Manifold', 'Stochastic', 'Holomorphic', 'Symmetric']
  },
  SOC: {
    nouns: ['Macroeconomics', 'Behavioral Science', 'Demography', 'Sociology', 'Cognitive Psychology', 'Public Policy', 'Econometrics', 'Globalization', 'Urbanization', 'Geopolitics'],
    adjectives: ['Socio-Economic', 'Empirical', 'Quantitative', 'Behavioral', 'Structuralist', 'Neoliberal', 'Institutional', 'Demographic', 'Cognitive', 'Cultural']
  },
  HUM: {
    nouns: ['Epistemology', 'Hermeneutics', 'Linguistics', 'Historiography', 'Ethics', 'Phenomenology', 'Aesthetics', 'Archeology', 'Cultural Studies', 'Semiotics'],
    adjectives: ['Philosophical', 'Historical', 'Linguistic', 'Socio-Cultural', 'Ethical', 'Postmodern', 'Analytical', 'Dialectical', 'Comparative', 'Semantic']
  }
};

const UNIVERSITY_AFFILIATIONS = [
  'Harvard University, Cambridge, MA, USA',
  'Massachusetts Institute of Technology (MIT), Cambridge, MA, USA',
  'Stanford University, Stanford, CA, USA',
  'University of Oxford, Oxford, UK',
  'University of Cambridge, Cambridge, UK',
  'ETH Zurich, Zurich, Switzerland',
  'Tsinghua University, Beijing, China',
  'The University of Tokyo, Tokyo, Japan',
  'National University of Singapore (NUS), Singapore',
  'University of Toronto, Toronto, Canada',
  'Sorbonne University, Paris, France',
  'Max Planck Institute, Munich, Germany',
  'University of Melbourne, Melbourne, Australia',
  'Indian Institute of Science (IISc), Bangalore, India',
  'Imperial College London, London, UK'
];

const FIRST_NAMES = ['Aria', 'Liam', 'Elena', 'Mateo', 'Olivia', 'Yusuf', 'Sofia', 'Kenji', 'Chloe', 'Amara', 'Lucas', 'Zarah', 'Nikhil', 'Emma', 'Hiroshi', 'Sven', 'Fatima', 'Dimitri', 'Freja', 'Carlos'];
const LAST_NAMES = ['Chen', 'Smith', 'Garcia', 'Müller', 'Kim', 'Patel', 'Novak', 'Suzuki', 'Silva', 'Ivanov', 'Haddad', 'Nair', 'Onyango', 'Johansson', 'Ali', 'Wang', 'Rossi', 'Rodriguez', 'Kumar', 'Dubois'];

// Helper to slugify
const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

// --- PROGRAMMATIC GENERATORS ---

export interface Database {
  users: User[];
  categories: Category[];
  journals: Journal[];
  articles: Article[];
  authors: AuthorProfile[];
  editors: EditorProfile[];
  reviewers: ReviewerProfile[];
  submissions: Submission[];
  notifications: AppNotification[];
  announcements: Announcement[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  analytics: AnalyticsSummary;
}

export function generateDatabase(): Database {
  console.log('Generating academic platform seeding database...');

  // 1. Generate standard Categories
  const categories: Category[] = SUBJECTS.map((sub, index) => ({
    id: `cat-${index + 1}`,
    name: sub.cat,
    slug: slugify(sub.cat),
    description: `Leading research journals and comprehensive archives in ${sub.cat}. Including top tier peer-reviewed articles, letters, and research briefs.`,
    journalCount: 10, // will be exactly 10 journals per category, total 100
    icon: sub.icon
  }));

  // 2. Generate 300 base Users (200 Authors, 100 Editors/Admins/Reviewers)
  const users: User[] = [];
  
  // Helper to generate ORCID
  const genOrcid = (i: number) => `0000-0002-${(1000 + i).toString()}-${(1000 + (i % 23)).toString()}`;

  // 200 Authors
  for (let i = 1; i <= 200; i++) {
    const fn = rng.pick(FIRST_NAMES);
    const ln = rng.pick(LAST_NAMES);
    const name = `${fn} ${ln}`;
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@university.edu`;
    const aff = rng.pick(UNIVERSITY_AFFILIATIONS);
    users.push({
      id: `usr-author-${i}`,
      name,
      email,
      role: 'author',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      orcid: genOrcid(i),
      affiliation: aff,
      createdAt: new Date(2021, 0, rng.intRange(1, 1000)).toISOString()
    });
  }

  // 100 Editors
  for (let i = 1; i <= 100; i++) {
    const fn = rng.pick(FIRST_NAMES);
    const ln = rng.pick(LAST_NAMES);
    const name = `${fn} ${ln}`;
    const email = `editor.${ln.toLowerCase()}${i}@auctores.org`;
    const aff = rng.pick(UNIVERSITY_AFFILIATIONS);
    users.push({
      id: `usr-editor-${i}`,
      name,
      email,
      role: 'editor',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}&backgroundColor=002f6c`,
      affiliation: aff,
      createdAt: new Date(2020, 0, rng.intRange(1, 1000)).toISOString()
    });
  }

  // 100 Reviewers
  for (let i = 1; i <= 100; i++) {
    const fn = rng.pick(FIRST_NAMES);
    const ln = rng.pick(LAST_NAMES);
    const name = `${fn} ${ln}`;
    const email = `reviewer.${ln.toLowerCase()}${i}@reviewers.org`;
    const aff = rng.pick(UNIVERSITY_AFFILIATIONS);
    users.push({
      id: `usr-reviewer-${i}`,
      name,
      email,
      role: 'reviewer',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}&backgroundColor=8b0000`,
      affiliation: aff,
      createdAt: new Date(2021, 0, rng.intRange(1, 1000)).toISOString()
    });
  }

  // Extra Admin User
  users.push({
    id: 'usr-admin-1',
    name: 'Dr. Arthur Pendelton',
    email: 'admin@auctores.org',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arthur',
    affiliation: 'Auctores Editorial Headquarters, Switzerland',
    createdAt: new Date(2019, 0, 1).toISOString()
  });

  // 3. Create Author, Editor, Reviewer Profiles linked to Users
  const authors: AuthorProfile[] = [];
  const editors: EditorProfile[] = [];
  const reviewers: ReviewerProfile[] = [];

  // Populate profiles
  users.forEach(user => {
    if (user.role === 'author') {
      const idx = parseInt(user.id.split('-').pop()!);
      const interests = rng.pickMany([
        'Quantum Computing', 'Epigenetics', 'Cancer Biomarkers', 'Renewable Microgrids', 
        'Stochastic Modeling', 'Behavioral Economics', 'Deep Reinforcement Learning',
        'Covalent Organic Frameworks', 'Hydrological Modeling', 'Semantics', 'Computational Linguistics'
      ], rng.intRange(2, 4));
      
      authors.push({
        id: `aut-${idx}`,
        userId: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar!,
        biography: `Dr. ${user.name} is a senior research scientist with extensive research experience in the domain. Having worked on key multi-national research initiatives, they focus on cross-disciplinary collaborations. They serve as a consultant on various international advisory boards.`,
        affiliation: user.affiliation!,
        hIndex: rng.intRange(8, 45),
        citations: rng.intRange(250, 4800),
        orcid: user.orcid!,
        researchInterests: interests,
        publications: [] // filled later
      });
    } else if (user.role === 'editor') {
      const idx = parseInt(user.id.split('-').pop()!);
      const sub = rng.pick(SUBJECTS);
      const specs = JARGON[sub.code as keyof typeof JARGON].nouns;
      editors.push({
        id: `edi-${idx}`,
        userId: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar!,
        affiliation: user.affiliation!,
        role: idx % 10 === 1 ? 'Editor-in-Chief' : rng.pick(['Associate Editor', 'Section Editor', 'Managing Editor']),
        specialties: rng.pickMany(specs, 3),
        assignedJournals: [] // filled later
      });
    } else if (user.role === 'reviewer') {
      const idx = parseInt(user.id.split('-').pop()!);
      const sub = rng.pick(SUBJECTS);
      const specs = JARGON[sub.code as keyof typeof JARGON].nouns;
      reviewers.push({
        id: `rev-${idx}`,
        userId: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar!,
        affiliation: user.affiliation!,
        expertise: rng.pickMany(specs, 3),
        completedReviewsCount: rng.intRange(5, 60),
        activeReviewsCount: rng.intRange(0, 3),
        hIndex: rng.intRange(5, 30)
      });
    }
  });

  // 4. Generate 100 Journals (exactly 10 journals per category)
  const journals: Journal[] = [];
  let journalCounter = 1;

  categories.forEach((cat) => {
    const subObj = SUBJECTS.find(s => s.cat === cat.name)!;
    const lexicon = JARGON[subObj.code as keyof typeof JARGON];

    for (let j = 1; j <= 10; j++) {
      const id = `jnl-${journalCounter}`;
      
      // Let's create beautiful journal titles: e.g., "Auctores Journal of Advanced Neurology" or "International Journal of Molecular Oncology"
      const style = rng.pick(['International Journal of', 'Journal of', 'Auctores Journal of', 'Advances in', 'Progress in', 'Annals of']);
      const adj = rng.pick(lexicon.adjectives);
      const noun = rng.pick(lexicon.nouns);
      const title = `${style} ${adj} ${noun}`;
      const slug = slugify(title);

      // Pick an Editor-in-Chief
      // To distribute them nicely, we find an editor specializing in this or just any editor
      const eic = editors[journalCounter % editors.length];
      eic.assignedJournals.push(id);

      journals.push({
        id,
        title,
        slug,
        description: `An international, peer-reviewed, open access journal publishing premium original papers and reviews in all areas of ${adj.toLowerCase()} ${noun.toLowerCase()}. Supported by an expert board of international reviewers, the journal ensures exceptionally rigorous peer review and high publishing speed.`,
        issnPrint: `${rng.intRange(1000, 9999)}-${rng.intRange(1000, 9999)}`,
        issnOnline: `${rng.intRange(1000, 9999)}-${rng.intRange(1000, 9999)}`,
        impactFactor: Number(rng.range(1.5, 9.8).toFixed(2)),
        citeScore: Number(rng.range(2.0, 12.5).toFixed(2)),
        hIndex: rng.intRange(25, 120),
        acceptanceRate: rng.intRange(15, 38), // lower is premium
        daysToFirstDecision: rng.intRange(18, 45),
        frequency: rng.pick(['Monthly', 'Semi-Monthly', 'Quarterly', 'Bimonthly']),
        publisher: 'Auctores Academic Publishing',
        categories: [cat.name],
        logo: `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop&q=80`,
        coverImage: `https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&auto=format&fit=crop&q=60`,
        indexing: rng.pickMany(['Scopus', 'Web of Science (SCIE)', 'PubMed (MEDLINE)', 'DOAJ', 'Google Scholar', 'EMBASE', 'EI Compendex'], rng.intRange(4, 6)),
        editorialPolicy: 'All submitted manuscripts are subjected to rigorous single-blind peer review. Submitted work must be entirely original, unpublished, and not under active consideration elsewhere.',
        articleProcessingCharge: rng.pick([1200, 1500, 1800, 2000, 2500]),
        foundedYear: rng.intRange(1995, 2024),
        editorInChiefId: eic.id
      });

      journalCounter++;
    }
  });

  // Assign other editors to journals as associate editors
  editors.forEach((editor, index) => {
    if (editor.assignedJournals.length === 0) {
      // Pick a random journal matching their expertise category or just random
      const randomJournal = journals[index % journals.length];
      editor.assignedJournals.push(randomJournal.id);
    }
  });

  // 5. Generate 1000 Articles (evenly distributed, approx 10 per journal)
  const articles: Article[] = [];
  let articleCounter = 1;

  journals.forEach((jnl) => {
    const catName = jnl.categories[0];
    const subObj = SUBJECTS.find(s => s.cat === catName)!;
    const lexicon = JARGON[subObj.code as keyof typeof JARGON];

    for (let a = 1; a <= 10; a++) {
      const id = `art-${articleCounter}`;
      
      // Let's create beautiful academic paper titles
      const style = rng.pick([
        'Effects of {Noun} on {Noun}',
        'Novel Approach for {Adj} {Noun} and its Applications',
        'Analysis and Modeling of {Adj} {Noun} Systems',
        'Investigating the Role of {Noun} in {Adj} {Noun}',
        'Optimizing {Noun} for Enhanced Performance in {Adj} {Noun}',
        'Development of a {Adj} {Noun} Framework for {Noun}',
        'Longitudinal Study on {Adj} {Noun} in Emerging Environments',
        'Comparative Review of {Adj} {Noun} and {Noun}'
      ]);

      const n1 = rng.pick(lexicon.nouns);
      let n2 = rng.pick(lexicon.nouns);
      while (n1 === n2) n2 = rng.pick(lexicon.nouns);
      const adj = rng.pick(lexicon.adjectives);

      const title = style
        .replace('{Noun}', n1)
        .replace('{Noun}', n2)
        .replace('{Adj}', adj);

      const slug = slugify(title);

      // Select 2-4 authors from our 200 authors
      const paperAuthors: ArticleAuthor[] = [];
      const chosenAuthors = rng.pickMany(authors, rng.intRange(2, 4));
      
      chosenAuthors.forEach((author, i) => {
        paperAuthors.push({
          id: author.id,
          name: author.name,
          affiliation: author.affiliation,
          email: author.email,
          isCorresponding: i === 0,
          orcid: author.orcid
        });

        // Link publication to author profile
        author.publications.push(id);
      });

      const pubYear = rng.intRange(jnl.foundedYear, 2026);
      const pubMonth = rng.intRange(1, 12);
      const pubDay = rng.intRange(1, 28);
      const publicationDate = new Date(pubYear, pubMonth - 1, pubDay).toISOString();

      const views = rng.intRange(50, 4200);
      const downloads = Math.floor(views * rng.range(0.12, 0.35));
      const citations = Math.floor(downloads * rng.range(0.05, 0.2));

      // Build keywords
      const keywords = rng.pickMany(lexicon.nouns, rng.intRange(3, 5));

      // References
      const references = Array.from({ length: rng.intRange(15, 40) }).map((_, rIdx) => {
        const refAuthor = `${rng.pick(LAST_NAMES)}, ${rng.pick(FIRST_NAMES).substring(0, 1)}.`;
        const refYear = rng.intRange(1990, pubYear - 1);
        const refTitle = `A foundational study on ${rng.pick(lexicon.nouns).toLowerCase()} and ${rng.pick(lexicon.nouns).toLowerCase()}`;
        return `${refAuthor} (${refYear}). "${refTitle}". Journal of Scientific Advances, ${rng.intRange(1, 250)}, ${rng.intRange(10, 800)}.`;
      });

      articles.push({
        id,
        journalId: jnl.id,
        journalTitle: jnl.title,
        title,
        slug,
        abstract: `This study explores the paradigm of ${title.toLowerCase()}. In this manuscript, we present a novel empirical framework and comprehensive analytical methodologies designed to address current challenges in ${n1.toLowerCase()} and ${n2.toLowerCase()}. Utilizing robust sample sets and experimental simulations, we establish that the implementation of ${adj.toLowerCase()} techniques results in a significant optimization (up to ${rng.intRange(15, 45)}%) in efficiency, consistency, and stability. Furthermore, we discuss the core mechanistic implications of our findings, demonstrating how this study bridges the gap between historical theoretical frameworks and practical applications in ${catName.toLowerCase()}. Future research trajectories, limitations, and scalable integration prospects are thoroughly explored in depth.`,
        authors: paperAuthors,
        publicationDate,
        doi: `10.3390/auctores.${jnl.slug.substring(0, 6)}.${pubYear}.${(1000 + articleCounter).toString()}`,
        volume: pubYear - jnl.foundedYear + 1,
        issue: rng.intRange(1, 12),
        pages: `${rng.intRange(10, 150)}-${rng.intRange(151, 300)}`,
        keywords,
        pdfUrl: `/files/auctores-${id}.pdf`,
        references,
        citations,
        views,
        downloads,
        status: 'published',
        license: 'CC BY 4.0 (Creative Commons Attribution License)',
        section: rng.pick(['Original Research', 'Review Article', 'Short Communication', 'Technical Note'])
      });

      articleCounter++;
    }
  });

  // 6. Generate Submissions (Ongoing reviews, revisions, draft, etc.)
  const submissions: Submission[] = [];
  const activeSubmissionCount = 35; // Generate 35 mock workflows at different stages

  for (let s = 1; s <= activeSubmissionCount; s++) {
    const id = `sub-${s}`;
    const author = rng.pick(authors);
    const jnl = rng.pick(journals);
    const catName = jnl.categories[0];
    const subObj = SUBJECTS.find(s => s.cat === catName)!;
    const lexicon = JARGON[subObj.code as keyof typeof JARGON];

    const title = `A Novel Investigation into ${rng.pick(lexicon.adjectives)} ${rng.pick(lexicon.nouns)} and its Impact on ${rng.pick(lexicon.nouns)}`;
    const status = rng.pick([
      'submitted', 'under_peer_review', 'revision_required', 'revised', 'accepted', 'rejected'
    ]) as Submission['status'];

    // Select 2-3 Reviewers
    const assignedReviewers = rng.pickMany(reviewers, 3);
    const reviews: ReviewRound[] = [];

    if (status === 'under_peer_review' || status === 'revision_required' || status === 'revised' || status === 'accepted' || status === 'rejected') {
      assignedReviewers.forEach((rev) => {
        // Only some submit reviews, or all did
        const submitted = status === 'revision_required' || status === 'accepted' || status === 'rejected' || rng.next() > 0.4;
        if (submitted) {
          const rec = rng.pick(['accept', 'minor_revision', 'major_revision', 'reject']) as ReviewRound['recommendation'];
          reviews.push({
            reviewerId: rev.id,
            reviewerName: rev.name,
            rating: rng.intRange(1, 5),
            recommendation: rec,
            commentsForAuthor: `This is an impressive paper. However, the author needs to justify their assumptions regarding ${rng.pick(lexicon.nouns).toLowerCase()} in section 3. The references are adequate, and the manuscript is written extremely well.`,
            commentsForEditor: `The manuscript provides interesting insight. I suggest a recommendation of ${rec.replace('_', ' ')} based on the scientific depth of the analysis.`,
            submittedAt: new Date(2026, 4, rng.intRange(1, 20)).toISOString()
          });
          // Increment completed review count for reviewer profile
          rev.completedReviewsCount++;
        } else {
          rev.activeReviewsCount++;
        }
      });
    }

    let editorialDecision: Submission['editorialDecision'] = undefined;
    if (status === 'accepted' || status === 'rejected') {
      const editor = editors.find(e => e.assignedJournals.includes(jnl.id)) || editors[0];
      editorialDecision = {
        editorId: editor.id,
        editorName: editor.name,
        decision: status === 'accepted' ? 'accept' : 'reject',
        comments: `The manuscript has been evaluated by three independent reviewers. Based on their reports and recommendations, we are pleased to ${status === 'accepted' ? 'accept' : 'decline'} this manuscript for publication.`,
        decidedAt: new Date(2026, 4, 25).toISOString()
      };
    }

    submissions.push({
      id,
      title,
      abstract: `This manuscript explores critical methodologies in modern scientific research. The authors introduce a novel paradigm for analyzing parameters related to ${rng.pick(lexicon.nouns).toLowerCase()} under varying clinical and computational environments. Experimental findings indicate a substantial improvement in robust operational indexes...`,
      journalId: jnl.id,
      journalTitle: jnl.title,
      authorId: author.id,
      authorName: author.name,
      authors: [
        { name: author.name, affiliation: author.affiliation, email: author.email, isCorresponding: true, orcid: author.orcid },
        { name: 'Dr. Jane Doe', affiliation: 'Stanford University, CA, USA', email: 'jane.doe@stanford.edu', isCorresponding: false }
      ],
      submittedAt: new Date(2026, 3, rng.intRange(1, 25)).toISOString(),
      status,
      fileUrl: `/files/temp-upload-${id}.docx`,
      fileName: `${slugify(title.substring(0, 30))}-manuscript.docx`,
      keywords: rng.pickMany(lexicon.nouns, 3),
      coverLetter: `Dear Editor-in-Chief,\n\nWe are submitting our manuscript titled "${title}" for consideration of publication in ${jnl.title}. We believe our findings will be highly relevant to your audience since we discuss a significant breakthrough in ${catName.toLowerCase()}.\n\nSincerely,\nDr. ${author.name}`,
      reviewers: assignedReviewers.map(r => r.id),
      reviews,
      editorialDecision
    });
  }

  // 7. Generate Announcements, Testimonials, FAQs
  const announcements: Announcement[] = [
    {
      id: 'ann-1',
      title: 'Call for Papers: Special Issue on Quantum Machine Learning in Healthcare',
      content: 'Auctores Journal of Advanced Medical AI is launching a special issue focused on hybrid quantum-classical neural networks applied to medical imaging, drug discovery, and cancer diagnostics. Submission deadline: October 30, 2026.',
      date: '2026-05-15',
      category: 'Call for Papers',
      important: true
    },
    {
      id: 'ann-2',
      title: 'Auctores Academic Partners with ORCID for Automated Profile Synchronization',
      content: 'We are proud to announce full ORCID integration across our manuscript management system. Authors can now sync their peer review records, publication indexes, and biographical statements directly with a single click.',
      date: '2026-04-20',
      category: 'Policy',
      important: false
    },
    {
      id: 'ann-3',
      title: 'Annual Open Access Publishing Excellence Awards Announcement',
      content: 'Nominations are now open for our outstanding editors, top-cited reviewers, and highly-cited research authors of 2025. Award recipients will receive a complete fee waiver for their next three submissions.',
      date: '2026-05-01',
      category: 'Award',
      important: false
    }
  ];

  const testimonials: Testimonial[] = [
    {
      id: 'test-1',
      name: 'Prof. Helen Cartwright',
      role: 'Professor of Biophysics',
      affiliation: 'University of Oxford, UK',
      quote: 'Auctores is exceptional. The editorial desk provides incredibly prompt service, and the peer-review process is robust, deep, and constructive. My paper on mitochondrial transport received reviews within 21 days!',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Helen'
    },
    {
      id: 'test-2',
      name: 'Dr. Kenji Tanaka',
      role: 'Director of Machine Intelligence',
      affiliation: 'The University of Tokyo, Japan',
      quote: 'The metadata rendering and citations engine on Auctores is a generation ahead. It provides beautiful dashboard breakdowns of article views and PDF downloads, which helps me report impact metrics to my funding agency.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kenji'
    }
  ];

  const faqs: FAQ[] = [
    {
      id: 'faq-1',
      question: 'What is the standard peer-review model on Auctores?',
      answer: 'Auctores Academic employs a strict single-blind or double-blind peer-review workflow managed by our Section Editors. Every manuscript is evaluated by at least two independent international subject specialists.',
      category: 'General'
    },
    {
      id: 'faq-2',
      question: 'Are there charges for publishing in Auctores journals?',
      answer: 'Yes, as a fully Open Access publisher, we require an Article Processing Charge (APC) once a paper is accepted. This fee funds server infrastructures, professional typesetting, DOI registration, and permanent indexing.',
      category: 'Authors'
    },
    {
      id: 'faq-3',
      question: 'How do I synchronize my review contributions with ORCID?',
      answer: 'Go to your Reviewer Dashboard -> Notification & Profile Settings, click "Connect ORCID", and authorize Auctores Academic to write review records to your public ORCID account automatically upon review completion.',
      category: 'Reviewers'
    }
  ];

  // 8. Create Realistic Analytics Metrics
  const dailyMetrics: DailyMetric[] = Array.from({ length: 30 }).map((_, idx) => {
    const d = new Date();
    d.setDate(d.getDate() - (30 - idx));
    return {
      date: d.toISOString().split('T')[0],
      views: rng.intRange(1500, 3200),
      downloads: rng.intRange(300, 950),
      submissions: rng.intRange(2, 9)
    };
  });

  const totalViews = articles.reduce((acc, a) => acc + a.views, 0);
  const totalDownloads = articles.reduce((acc, a) => acc + a.downloads, 0);
  const citationsCount = articles.reduce((acc, a) => acc + a.citations, 0);

  const analytics: AnalyticsSummary = {
    totalViews,
    totalDownloads,
    totalSubmissions: 35 + articles.length,
    totalPublished: articles.length,
    acceptanceRateAvg: 28.5,
    averageReviewDays: 24.8,
    citationsCount,
    dailyMetrics,
    viewsByCategory: categories.map(c => ({
      category: c.name,
      count: rng.intRange(12000, 48000)
    })),
    submissionsByStatus: [
      { status: 'Published', value: articles.length },
      { status: 'Under Peer Review', value: 12 },
      { status: 'Revisions Requested', value: 8 },
      { status: 'Newly Submitted', value: 15 }
    ]
  };

  // 9. Notifications
  const notifications: AppNotification[] = [
    {
      id: 'not-1',
      userId: 'usr-author-1',
      title: 'Manuscript Status Update',
      message: 'Your manuscript "A Novel Investigation..." has been assigned to Section Editor Dr. Arthur Pendelton.',
      type: 'success',
      read: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'not-2',
      userId: 'usr-reviewer-1',
      title: 'New Review Invitation',
      message: 'You have been invited to review a manuscript for "Auctores Journal of Advanced Neurology".',
      type: 'submission',
      read: false,
      createdAt: new Date().toISOString()
    }
  ];

  return {
    users,
    categories,
    journals,
    articles,
    authors,
    editors,
    reviewers,
    submissions,
    notifications,
    announcements,
    testimonials,
    faqs,
    analytics
  };
}

// --- PERSISTENCE LAYER ---
const STORAGE_KEY = 'auctores_platform_db';

export function getLocalDB(): Database {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error('Failed to parse local DB storage', e);
      }
    }
  } catch (e) {
    console.error('localStorage is not available, using in-memory database', e);
  }
  const fresh = generateDatabase();
  try {
    saveLocalDB(fresh);
  } catch (e) {
    console.error('Could not save to localStorage, using in-memory database', e);
  }
  return fresh;
}

export function saveLocalDB(db: Database) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

export function resetLocalDB() {
  const fresh = generateDatabase();
  saveLocalDB(fresh);
  return fresh;
}
