declare const Spreedly: any;

class spreedlyIframe {
  constructor() {
    this.init();
  }

  async init() {
    try {
      await this.loadSpreedlyScript();
      this.initialize();
    } catch (error) {
      console.error("Failed to load Spreedly script:", error);
    }
  }

  loadSpreedlyScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = "https://core.spreedly.com/iframe/iframe-v1.min.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Script load error"));
      document.head.appendChild(script);
    });
  }

  initialize() {
    Spreedly.on("errors", this.handleErrors.bind(this));
    Spreedly.on("paymentMethod", this.handlePaymentMethod.bind(this));
  }

  handleErrors(errors: { message: string }[]) {
    const expYear = document.getElementById('expYear') as HTMLInputElement;
    const expMonth = document.getElementById('expMonth') as HTMLInputElement;

    for (let i = 0; i < errors.length; i++) {
      let error = errors[i];
      if (error.message === "Year is invalid" || expYear.value === "") {
        this.showError("Card year is invalid");
      } else if (parseInt(expMonth.value) < new Date().getMonth() + 1 || expMonth.value === "") {
        this.showError("Card month is invalid");
      }
    }
  }

  async handlePaymentMethod(token: string) {
    await window.ordersCreate({
      shipping_method: 1,
      next_page: "/upsell1",
      card_token: token,
      lines: [{ package_id: 1, quantity: 1 }],
    });
  }

  showError(message: string) {
    console.error(message);
  }

  submitPaymentForm() {
    console.log("Submitting payment form...");
  }

  validateInput(inputProperties: { validCvv: boolean }) {
    if (!inputProperties.validCvv) {
      this.showError("Invalid CVV");
      Spreedly.transferFocus("cvv");
    } else {
      this.submitPaymentForm();
    }
  }
}

const spreedlyHandler = new spreedlyIframe();