import { addMessages, init, getLocaleFromNavigator } from "svelte-i18n";

import ru_RU from "../lang/ru-RU.json";
import be_BY from "../lang/be-BY.json";
import bg_BG from "../lang/bg-BG.json";
import en_IE from "../lang/en-IE.json";

export const locales = new Map([
    ["ru-RU", ru_RU],
    ["be-BY", be_BY],
    ["bg-BG", bg_BG],
    ["en-IE", en_IE],
]);

for (const [name, locale] of locales) {
    addMessages(name, locale);
}

init({
  fallbackLocale: "en-IE",
  initialLocale: getLocaleFromNavigator(),
});
