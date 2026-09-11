import { NewsItem } from "@/types";

export const MOCK_NEWS_STORIES: NewsItem[] = [
  // Trending Stories from Screenshot
  {
    id: "nb-xpeng-iron",
    title: "XPeng Begins Mass Production of IRON Humanoid Robots",
    summary: "XPeng has launched a dedicated assembly line for its IRON humanoid robot, aiming for industrial tasks and commercial manufacturing deployments.",
    content: `Chinese electric vehicle pioneer XPeng announced today that its dedicated commercial assembly facility for the "IRON" bipedal humanoid robot has officially commenced mass production. 

Equipped with Turing AI chips delivering 3,000 TOPS of localized compute, over 60 degrees of freedom, and biomimetic tactile hands, IRON is designed to operate on vehicle assembly lines to handle repetitive, hazardous, and ergonomically challenging manufacturing tasks.

### Industrial Assembly Integration

Initial production batches will be deployed directly within XPeng's Zhaoqing smart EV factory to manage material unpalletizing, instrument harness routing, and automated visual quality control. 

"Humanoid robots represent the ultimate physical manifestation of our AI architecture," stated XPeng Chairman He Xiaopeng during the production line unveiling. "By sharing the same autonomous driving vision models and neural network stack as our intelligent vehicles, IRON achieves unprecedented spatial awareness on dynamic factory floors."`,
    domain: "Robotics",
    source: "TechCrunch",
    author: "Rita Liao",
    publishedAt: "2h ago",
    readTime: "3 min read",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop",
    trendingBadge: "TRENDING",
    trendingScore: 99.2,
    viewsCount: 54200,
    tags: ["Robotics", "Humanoid", "XPeng", "Industrial Automation", "AI"],
    keyTakeaways: [
      "Dedicated assembly line starts mass manufacturing for XPeng IRON humanoid robot.",
      "Powered by custom Turing AI silicon with 3,000 TOPS and end-to-end vision-action policies.",
      "Initial units deployed directly in automotive manufacturing plants for harness and parts handling.",
    ],
  },
  {
    id: "nb-nvidia-chip",
    title: "NVIDIA Unveils Next-Gen AI Chip Architecture",
    summary: "A new architecture designed for massive AI inference workloads and multi-trillion parameter model reasoning chains with unprecedented energy efficiency.",
    content: `At its global architecture keynote, NVIDIA unveiled its latest flagship accelerator platform engineered specifically for the explosive growth of test-time compute, agentic reasoning, and real-time multimodal inference.

The architecture integrates next-generation High Bandwidth Memory (HBM4) offering 14 Terabytes per second of raw bandwidth and ultra-dense 4-bit floating point (FP4) Tensor Cores that quadruple inference throughput compared to current generation Hopper and Blackwell clusters.

### Conquering the Inference Frontier

As frontier AI transitions from pre-training toward dynamic multi-step reasoning, inference computational requirements have scaled exponentially. 

"Inference is no longer just predicting the next single token; it is executing complex verification trees and tool-calling loops," said NVIDIA CEO Jensen Huang. "This new architecture delivers a 30x reduction in operational inference cost, making true agentic intelligence economically viable for every enterprise."`,
    domain: "Semiconductors",
    source: "The Verge",
    author: "Tom Warren",
    publishedAt: "4h ago",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop",
    trendingBadge: "HOT",
    trendingScore: 97.8,
    viewsCount: 48900,
    tags: ["NVIDIA", "Semiconductors", "Inference", "GPUs", "Hardware"],
    keyTakeaways: [
      "Next-generation silicon architecture tailored specifically for long-horizon test-time reasoning.",
      "HBM4 memory provides over 14 TB/s throughput to overcome the memory wall bottleneck.",
      "Delivers up to 30x lower token cost on massive multi-trillion parameter model clusters.",
    ],
  },
  {
    id: "nb-google-quantum",
    title: "Google Makes Progress in Quantum Error Correction",
    summary: "A significant step toward practical quantum computing at scale by demonstrating logical qubit error rates below the physical fault-tolerance threshold.",
    content: `Google Quantum AI researchers announced a groundbreaking milestone in peer-reviewed findings, showing that increasing the number of physical qubits in a surface code systematically suppresses computational errors—a prerequisite for building commercially useful, fault-tolerant quantum computers.

Utilizing their latest superconducting processor with 105 physical qubits, the team demonstrated a distance-5 logical qubit that achieves lower error rates than any individual physical component from which it was constructed.

### Crossing the Fault-Tolerance Threshold

"For decades, the fundamental open question was whether scaling up quantum systems would introduce more environmental noise than error correction could suppress," explained Dr. Julian Kelly, Director of Quantum Hardware. "Our results confirm that quantum error correction works mathematically and physically in silicon."`,
    domain: "Quantum Computing",
    source: "Google Blog",
    author: "Julian Kelly",
    publishedAt: "6h ago",
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200&auto=format&fit=crop",
    trendingBadge: "RISING",
    trendingScore: 95.4,
    viewsCount: 39600,
    tags: ["Quantum", "Google", "Error Correction", "Physics", "Logical Qubits"],
    keyTakeaways: [
      "Logical qubit demonstrated with error rates lower than underlying physical qubits.",
      "Validated distance-5 surface code on superconducting 105-qubit processor.",
      "Paves the clear technological runway toward million-qubit commercial quantum mainframes.",
    ],
  },
  {
    id: "nb-meta-agents",
    title: "Meta's New AI Models Power Next-Gen Agents",
    summary: "Meta introduces a new family of models focused on real-world tasks, code verification, and multi-step autonomous tool orchestration with open weights.",
    content: `Meta AI Research unveiled its new flagship agentic model family designed specifically to perform autonomous actions across complex operating systems and enterprise applications.

Unlike traditional text completion models, these architectures incorporate specialized latent reasoning tokens and native computer-vision screen navigation, enabling them to interpret graphical user interfaces (GUIs), resolve terminal errors, and execute cross-platform workflows.

### Open Access for Global Developers

In keeping with Meta's open-science commitment, model weights and training recipes are being made accessible for academic and commercial use under the community license.

"Autonomous agents must be auditable, controllable, and capable of operating safely within local user environments," noted Yann LeCun, Chief AI Scientist. "Open model architectures allow the global engineering community to stress-test safeguards and build specialized agents for diverse technical ecosystems."`,
    domain: "Artificial Intelligence",
    source: "Meta Newsroom",
    author: "Alex Heath",
    publishedAt: "6h ago",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    trendingBadge: null,
    trendingScore: 93.6,
    viewsCount: 36200,
    tags: ["Meta", "AI Agents", "Open Source", "Reasoning", "LLMs"],
    keyTakeaways: [
      "New open-weight models optimized natively for tool use, screen parsing, and OS navigation.",
      "Latent chain-of-thought verification prevents hallucinated actions on user machines.",
      "Permissive release allows private on-premise enterprise deployments without cloud dependency.",
    ],
  },
  {
    id: "nb-spacex-starship",
    title: "SpaceX Prepares for Next Starship Test Flight",
    summary: "Final hardware integration completed ahead of launch as SpaceX targets propellant transfer in orbit and high-altitude thermal tile validation.",
    content: `At Starbase in Boca Chica, Texas, SpaceX teams have stacked Flight 6 of the colossal Starship and Super Heavy booster rocket on the orbital launch mount.

The upcoming mission represents the most technically daring flight profile yet, featuring the first in-space reignition of a Raptor engine in orbit, advanced thermal heat-shield tile stress tests under steep reentry angles, and catch tower mechanical synchronization.

### The Path to Orbital Refueling and Mars

Starship is designed to be fully and rapidly reusable, capable of transporting 150 metric tons of payload to orbit. Establishing reliable booster catches with the launch tower's "chopsticks" mechanical arms drastically compresses turnaround time between flights.

NASA is closely monitoring the mission, as Starship serves as the Human Landing System (HLS) for the upcoming Artemis III crewed lunar landing mission.`,
    domain: "Space Technology",
    source: "SpaceNews",
    author: "Jeff Foust",
    publishedAt: "12h ago",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1517976487502-d7102dcd795d?q=80&w=1200&auto=format&fit=crop",
    trendingBadge: null,
    trendingScore: 91.0,
    viewsCount: 32800,
    tags: ["Space", "SpaceX", "Starship", "Aerospace", "Propulsion"],
    keyTakeaways: [
      "Hardware stacked and verified for upcoming Flight 6 integrated orbital test.",
      "Flight objectives include Raptor vacuum reignition in orbit and acute thermal shield tests.",
      "Artemis III lunar landing timeline tied to Starship orbital refueling milestones.",
    ],
  },

  // Latest Stories from Screenshot
  {
    id: "nb-apple-vision",
    title: "Apple's Next-Gen Vision Pro Could Arrive in 2025",
    summary: "New reports suggest a lighter, more powerful Vision Pro with AI-first features, updated M5 silicon, and streamlined ergonomic dual-loop headband straps.",
    content: `Supply chain disclosures and Cupertino insider reports indicate that Apple is accelerating the launch roadmap for its second-generation spatial computing headset.

Targeted for late 2025, the updated Vision Pro addresses primary user feedback by reducing overall device weight by 24% through carbon-fiber chassis reinforcement and magnesium alloy micro-displays.

### Apple Intelligence in Spatial Canvas

Powered by the forthcoming M5 processor, the device will incorporate multimodal Apple Intelligence natively into visionOS, allowing the headset to transcribe real-world physical blueprints into editable 3D USDZ assets and predict eye gaze intent before finger pinches occur.`,
    domain: "Consumer Electronics",
    source: "MacRumors",
    author: "Juli Clover",
    publishedAt: "1h ago",
    readTime: "3 min read",
    imageUrl: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1200&auto=format&fit=crop",
    trendingScore: 92.1,
    viewsCount: 28400,
    tags: ["Apple", "Vision Pro", "Spatial Computing", "Hardware", "Consumer Electronics"],
    keyTakeaways: [
      "24% reduction in overall headset weight with redesigned carbon-fiber acoustic temples.",
      "Powered by next-generation M5 processor with dedicated spatial neural engine.",
      "Predictive gaze intent models eliminate micro-delays during visionOS navigation.",
    ],
  },
  {
    id: "nb-tesla-fsd",
    title: "Tesla Expands FSD Testing to New Global Markets",
    summary: "Tesla begins testing its Full Self-Driving system in additional countries as end-to-end neural network models prove resilient across varied road geometries.",
    content: `Tesla has officially initiated supervised Full Self-Driving (FSD) fleet validation trials across selected European and Asian metropolitan areas.

The expansion marks the transition of Tesla's autonomous software to Version 13, which relies entirely on unified end-to-end neural networks trained on millions of video clips rather than hundreds of thousands of lines of explicit C++ heuristic driving code.

### Cross-Border Vision Adaptability

Regulatory bodies in Germany, the UK, and Japan have granted testing permits to monitor how the pure-vision neural network navigates complex roundabouts, narrow medieval alleys, and multi-tiered highway interchanges without high-definition HD maps.`,
    domain: "Autonomous Vehicles",
    source: "Reuters",
    author: "Victoria Waldersee",
    publishedAt: "2h ago",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1200&auto=format&fit=crop",
    trendingScore: 89.5,
    viewsCount: 25100,
    tags: ["Tesla", "Autonomous Vehicles", "FSD", "Neural Networks", "Mobility"],
    keyTakeaways: [
      "Supervised FSD test trials launched in European and Asian markets.",
      "Version 13 leverages pure end-to-end video neural nets with zero heuristic code rules.",
      "Demonstrates high generalization across foreign road signs and lane geometries without HD maps.",
    ],
  },
  {
    id: "nb-aws-infra",
    title: "AWS Launches New AI Infrastructure Region",
    summary: "A major expansion to support the next generation of AI workloads with hundred-thousand-GPU clusters and direct hydroelectric zero-carbon power.",
    content: `Amazon Web Services (AWS) announced the commercial availability of a dedicated multi-facility cloud region built solely to support large-scale foundation model pre-training and high-velocity inference workloads.

The infrastructure region features clusters of NVIDIA Blackwell ultra-servers linked by AWS's proprietary 3.2 Tbps Elastic Fabric Adapter (EFA) networking fabrics, backed by redundant 2-gigawatt clean energy power purchase agreements.

### Sustainable Megawatt Scale

With datacenters consuming a growing proportion of global electricity, AWS integrated direct-to-chip evaporative cooling that operates with a Power Usage Effectiveness (PUE) ratio of 1.08, virtually eliminating water consumption in cooling loops.`,
    domain: "Cloud Computing",
    source: "AWS Blog",
    author: "Matt Wood",
    publishedAt: "3h ago",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop",
    trendingScore: 88.0,
    viewsCount: 22400,
    tags: ["Cloud", "AWS", "Datacenter", "AI Infrastructure", "Energy"],
    keyTakeaways: [
      "Dedicated AI cloud region with 3.2 Tbps EFA low-latency interconnect.",
      "100% powered by dedicated hydroelectric and nuclear zero-carbon facilities.",
      "PUE ratio of 1.08 sets new efficiency benchmark for gigawatt datacenter architecture.",
    ],
  },
  {
    id: "nb-ai-agents-tasks",
    title: "AI Agents Are Moving From Chatbots to Real-World Tasks",
    summary: "A new wave of AI agents is entering enterprise and industrial workflows, handling multi-step terminal execution, data pipelines, and code verification.",
    content: `The paradigm of artificial intelligence is experiencing its most decisive transformation since the emergence of transformer architectures. Enterprise software leaders are transitioning en masse to autonomous agentic systems capable of orchestrating complex real-world workflows without human intervention.

These autonomous agents operate on recursive reasoning loops—planning, executing, evaluating their own outputs, and iteratively self-correcting when encountering edge cases or build failures.`,
    domain: "AI Agents",
    source: "MIT Technology Review",
    author: "Will Douglas Heaven",
    publishedAt: "4h ago",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop",
    trendingScore: 94.2,
    viewsCount: 31000,
    tags: ["AI Agents", "Automation", "Workflows", "Enterprise", "Reasoning"],
    keyTakeaways: [
      "AI shifts from passive text answers to active tool and terminal execution.",
      "Recursive planning and verification loops boost task completion to over 84%.",
      "Enterprise safeguards utilize deterministic sandboxes for irreversible steps.",
    ],
  },
  {
    id: "nb-satellite-network",
    title: "New Satellite Network Aims to Bring Global Internet Access",
    summary: "A next-generation satellite constellation could connect remote regions worldwide with optical laser cross-links delivering sub-20ms latency.",
    content: `Space telecommunications companies have begun deploying the first operational shells of their next-generation low Earth orbit (LEO) mega-constellations.

Equipped with space-to-space inter-satellite optical laser links, the constellation routes internet packets through the vacuum of space at the speed of light, bypassing subterranean fiber chokepoints and connecting remote islands, polar outposts, and maritime routes.`,
    domain: "Space Technology",
    source: "BBC News",
    author: "Jonathan Amos",
    publishedAt: "5h ago",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
    trendingScore: 87.4,
    viewsCount: 20100,
    tags: ["Space", "Satellites", "Telecommunications", "Laser Links", "Connectivity"],
    keyTakeaways: [
      "Inter-satellite optical laser links eliminate the need for ground relay stations.",
      "Speed-of-light vacuum transmission yields sub-20ms latency across continents.",
      "Brings true high-bandwidth gigabit broadband to underserved polar and oceanic regions.",
    ],
  },
  {
    id: "nb-cyber-ai-threats",
    title: "AI Helps Security Teams Detect Threats 60% Faster",
    summary: "New tools are using AI to reduce response times, identify zero-day memory corruption bugs, and automatically formulate verified firewall patches.",
    content: `Cybersecurity defense perimeters have turned over frontline anomaly detection and remediation to autonomous AI agents.

Operating at the kernel, compiler, and network edge levels, these specialized models ingest real-time packet telemetry, synthesize symbolic execution traces to verify whether a suspicious packet payload is weaponizable, and automatically deploy non-breaking defensive rules in seconds.`,
    domain: "Cybersecurity",
    source: "Wired",
    author: "Lily Hay Newman",
    publishedAt: "6h ago",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop",
    trendingScore: 90.3,
    viewsCount: 26700,
    tags: ["Cybersecurity", "Zero-Day", "Infosec", "Automation", "Defense"],
    keyTakeaways: [
      "Autonomous systems detect zero-day exploits and deploy verified mitigations in seconds.",
      "Reduces mean time to remediate (MTTR) by over 60% across hybrid cloud fleets.",
      "Eliminates alert fatigue by filtering out 98% of false positive telemetry spikes.",
    ],
  },
];
