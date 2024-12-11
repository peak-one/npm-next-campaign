import NextCampaignApi from "./api/nextCampaignApi.js";
import EcommerceFunnel from "./services/ecommerceFunnel.js";
const campaign = new NextCampaignApi("TiST7VEuJPmaYFmCEwaLGyuqXAcckoQWDwhkgSi8");

const cart = {
  "address": {
    "country": "US",
    "first_name": "test",
    "last_name": "test",
    "line1": "123 test street, 123 Test",
    "line4": "testy",
    "phone_number": "+16165456655",
    "postcode": "55566",
    "state": "AK"
  },
  "attribution": {
    "funnel": "P1 Cialix V20",
    "metadata": {
      "device": "desktop",
      "domain": "deal.cialix.com/lirtv/"
    }
  },
  "lines": [
    {
      "package_id": 1
    }
  ],
  "user": {
    "email": "testy@tester.com",
    "first_name": "test",
    "last_name": "test",
    "phone_number": "+16165456655",
    "language": "en"
  }
}
// console.log(await campaign.cartsCreate(cart))

export {
  NextCampaignApi,
  EcommerceFunnel
};
