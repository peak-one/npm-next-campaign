function defaultGetShippingMethod(
  fastShippingSelector: string,
  selectedItemSelector: string
): number {
  const fastShippingElement = document.querySelector(
    fastShippingSelector
  ) as HTMLElement;
  if (fastShippingElement !== null) {
    const { id } = fastShippingElement.dataset;

    if (id === undefined) {
      console.error(fastShippingElement);
      throw new Error(
        `The fast shipping element above must have a data-id attribute to identify the shipping method`
      );
    }

    return Number(id);
  }

  const selectedItem = document.querySelector(
    selectedItemSelector
  ) as HTMLElement;
  if (selectedItem === null) {
    console.error(selectedItem);
    throw new Error(
      `No selected items found with selector ${selectedItemSelector}`
    );
  }

  const { shippingId } = selectedItem.dataset;

  if (shippingId === undefined) {
    console.error(selectedItem);
    throw new Error(
      `The selected item above must have a data-shipping-id attribute to identify the shipping method`
    );
  }

  return Number(shippingId);
}

export default defaultGetShippingMethod;
