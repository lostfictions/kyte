// This will be translated by "babel-present-env"
// into the set of imports needed to polyfill the
// target browsers specified in the .babelrc file
require("@babel/polyfill");

// Both Parcel and Monaco introdce a require function,
// so we need to capture the Monaco one in order to
// use it for dynamically loading its assets.
const monacoRequire = window.require;

// This is required because many of the Monaco modules
// expect to load sub-modules from a virtual "vs" root path.
monacoRequire.config({
  paths: { vs: "https://unpkg.com/monaco-editor@0.10.1/min/vs" }
});

monacoRequire(["vs/editor/editor.main"], () => {
  window.monaco.editor.create(document.getElementById("container"), {
    language: "typescript",
    theme: "vs-dark"
  });

  // Allow easily enabling debug mode (i.e. verbose log output),
  // by toggling the right Node debug module flags. Note that in order
  // for this to take effect, without requiring a browser refresh, it
  // needs to be set before the "dependent" module is loaded, which
  // is why the "monaco-share" module is require'd below.
  if (location.search.includes("debug")) {
    localStorage.debug = "monaco-share";
  }

  const monacoShare = require("monaco-share");
  const shareClient = require("../../lib/shareClient");

  // The local server uses HTTP, whereas the internet tunnel uses HTTPS,
  // so we simply want to connect the WebSocket to the server using the
  // correct protocol. Otherwise, the connection will fail.
  const protocol = location.protocol === "http:" ? "ws:" : "wss:";
  shareClient(new WebSocket(`${protocol}//${location.host}`)).then(monacoShare);
});
