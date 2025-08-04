(function () {
  const currentScript = document.currentScript;
  const agentId = currentScript.getAttribute("data-agent-id");
  if (!agentId) return console.error("[embed] missing data-agent-id attribute");
  const baseURL = "https://toow.io/embed";
  const iframe = document.createElement("iframe");
  iframe.src = `${baseURL}?agent_id=${encodeURIComponent(agentId)}&host=${new URL(currentScript.baseURI).host}`;
  Object.assign(iframe.style, {
    position: "fixed",
    bottom: "80px",
    right: "20px",
    width: "290px",
    height: "350px",
    border: "1px solid #ededed",
    borderRadius: "32px",
    boxShadow: "rgb(0 0 0 / 5%) 0px 4px 20px",
    zIndex: "999998",
    display: "none",
  });
  iframe.allow = "microphone; autoplay";
  iframe.setAttribute("id", "ai-agent-widget");
  document.body.appendChild(iframe);
  const fab = document.createElement("button");
  fab.innerHTML = "Talk to sales agent";
  Object.assign(fab.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    fontSize: "15px",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    zIndex: "999999",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#222",
    boxShadow: "0px 512px 142px rgba(3, 7, 18, 2)",
    padding: "13px 17px",
    borderRadius: "17px",
    fontWeight: "500",
  });
  fab.setAttribute("aria-label", "Toggle AI Chat");
  document.body.appendChild(fab);
  let isOpen = false;
  fab.addEventListener("click", () => {
    isOpen = !isOpen;
    iframe.style.display = isOpen ? "block" : "none";
    fab.innerHTML = !isOpen ? "Talk to sales agent" : "Hide agent";
  });
})();
