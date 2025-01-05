import { ICardPaymentElements } from "../types/services/spreedlyIframe";

declare global {
  interface Window {
    CheckoutFlow: {
      ordersCreate: (card_token: string) => Promise<void>;
    };
    Spreedly: any;
  }
}

class SpreedlyIframe {
  private spreedly: any;
  private paymentEnvKey: string;
  private cardPaymentElements: ICardPaymentElements;

  constructor(
    paymentEnvKey: string,
    cardPaymentElements: ICardPaymentElements
  ) {
    this.paymentEnvKey = paymentEnvKey;
    this.cardPaymentElements = cardPaymentElements;
    this.init();
  }

  private async init() {
    try {
      await this.loadSpreedlyScript();
      this.initialize();
    } catch (error) {
      console.error("Failed to load Spreedly script:", error);
    }
  }

  private loadSpreedlyScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://core.spreedly.com/iframe/iframe-v1.min.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Script load error"));
      document.head.appendChild(script);
    });
  }

  private initialize() {
    this.spreedly = window.Spreedly;

    if (!this.spreedly) {
      throw new Error("Spreedly is not defined");
    }

    this.spreedly.init(this.paymentEnvKey, {
      numberEl: "bankcard-number",
      cvvEl: "bankcard-cvv",
    });

    this.spreedly.on("ready", this.onReady.bind(this));
    this.spreedly.on("validation", this.onValidation.bind(this));
    this.spreedly.on("errors", this.onErrors.bind(this));
    this.spreedly.on("paymentMethod", this.onPayment.bind(this));
  }

  private onReady(styles: string) {
    this.spreedly.setFieldType("text");
    this.spreedly.setPlaceholder("cvv", "CVV");
    this.spreedly.setPlaceholder("number", "Card Number");
    this.spreedly.setNumberFormat("prettyFormat");
    if (styles) {
      this.spreedly.setStyle("cvv", styles);
      this.spreedly.setStyle("number", styles);
    }
    this.spreedly.setStyle("placeholder", "color: #cacaca;");
  }

  private getExpirityCardDateValues(): { expMonth: string; expYear: string } {
    const { expMonthElement, expYearElement, expirityDateElement } = this.cardPaymentElements;

    if (expirityDateElement) {
      let [expMonth, expYear] = expirityDateElement.value.split("/");

      if (expYear.length === 2) {
        expYear = `${String(new Date().getFullYear()).slice(0,2)}${expYear}`;
      }

      return { expMonth, expYear };
    }

    if (!expMonthElement || !expYearElement) {
      throw new Error("Expirity date elements are not defined");
    }

    return {
      expMonth: expMonthElement.value,
      expYear: expYearElement.value,
    };
  }

  private getFullName(): string {
    const storagedFieldsValues = sessionStorage.getItem("validFieldsValues");

    if (!storagedFieldsValues) {
      console.warn("Fields values are not defined");
      const { firstNameElement, lastNameElement } = this.cardPaymentElements;

      if (!firstNameElement || !lastNameElement) {
        throw new Error("Full name elements are not defined");
      }

      return `${firstNameElement.value} ${lastNameElement.value}`;
    }

    const { first_name, last_name } = JSON.parse(storagedFieldsValues).shipping;

    return `${first_name} ${last_name}`;
  }

  private submitPaymentForm() {
    const { expMonth, expYear } = this.getExpirityCardDateValues();

    const requiredFields = {
      full_name: this.getFullName(),
      month: expMonth,
      year: expYear,
    };
    this.spreedly.tokenizeCreditCard(requiredFields);
  }

  private showError(msg: string) {
    this.cardPaymentElements.errorMsgElement.innerHTML = msg;
    setTimeout(() => {
      this.cardPaymentElements.errorMsgElement.innerHTML = "";
    }, 5000);
  }

  private onValidation(inputProperties: any) {
    if (!inputProperties.validNumber) {
      this.showError("Invalid Credit Card");
      this.spreedly.transferFocus("number");
    } else if (!inputProperties.validCvv) {
      this.showError("Invalid CVV");
      this.spreedly.transferFocus("cvv");
    } else {
      this.submitPaymentForm();
    }
  }

  private onErrors(errors: any) {
    const { expMonth, expYear } = this.getExpirityCardDateValues();

    for (let i = 0; i < errors.length; i++) {
      let error = errors[i];
      if (error.message === "Year is invalid" || expYear === "") {
        this.showError("Card year is invalid");
      } else if (
        Number(expMonth) < new Date().getMonth() + 1 ||
        expMonth === ""
      ) {
        this.showError("Card month is invalid");
      }
    }
  }

  private async onPayment(token: string) {
    await window.CheckoutFlow.ordersCreate(token);
  }
}

export default SpreedlyIframe;
