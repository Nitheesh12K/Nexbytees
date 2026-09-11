import { PrismaClient, Role, NewsDomain, NewsStatus, UploadStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting NEXBYTEES database seed...');

  const passwordHash = await bcrypt.hash('nexbytees2026', 10);

  // 1. Seed Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@nexbytees.com' },
    update: {},
    create: {
      name: 'NEXBYTEES Chief Editor',
      username: 'chief_editor',
      email: 'admin@nexbytees.com',
      passwordHash,
      role: Role.ADMIN,
      bio: 'Executive Editorial Director at NEXBYTEES Technology Wire.',
      techInterests: ['AI', 'Quantum', 'Semiconductors', 'Robotics'],
    },
  });

  const editor = await prisma.user.upsert({
    where: { email: 'editor@nexbytees.com' },
    update: {},
    create: {
      name: 'Elena Rostova',
      username: 'elena_tech',
      email: 'editor@nexbytees.com',
      passwordHash,
      role: Role.EDITOR,
      bio: 'Senior AI and Semiconductor Research Correspondent.',
      techInterests: ['AI', 'Semiconductors'],
    },
  });

  const reader = await prisma.user.upsert({
    where: { email: 'reader@nexbytees.com' },
    update: {},
    create: {
      name: 'Marcus Vance',
      username: 'marcus_v',
      email: 'reader@nexbytees.com',
      passwordHash,
      role: Role.USER,
      bio: 'Distributed systems engineer & avid tech intelligence reader.',
      techInterests: ['Cloud', 'Software'],
    },
  });

  const demoAlex = await prisma.user.upsert({
    where: { email: 'alex@nexbytees.com' },
    update: {},
    create: {
      name: 'Alex Vance',
      username: 'alex_vance',
      email: 'alex@nexbytees.com',
      passwordHash: await bcrypt.hash('password123', 10),
      role: Role.CONTRIBUTOR,
      bio: 'Senior Intelligence Contributor & technology researcher.',
      techInterests: ['AI', 'Quantum', 'Robotics'],
    },
  });

  // User preferences
  await prisma.userPreferences.upsert({
    where: { userId: reader.id },
    update: {},
    create: {
      userId: reader.id,
      preferredDomains: [NewsDomain.AI, NewsDomain.SOFTWARE, NewsDomain.CLOUD],
      preferredTags: ['Kubernetes', 'LLMs', 'Rust'],
      theme: 'dark',
    },
  });

  // 2. Seed Realistic News Articles
  const articlesData = [
    {
      title: 'Apple Expands Vision Ecosystem with Next-Gen Spatial Micro-OLED Silicon',
      slug: 'apple-expands-vision-ecosystem-micro-oled-silicon',
      description: 'Advanced 4K per-eye micro-OLED silicon fabrication achieves 5,000 nits peak brightness with lower thermal footprint.',
      content: `Apple hardware engineering teams have finalized testing on second-generation spatial silicon sensors designed to power future mixed-reality headsets.

Fabricated on advanced 3nm substrate interconnects, the breakthrough achieves 5,000 nits peak luminance while slashing standby power dissipation by 38%.

### Architectural Highlights
- Dual-eye micro-OLED matrix with sub-millimeter pixel pitch.
- Real-time foveated rendering acceleration directly integrated into the display silicon driver.
- Low-latency optical tracking engine operating below 8ms photon-to-motion lag.

Industry analysts forecast initial deployment in enterprise geospatial and surgical simulation environments by late 2026.`,
      imageUrl: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?q=80&w=1200&auto=format&fit=crop',
      sourceName: 'Spatial Engineering Report',
      sourceUrl: 'https://nexbytees.com/spatial-silicon',
      domain: NewsDomain.GADGETS,
      tags: ['Apple', 'Hardware', 'AR / VR', 'Silicon'],
      authorId: editor.id,
      viewCount: 1420,
      saveCount: 312,
      shareCount: 184,
      trendingScore: 98.5,
    },
    {
      title: 'Autonomous Navigation Networks Reach 100 Billion Simulated Miles Benchmark',
      slug: 'autonomous-navigation-networks-100-billion-miles',
      description: 'End-to-end neural motion planners reduce disengagement rates by 92% across edge-case meteorological testbeds.',
      content: `Pioneering robotics mobility clusters have announced the completion of over 100 billion photorealistic simulated miles using generative world models.

The reinforcement learning pipeline replaces fragmented heuristics with a unified vision-to-actuation transformer, demonstrating human-level situational recovery under whiteout blizzards and heavy monsoon conditions.

### Benchmark Data
- Over 92% reduction in intervention necessity.
- Sub-50 millisecond decision loop executed on automotive-grade low-power neural accelerators.
- Open validation datasets released for university research labs.`,
      imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1200&auto=format&fit=crop',
      sourceName: 'Robotics Intelligence Review',
      sourceUrl: 'https://nexbytees.com/autonomous-navigation',
      domain: NewsDomain.ROBOTICS,
      tags: ['Robotics', 'Autonomous', 'AI', 'Edge Computing'],
      authorId: editor.id,
      viewCount: 1890,
      saveCount: 420,
      shareCount: 260,
      trendingScore: 99.2,
    },
    {
      title: 'Hyperscale Cloud Providers Deploy Liquid-Cooled Optical Interconnect Superclusters',
      slug: 'hyperscale-liquid-cooled-optical-interconnects',
      description: 'Co-packaged optics eliminate copper interconnect bottlenecks across 100,000-accelerator AI clusters.',
      content: `Global cloud infrastructure operators have commissioned the first commercial liquid-cooled AI superclusters featuring co-packaged optics (CPO).

By routing optical waveguides directly onto the multi-chip module substrate, latency across tensor parallel nodes drops by an order of magnitude while saving 24 megawatts of electrical overhead per cluster.`,
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop',
      sourceName: 'Infrastructure Computing Wire',
      sourceUrl: 'https://nexbytees.com/optical-superclusters',
      domain: NewsDomain.CLOUD,
      tags: ['Cloud', 'GPUs & Infrastructure', 'Semiconductors'],
      authorId: admin.id,
      viewCount: 950,
      saveCount: 198,
      shareCount: 110,
      trendingScore: 94.0,
    },
    {
      title: 'Zero-Knowledge Cryptographic Enclaves Safeguard Multi-Tenant Machine Learning Workloads',
      slug: 'zk-cryptographic-enclaves-multi-tenant-ml',
      description: 'Hardware-verified confidential computing enables training on encrypted biomedical datasets without decryption leakage.',
      content: `Cryptographic research institutions have unveiled an open-standard zero-knowledge hardware enclave architecture capable of training multi-billion parameter neural networks over fully homomorphic and encrypted telemetry streams.`,
      imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
      sourceName: 'Cyber Defense Journal',
      sourceUrl: 'https://nexbytees.com/zk-enclaves',
      domain: NewsDomain.CYBERSECURITY,
      tags: ['Cybersecurity', 'Cryptography', 'Privacy', 'AI'],
      authorId: editor.id,
      viewCount: 1120,
      saveCount: 280,
      shareCount: 145,
      trendingScore: 95.8,
    },
    {
      title: 'Topological Quantum Qubits Maintain Coherence Beyond Millisecond Threshold in Silicon',
      slug: 'topological-quantum-qubits-silicon-coherence',
      description: 'Majorana zero-mode zero-field states engineered on standard complementary metal-oxide-semiconductor foundry wafers.',
      content: `Experimental physicists have demonstrated topological protection in silicon-germanium nanostructures, exceeding the critical fault-tolerance coherence threshold necessary for scalable surface code correction.`,
      imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200&auto=format&fit=crop',
      sourceName: 'Quantum Physical Review',
      sourceUrl: 'https://nexbytees.com/topological-quantum',
      domain: NewsDomain.QUANTUM,
      tags: ['Quantum', 'Physics', 'Semiconductors'],
      authorId: admin.id,
      viewCount: 840,
      saveCount: 210,
      shareCount: 95,
      trendingScore: 92.1,
    },
  ];

  for (const article of articlesData) {
    await prisma.newsArticle.upsert({
      where: { slug: article.slug },
      update: {},
      create: article,
    });
  }

  // 3. Seed a Sample User Upload
  await prisma.userUpload.create({
    data: {
      userId: reader.id,
      title: 'Open Source RISC-V Neural Core Achieves 2.4 TOPS in 12nm Test Chip',
      description: 'Community hardware collective successfully tapes out custom edge-AI accelerator with full open-source toolchain.',
      content: 'A distributed collective of open-source silicon designers has confirmed successful silicon bring-up of an open RISC-V tensor core.',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
      sourceName: 'Open Silicon Initiative',
      sourceUrl: 'https://nexbytees.com/open-silicon',
      domain: NewsDomain.SEMICONDUCTORS,
      tags: ['Open Source', 'RISC-V', 'Semiconductors'],
      status: UploadStatus.PENDING,
    },
  });

  console.log('✅ NEXBYTEES database seed completed successfully.');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
