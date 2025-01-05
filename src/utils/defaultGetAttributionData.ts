function defaultGetAttributionData() {
  let device;

  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    device = "mobile";
  } else {
    device = "desktop";
  }
  const domain = location.host + location.pathname;

  const cookies = document.cookie.split(";");
  const fbp = cookies.find((cookie) => cookie.includes("_fbp"));
  let fb_fbp;
  if (fbp) {
    fb_fbp = fbp.split("=")[1];
  }

  const fbc = cookies.find((cookie) => cookie.includes("_fbc"));
  let fb_fbc;
  if (fbc) {
    fb_fbc = fbc.split("=")[1];
  }

  const attributionData: Record<string, any> = {
    metadata: {
      device,
      domain,
    },
  };

  if (fb_fbp) {
    attributionData.metadata.fb_fbp = fb_fbp;
    attributionData.metadata.fb_event_source_url = location.href;
  }

  if (fb_fbc) {
    attributionData.metadata.fb_fbc = fb_fbc;
  }

  function getStoragedData(itemName: string) {
    const stringifiedValue =
      sessionStorage.getItem(itemName) || localStorage.getItem(itemName);
    if (stringifiedValue === null) return null;

    return typeof stringifiedValue === "string" ? stringifiedValue : JSON.parse(stringifiedValue);
  }

  function setPayloadAttrItem(
    payloadObject: Record<string, any>,
    payloadItemName: string,
    itemValue: any
  ) {
    payloadObject[payloadItemName] = itemValue;
  }

  function setPayloadAttrMetaItem(
    payloadObject: Record<string, any>,
    payloadItemName: string,
    itemValue: any
  ) {
    payloadObject.metadata[payloadItemName] = itemValue;
  }

  const storagedAttributionItems = {
    funnel: "funnel",
    utm_source: "utm_source",
    utm_medium: "utm_medium",
    utm_campaign: "utm_campaign",
    utm_term: "utm_term",
    utm_content: "utm_content",
    gclid: "gclid",
    affiliate: "affid",
    subaffiliate1: "sub1",
    subaffiliate2: "sub2",
    subaffiliate3: "sub3",
    subaffiliate4: "sub4",
    subaffiliate5: "sub5",
  };

  const storagedAttributionMetaDataItems = {};

  const attrItemsArray = Object.entries(storagedAttributionItems);
  attrItemsArray.forEach((attrItem) => {
    const [itemKey, itemValue] = attrItem;
    const itemExists = getStoragedData(itemValue as string);
    if (itemExists) {
      setPayloadAttrItem(attributionData, itemKey, itemExists);
    }
  });

  const attrMetaItemsArray = Object.entries(storagedAttributionMetaDataItems);
  attrMetaItemsArray.forEach((attrMetaItem) => {
    const [itemKey, itemValue] = attrMetaItem;
    const itemExists = getStoragedData(itemValue as string);
    if (itemExists) {
      setPayloadAttrMetaItem(attributionData, itemKey, itemExists);
    }
  });

  return attributionData;
}

export default defaultGetAttributionData;