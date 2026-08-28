(function configureSampleData(global) {
  global.SAMPLE_DATA = Object.freeze({
    resources: Object.freeze([
      {
        id: "api-gateway",
        name: "API gateway",
        type: "Gateway",
        region: "us-central1",
        status: "Healthy",
        updated: "2 minutes ago",
      },
      {
        id: "edge-gateway",
        name: "Edge gateway",
        type: "Gateway",
        region: "southamerica-east1",
        status: "Healthy",
        updated: "8 minutes ago",
      },
      {
        id: "operations-store",
        name: "Operations store",
        type: "Database",
        region: "us-east1",
        status: "Attention",
        updated: "24 minutes ago",
      },
    ]),
    operations: Object.freeze([
      { id: "op-1048", label: "Configuration updated", actor: "alex@example.com", time: "10:42", outcome: "Success" },
      { id: "op-1047", label: "Resource health check", actor: "system", time: "10:18", outcome: "Success" },
      { id: "op-1046", label: "Database backup", actor: "system", time: "09:56", outcome: "Warning" },
    ]),
    settings: Object.freeze({
      displayName: "App",
      environment: "Production",
      notifications: true,
    }),
  });
})(window);
