// first script that should be initialized
import NextCampaignApi from "../api/nextCampaignApi";

export default new NextCampaignApi(sessionStorage.getItem("key") as string);
