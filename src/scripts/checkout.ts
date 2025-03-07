// second script that should be initialized after campaign.ts
import SpreedlyIframe from "../services/spreedlyIframe";

new SpreedlyIframe("EOFJHpapsN9SFo6U89sxEdxFbdr", {
  errorMsgElement: document.querySelector(".errors-div")!,
  expMonthElement: document.querySelector("#cardMonth")! as
    | HTMLInputElement
    | HTMLSelectElement,
  expYearElement: document.querySelector("#cardYear")! as
    | HTMLInputElement
    | HTMLSelectElement,
  firstNameElement: document.querySelector("[data-first-name]")!,
  lastNameElement: document.querySelector("[data-last-name]")!,
});

import "./checkoutFlow";
