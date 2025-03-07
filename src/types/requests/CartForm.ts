import { Address } from "../base/Address";
import { Attribution } from "../base/Attribution";
import { CartLine } from "../base/CartLine";
import { User } from "../base/User";

interface CartUser extends Omit<User, "ip" | "user_agent"> {}

export default interface CartsCreate {
  address?: Address;
  attribution?: Attribution;
  lines: Array<CartLine>;
  user: CartUser;
  vouchers?: Array<string>;
}
