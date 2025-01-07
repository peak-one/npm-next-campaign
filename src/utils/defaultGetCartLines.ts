import { CartLine } from "../types/campaignsApi/base/CartLine";

function defaultGetCartLines(
  selectedItemSelector: string,
  developing = false
): Array<CartLine | Omit<CartLine, "is_upsell">> {
  const lines: Array<CartLine | Omit<CartLine, "is_upsell">> = [];

  const selectedItems = document.querySelectorAll(selectedItemSelector);
  for (const item of selectedItems) {
    const { id, quantity } = (item as HTMLElement).dataset;

    if (!id) {
      console.error(item);
      throw new Error(
        `The selected element/package above must have a data-id attribute to identify the package`
      );
    }

    lines.push({
      package_id: Number(id),
      quantity: quantity !== undefined ? Number(quantity) : 1,
    });
  }

  if (lines.length === 0) {
    throw new Error(
      `No selected items found with selector ${selectedItemSelector}`
    );
  }

  if (developing) {
    console.log(`defaultGetCartLines method returned:`, lines);
  }

  return lines;
}

export default defaultGetCartLines;
