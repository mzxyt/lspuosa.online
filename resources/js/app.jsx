import "./bootstrap";
import "../css/app.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/custom.css";
import "boxicons/css/boxicons.min.css";
import "../css/style.css";
import "react-toastify/dist/ReactToastify.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import axios from "axios";
import { GoogleOAuthProvider } from "@react-oauth/google";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import ru from "javascript-time-ago/locale/ru.json";
import "react-quill/dist/quill.snow.css";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// const googleClientId =
//   "855985514347-g7qro3g4g8cudl9c87jl10q0jsvol1os.apps.googleusercontent.com";

axios.defaults.baseURL = import.meta.env.VITE_APP_URL + "/api";
TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

createInertiaApp({
  title: (title) => `${title ? title + " - " : title} ${appName}`,
  resolve: (name) =>
    resolvePageComponent(
      `./Pages/${name}.jsx`,
      import.meta.glob("./Pages/**/*.jsx")
    ),
  setup({ el, App, props }) {
    const root = createRoot(el);
    root.render(
      <GoogleOAuthProvider
        onScriptLoadError={(err) => console.log("google oauth error: ", err)}
        clientId={googleClientId}
      >
        <App {...props} />
      </GoogleOAuthProvider>
    );
  },
  progress: {
    color: "#4B5563",
  },
});
