/* =============================================================================
   cloud-style — CONTENT

   This is the only file you edit to make a new deck. index.html renders
   whatever is here; no other file needs to change.

   Source: https://cloudonair.withgoogle.com/

   SHAPE
     brand      wordmark split into a bold half and a regular half, plus the
                cover copy and the footer edition line
     categories the menu. Each has an icon id (see js/gc-icons.js), a title,
                and a list of facts / webinar sessions
     facts      each becomes a card on screen 03 and an article on screen 04,
                with an interactive live demo inside the phone mock.

   ICON IDS available out of the box:
     gc-icon-identity  gc-icon-catalog  gc-icon-support  gc-icon-mobile-check
     gc-icon-open  gc-icon-cloud  gc-icon-camera  gc-icon-video  gc-icon-sparkle
     gc-icon-mic  gc-icon-terminal  gc-icon-shield  gc-icon-database  gc-icon-chart
   ========================================================================== */

const CONTENT = {

  brand: {
    /* The wordmark split in two: bold prefix, light suffix. */
    wordmarkBold: 'Cloud ',
    wordmarkLight: 'on Air',

    /* Cover lede. First two lines render bold, last two regular.
       Break the lines yourself — this is a poster, not a paragraph. */
    ledeStrong: ['Webinars and', 'digital events'],
    ledeSoft:   ['to build and scale', 'on Google Cloud'],

    cta: 'Explore all sessions',
    edition: 'Cloud on Air 2026',

    /* Prefix for the miniature wordmark in each card header. */
    cardBold: 'Cloud ',
    cardLight: 'on Air',
  },

  categories: [
    {
      icon: 'gc-icon-identity',
      title: 'Generative AI and Intelligent Agents',
      facts: [
        {
          title: 'Enterprise generative AI moves from sandbox exploration to production agents',
          lede: 'The future of enterprise software is agentic.',
          body: 'Modern organizations are replacing monolithic workflows with autonomous Gemini agents capable of multi-step reasoning, real-time data retrieval, and deterministic tool execution. In this track, Google Cloud engineers demonstrate how Vertex AI Agent Builder connects foundation models directly to enterprise databases, internal APIs, and secure grounding services. Learn how leading teams achieve sub-second latency and zero-shot accuracy while enforcing strict enterprise safety filters and governance policies in live customer-facing deployments.',
          tag: '#GenAI',
          live: true,
          demo: 'chat',
        },
        {
          title: 'Multimodal models process video, audio and documents in unified pipelines',
          lede: 'Context is no longer confined to plain text.',
          body: 'Gemini 1.5 Pro and Flash introduce massive context windows that ingest hours of audio, full-length video recordings, and hundreds of pages of technical documentation in a single prompt. This session details architectural best practices for building retrieval-augmented generation systems without complex chunking pipelines. We explore real-world benchmarks comparing long-context ingestion against vector search, showing where native context reasoning outperforms traditional embeddings.',
          tag: '#Multimodal',
          live: true,
          demo: 'video',
        },
        {
          title: 'Model customization with parameter-efficient tuning and RLHF',
          lede: 'Domain expertise requires tailored foundation weights.',
          body: 'Off-the-shelf models provide strong baselines, but enterprise domain tasks demand specialized vocabulary, deterministic structured outputs, and compliance alignment. We examine supervised fine-tuning, LoRA adapters, and reinforcement learning from human feedback on Vertex AI. Discover how organizations achieve domain mastery with less than a thousand curated training pairs while preserving base model reasoning capabilities and keeping inference costs predictable.',
          tag: '#VertexAI',
          live: false,
          demo: 'metrics',
        },
      ],
    },

    {
      icon: 'gc-icon-catalog',
      title: 'Application Modernization and Cloud Native',
      facts: [
        {
          title: 'Automating Kubernetes operations with GKE autopilot and AI orchestration',
          lede: 'Infrastructure management should disappear behind workloads.',
          body: 'Managing worker node pools, resource bin-packing, and security hardening at scale drains engineering velocity. GKE Autopilot manages node provisioning, automatic cluster upgrades, and SLA-backed security posture out of the box. In this technical deep dive, discover how teams run complex microservices and GPU-accelerated inference workloads side by side with automated vertical pod autoscaling, zero-downtime cluster maintenance, and optimized resource utilization.',
          tag: '#Kubernetes',
          live: true,
          demo: 'metrics',
        },
        {
          title: 'Serverless container execution with Cloud Run and event-driven architectures',
          lede: 'Pay only for the exact milliseconds your code executes.',
          body: 'Cloud Run brings container flexibility to serverless scale, automatically ramping from zero to thousands of concurrent instances in seconds. We walk through building resilient event-driven microservices using Eventarc, Cloud Pub/Sub, and Cloud Tasks. Learn how to configure direct VPC egress, WebSockets, background processing, and custom domain routing without managing underlying virtual machines or orchestration control planes.',
          tag: '#Serverless',
          live: true,
          demo: 'buttons',
        },
        {
          title: 'Accelerating developer velocity with continuous delivery and Cloud Build',
          lede: 'High-performing teams release code safely multiple times a day.',
          body: 'Modern continuous delivery pipelines must balance rapid deployment cycles with strict compliance and security gates. This session demonstrates automated multi-environment delivery pipelines using Cloud Build and Cloud Deploy. Explore binary authorization, vulnerability scanning during container image builds, canary release strategies, and automated rollbacks driven by real-time Cloud Monitoring metrics.',
          tag: '#DevOps',
          live: false,
          demo: 'video',
        },
      ],
    },

    {
      icon: 'gc-icon-support',
      title: 'Data Analytics and Real-Time Intelligence',
      facts: [
        {
          title: 'Unified data lakehouses combining structured data and object storage',
          lede: 'Analytics should span all data without copying or silos.',
          body: 'BigQuery Studio unifies SQL analytics, Python dataframes, and machine learning models in a single serverless workspace. We explore how BigQuery open table formats like Iceberg, Delta Lake, and Hudi allow ad-hoc analytical queries directly over Cloud Storage data lakes with zero data movement. Learn how decoupled compute architecture scales instantly during peak workloads while keeping storage costs optimized through automatic physical compression.',
          tag: '#BigQuery',
          live: true,
          demo: 'metrics',
        },
        {
          title: 'Streaming analytics and anomaly detection with Dataflow and Pub/Sub',
          lede: 'Insights lose value when insights arrive hours after the event.',
          body: 'Processing millions of real-time transactions per second requires autoscaling stream pipelines with exactly-once processing guarantees. This webinar explores Apache Beam pipelines on Dataflow paired with Google Cloud Pub/Sub. We showcase real-time fraud detection architectures, dynamic windowing calculations, session aggregation, and automatic dead-letter queue management under unpredictable traffic spikes.',
          tag: '#Dataflow',
          live: true,
          demo: 'camera',
        },
        {
          title: 'Governing enterprise data with Dataplex catalog and automated lineage',
          lede: 'Trusted data requires end-to-end lineage and automated discovery.',
          body: 'As data assets multiply across regions and clouds, understanding data provenance and security access becomes critical for compliance. Dataplex provides automated metadata harvesting, data profiling, and policy propagation across lakes, warehouses, and databases. We explore how to implement automated column-level data masking, sensitive data protection rules, and lineage graphs that trace data transformations from source to dashboard.',
          tag: '#Governance',
          live: false,
          demo: 'chat',
        },
      ],
    },

    {
      icon: 'gc-icon-mobile-check',
      title: 'Security, Zero Trust and Cloud Governance',
      facts: [
        {
          title: 'Zero Trust security architectures with BeyondCorp Enterprise',
          lede: 'Perimeter defense is replaced by continuous identity validation.',
          body: 'Modern security treats every network as untrusted and verifies every user, device, and request context dynamically. BeyondCorp Enterprise enforces context-aware access to cloud workloads and SaaS applications without requiring traditional VPN client software. We review threat prevention policies, integrated Chrome enterprise protections, data loss prevention rules, and real-time device health posture evaluations.',
          tag: '#ZeroTrust',
          live: true,
          demo: 'security',
        },
        {
          title: 'AI-driven threat detection and automated response with Mandiant intelligence',
          lede: 'Security operations must outpace automated adversaries.',
          body: 'Security Command Center Premium integrates frontline threat intelligence from Mandiant with Google-scale machine learning to identify active attack paths and misconfigurations. This deep dive demonstrates how SecOps teams investigate security findings, correlate multi-cloud security telemetry, and trigger automated remediation workflows to isolate compromised resources before lateral movement occurs.',
          tag: '#SecOps',
          live: false,
          demo: 'security',
        },
      ],
    },

    {
      icon: 'gc-icon-open',
      title: 'Infrastructure and Cloud Cost Optimization',
      facts: [
        {
          title: 'Architecting resilient multi-region infrastructure on Google Cloud',
          lede: 'Global availability begins with private fiber infrastructure.',
          body: 'Google Cloud\'s global private software-defined network connects worldwide regions with high bandwidth, low latency, and built-in DDoS protection. In this session, cloud architects walk through designing active-active multi-region topologies using Cloud Load Balancing, Cloud Spanner, and Global Virtual Private Cloud. Discover how single anycast IP addresses route user traffic to the nearest healthy backend automatically.',
          tag: '#Infrastructure',
          live: false,
          demo: 'metrics',
        },
        {
          title: 'FinOps practices and automated cost intelligence for cloud workloads',
          lede: 'Cloud financial management turns cost data into engineering decisions.',
          body: 'Effective cloud cost optimization combines automated resource rightsizing with transparent organizational FinOps practices. We review committed use discounts, custom machine types, spot instances, and BigQuery billing exports. Learn how engineering teams build automated budget alerts, anomaly detection dashboards, and automated idle resource cleanups to maximize ROI across growing cloud footprints.',
          tag: '#FinOps',
          live: true,
          demo: 'buttons',
        },
      ],
    },
  ],
};
