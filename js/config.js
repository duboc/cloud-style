(function configureApplication(global) {
  global.APP_CONFIG = Object.freeze({
    productName: "Google Cloud App",
    projectLabel: "sample-project",
    environmentLabel: "Production",
    navigation: Object.freeze([
      { id: "overview", label: "Overview", href: "#/overview" },
      { id: "resources", label: "Resources", href: "#/resources" },
      { id: "activity", label: "Activity", href: "#/activity" },
      { id: "settings", label: "Settings", href: "#/settings" },
    ]),
  });
})(window);
