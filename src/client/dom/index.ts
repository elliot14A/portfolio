import Alpine from "alpinejs";
import { editor } from "./editor";
import { startMenu } from "./startMenu";
import { tree } from "./tree";

document.body.classList.add("js");

Alpine.data("editor", editor);
Alpine.data("startMenu", startMenu);
Alpine.data("tree", tree);
Alpine.start();
