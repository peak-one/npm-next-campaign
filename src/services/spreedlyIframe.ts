class SpreedlyIframe {
  private spreedly: any;
  private paymentEnvKey: string;

  constructor(paymentEnvKey: string) {
    this.paymentEnvKey = paymentEnvKey;
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
      const script = document.createElement('script');
      script.src = "https://core.spreedly.com/iframe/iframe-v1.min.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Script load error"));
      document.head.appendChild(script);
    });
  }

  private initialize() {  
    this.spreedly = (window as any).Spreedly;

    if (!this.spreedly) {
      console.error("Spreedly is not defined");
      return;
    }

    this.spreedly.init(this.paymentEnvKey, {
      numberEl: "bankcard-number",
      cvvEl: "bankcard-cvv",
    });

    this.spreedly.on("ready", this.onReady.bind(this));
    this.spreedly.on("errors", this.handleErrors.bind(this));
    this.spreedly.on("paymentMethod", this.handlePaymentMethod.bind(this));
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

  private handleErrors(errors: any) {
    console.error("Spreedly errors:", errors);
  }

  private handlePaymentMethod(paymentMethod: any) {
    // const firstName = firstNameEl.value || "Peak";
    // const lastName = lastNameEl.value || "One";
    // const fullName = `${firstName} ${lastName}`;

    const requiredFields = {
      full_name: "Peak One",
      month: "12",
      year: "2024"
    };
    this.spreedly.tokenizeCreditCard(requiredFields);
  }
}

export default SpreedlyIframe;