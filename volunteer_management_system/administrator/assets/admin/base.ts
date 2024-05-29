import Alpine from "alpinejs";
import persist from "@alpinejs/persist";

import "@fortawesome/fontawesome-free/css/all.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "./css/base.scss";
import "htmx.org";

Alpine.plugin(persist);
Alpine.start();
window["Alpine"] = Alpine;
window["htmx"] = require('htmx.org');
