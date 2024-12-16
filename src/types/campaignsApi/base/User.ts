export interface User {
  accepts_marketing?: boolean | null;
  email?: string | null;
  first_name: string;
  ip?: string | null;
  language: string;
  last_name: string;
  phone_number?: string | null;
  user_agent?: string | null;
}
