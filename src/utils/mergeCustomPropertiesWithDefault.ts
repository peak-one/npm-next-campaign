import _ from "lodash";
import { DeepPartial } from "../types/DeepPartial";

function mergeCustomPropertiesWithDefault<T>(
  customProperties: DeepPartial<T>,
  defaultProperties: T
): T {
  return _.merge({}, defaultProperties, customProperties);
}

export default mergeCustomPropertiesWithDefault;
