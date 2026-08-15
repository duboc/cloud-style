/* =============================================================================
   cloud-style — CONTENT (Google Cloud Summit Brasil 2026 Edition)

   This is the only file you edit to make a new deck. index.html renders
   whatever is here; no other file needs to change.

   Source: Google Cloud Summit Brasil 2026 Keynote & Showcase Guidelines

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

window.CONTENT = {

  brand: {
    /* The wordmark split in two: bold prefix, light suffix (~10 chars total). */
    wordmarkBold: 'Summit ',
    wordmarkLight: 'Brasil',

    /* Cover lede. First two lines render bold, last two regular.
       Break the lines yourself — this is a poster, not a paragraph. */
    ledeStrong: ['A Empresa Agêntica', 'em escala'],
    ledeSoft:   ['Workflows inteligentes e IA', 'no Google Cloud'],

    cta: 'Explorar sessoes e demos',
    edition: 'Google Cloud Summit Brasil 2026',

    /* Prefix for the miniature wordmark in each card header. */
    cardBold: 'Summit ',
    cardLight: 'Brasil',
  },

  categories: [
    {
      icon: 'gc-icon-identity',
      title: 'Agentes de IA e Empresa Agêntica',
      facts: [
        {
          title: 'IA Generativa evolui de protótipos para agentes autônomos em produção',
          lede: 'O futuro dos sistemas corporativos é orientado por agentes inteligentes.',
          body: 'Organizações modernas estão substituindo fluxos de trabalho monolíticos por agentes autônomos alimentados pelo Gemini 3.1 Pro. No Vertex AI Agent Builder, modelos de fundação conectam-se diretamente a bancos de dados corporativos, APIs internas e serviços de grounding seguros. Descubra como equipes líderes alcançam baixíssima latência e máxima precisão ao executar tarefas complexas multi-etapas enquanto aplicam políticas de governança e segurança corporativa em tempo real.',
          tag: '#AgentesIA',
          live: true,
          demo: 'chat',
        },
        {
          title: 'Modelos multimodais processam vídeo, áudio e documentos em contexto estendido',
          lede: 'O contexto corporativo unifica todas as mídias em uma única chamada.',
          body: 'O Gemini 3.1 Flash-Lite traz uma janela de contexto massiva capaz de analisar horas de vídeo, gravações de áudio e centenas de páginas de documentação técnica em um único prompt. Esta sessão apresenta arquiteturas de RAG sem necessidade de fragmentação complexa de dados. Comparamos o processamento direto de contextos longos contra busca vetorial tradicional, demonstrando ganhos massivos de desempenho em produção.',
          tag: '#Multimodal',
          live: true,
          demo: 'video',
        },
        {
          title: 'Geração visual e customização de modelos abertos com Gemma 3',
          lede: 'Modelos ajustados garantem precisão técnica e contexto em português.',
          body: 'Combinando o Nano Banana 2 para geração e edição visual de alta fidelidade com variantes do Gemma 3 otimizadas para português, o Vertex AI permite personalizar weights de fundação com fine-tuning eficiente e LoRA. Veja como empresas no Brasil criam experiências visuais e conversacionais sob medida preservando a privacidade dos dados corporativos.',
          tag: '#Gemma3',
          live: false,
          demo: 'camera',
        },
      ],
    },

    {
      icon: 'gc-icon-catalog',
      title: 'Infraestrutura Moderna e AI Hypercomputer',
      facts: [
        {
          title: 'Orquestração de workloads de IA com GKE Autopilot e TPUs Ironwood',
          lede: 'A infraestrutura de nuvem se adapta automaticamente à demanda de IA.',
          body: 'A sétima geração de TPUs Ironwood e os clusters GKE Autopilot eliminam a complexidade de gerenciamento de nós e alocação de GPUs/TPUs. O GKE Autopilot cuida do provisionamento, atualizações de cluster e postura de segurança com SLA garantido. Veja como treinar e servir modelos em larga escala com otimização automática de custos e escalabilidade vertical instantânea.',
          tag: '#Kubernetes',
          live: true,
          demo: 'metrics',
        },
        {
          title: 'Arquiteturas orientadas a eventos e execução serverless no Cloud Run',
          lede: 'Escale de zero a milhares de instâncias pagando apenas pelo tempo de execução.',
          body: 'O Cloud Run traz flexibilidade de contêineres para a escala serverless, integrando-se nativamente com Eventarc, Cloud Pub/Sub e Cloud Tasks. Demonstramos como construir microserviços resilientes com acesso direto à VPC, suporte a WebSockets e roteamento de domínios personalizados sem a necessidade de gerenciar servidores ou planos de controle.',
          tag: '#Serverless',
          live: true,
          demo: 'buttons',
        },
        {
          title: 'DevOps e automação de pipelines de entrega com Cloud Build e Deploy',
          lede: 'Entregue código com segurança e frequência através de pipelines automatizados.',
          body: 'Pipelines modernos de entrega contínua equilibram velocidade e conformidade estrita. Esta sessão apresenta automação de ambientes com Cloud Build e Cloud Deploy, integração de Binary Authorization, varredura de vulnerabilidades em contêineres e estratégias de implantação canary com rollback automático baseado em métricas de produção.',
          tag: '#DevOps',
          live: false,
          demo: 'video',
        },
      ],
    },

    {
      icon: 'gc-icon-support',
      title: 'Dados Unificados e Inteligência em Tempo Real',
      facts: [
        {
          title: 'Lakehouse unificado no BigQuery Studio com formatos abertos de tabela',
          lede: 'Análise de dados sem barreiras ou necessidade de movimentação de arquivos.',
          body: 'O BigQuery Studio unifica SQL corporativo, Dataframes em Python e modelos de Machine Learning em um único ambiente colaborativo. Com formatos de tabela abertos como Apache Iceberg e Delta Lake no Cloud Storage, execute consultas analíticas de altíssima velocidade diretamente sobre o data lake sem duplicação de dados, otimizando custos e capacidade computacional.',
          tag: '#BigQuery',
          live: true,
          demo: 'metrics',
        },
        {
          title: 'Streaming de dados e detecção de anomalias em tempo real com Dataflow',
          lede: 'Decisões operacionais exigem insights processados no momento do evento.',
          body: 'Processar milhões de eventos por segundo requer pipelines de streaming com garantia de processamento exatamente-uma-vez. Exploramos pipelines Apache Beam no Dataflow integrados ao Cloud Pub/Sub para detecção de fraudes, janelamento dinâmico de transações e gestão automatizada de filas mortas sob picos imprevisíveis de tráfego.',
          tag: '#Dataflow',
          live: true,
          demo: 'camera',
        },
        {
          title: 'Governança e linhagem automatizada de dados com Dataplex',
          lede: 'Confiança nos dados exige linhagem ponta a ponta e auditoria contínua.',
          body: 'À medida que ativos de dados se multiplicam em ambientes multicloud, a governança torna-se essencial. O Dataplex oferece coleta automatizada de metadados, mascaramento de dados sensíveis e gráficos de linhagem que rastreiam transformações desde a origem até os painéis de decisão executiva.',
          tag: '#Governança',
          live: false,
          demo: 'chat',
        },
      ],
    },

    {
      icon: 'gc-icon-mobile-check',
      title: 'Segurança com IA e BeyondCorp Zero Trust',
      facts: [
        {
          title: 'Arquitetura Zero Trust e acesso contextual com BeyondCorp Enterprise',
          lede: 'Substitua o perímetro tradicional por validação contínua de identidade e dispositivo.',
          body: 'A segurança moderna trata qualquer rede como não confiável. O BeyondCorp Enterprise garante acesso seguro a aplicações na nuvem e SaaS sem dependência de clientes VPN, combinando políticas de acesso baseadas em contexto, proteção integrada no Chrome Enterprise e regras de prevenção contra perda de dados (DLP).',
          tag: '#ZeroTrust',
          live: true,
          demo: 'security',
        },
        {
          title: 'SOC Agêntico e resposta autônoma a ameaças com integração Wiz no SCC',
          lede: 'Operações de segurança inteligentes neutralizam ameaças na velocidade do ataque.',
          body: 'O Security Command Center Premium integra inteligência de ameaças e tecnologia Wiz para identificar caminhos de ataque multicloud e falhas de configuração. Veja como equipes de SecOps usam IA para investigar alertas, correlacionar telemetria e disparar remediações autônomas que isolam recursos comprometidos.',
          tag: '#SecOps',
          live: false,
          demo: 'security',
        },
      ],
    },

    {
      icon: 'gc-icon-open',
      title: 'Inovação Local e Ecossistema Brasil',
      facts: [
        {
          title: 'Cloud Space São Paulo e co-criação de soluções de nuvem na América Latina',
          lede: 'Um polo de inovação dedicado a impulsionar a transformação digital no Brasil.',
          body: 'Localizado no Instituto de Pesquisas Tecnológicas em São Paulo, o Cloud Space é o primeiro espaço das Américas dedicado à aceleração de projetos de IA corporativa com clientes e parceiros. Explore laboratórios imersivos de co-criação e prototipagem rápida de agentes inteligentes com suporte direto de engenheiros do Google Cloud.',
          tag: '#CloudSpaceSP',
          live: false,
          demo: 'metrics',
        },
        {
          title: 'Capacitação em larga escala com The Arcade e Parceria Sebrae de IA',
          lede: 'Formando a próxima geração de talentos em nuvem e IA em todo o Brasil.',
          body: 'Com iniciativas como The Arcade BR e a cooperação com o Sebrae, o Google Cloud capacita milhões de estudantes, desenvolvedores e PMEs brasileiras no uso de IA Generativa. Conheça os programas de formação gratuita, certificações técnicas e laboratórios práticos 100% em português.',
          tag: '#CapacitaBrasil',
          live: true,
          demo: 'buttons',
        },
      ],
    },
  ],
};
