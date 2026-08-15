(function configureRouter(global) {
  const screens = new Set(["overview", "resources", "activity", "settings"]);

  function parseRoute(hash) {
    const raw = String(hash || "").replace(/^#\/?/, "");
    const [path, queryString = ""] = raw.split("?");
    const parts = path.split("/").filter(Boolean);
    const query = new URLSearchParams(queryString);

    if (parts[0] === "resources" && parts[1]) {
      return { screen: "resource-detail", section: "resources", id: parts[1], query };
    }

    const screen = screens.has(parts[0]) ? parts[0] : "overview";
    return { screen, section: screen, query };
  }

  global.CloudStyleRouter = Object.freeze({ parseRoute });
})(window);
