import { CartLine } from "../types/campaignsApi/base/CartLine";

function defaultGetCartLines(
  selectedItemSelector: string,
  developing = false
): Array<CartLine> {
  const lines: Array<CartLine> | Array<Omit<CartLine, "is_upsell">> = [];

  const selectedItems = document.querySelectorAll(selectedItemSelector);
  for (const item of selectedItems) {
    const { id, quantity } = (item as HTMLElement).dataset;

    if (!id) {
      throw new Error(
        "The selected item must have a data-id attribute to identify the package"
      );
    }

    lines.push({
      package_id: Number(id),
      quantity: quantity !== undefined ? Number(quantity) : 1,
    });
  }

  if (developing) {
    console.log(`defaultGetCartLines method returned:`, lines);
  }

  return lines;
}

export default defaultGetCartLines;
