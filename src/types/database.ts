
// Admin Config Types
export interface AdminConfig {
  inferior_admins: string[];
  superior_admins: string[];
}

// Credential Types
export interface Credential {
  belongs_to_slot: string;
  email: string;
  expiry_date: string;
  locked: number;
  max_usage: number;
  password: string;
  usage_count: number;
}

// Referral Settings Types
export interface ReferralSettings {
  buy_with_points_enabled: boolean;
  free_trial_enabled: boolean;
  points_per_referral: number;
  required_point: number;
}

// Referral Types
export interface Referral {
  referral_code: string;
  referral_points: number;
  referred_users?: (number | string)[];
  points_per_referral?: number;
}

// Slot Types
export interface Slot {
  enabled: boolean;
  frequency: string;
  last_update: string;
  required_amount: number;
  slot_end: string;
  slot_start: string;
}

export interface Slots {
  [key: string]: Slot;
}

export interface Settings {
  slots: Slots;
}

// Transaction Types
export interface Transaction {
  approved_at: string;
  end_time: string;
  slot_id: string;
  start_time: string;
}

export interface TransactionGroup {
  [key: string]: Transaction | number;
}

export interface Transactions {
  [key: string]: TransactionGroup | Transaction;
}

// UI Config Types
export interface CrunchyrollScreen {
  button_text: string;
  callback_data: string;
  caption: string;
  photo_url: string;
  gif_url?: string;
}

export interface NetflixPrimeScreen {
  button_text: string;
  callback_data: string;
  caption: string;
  gif_url: string;
  photo_url?: string;
}

export interface UIConfig {
  approve_flow: {
    account_format: string;
    gif_url: string;
    success_text: string;
  };
  confirmation_flow: {
    button_text: string;
    callback_data: string;
    caption: string;
    gif_url: string;
    photo_url: string;
  };
  crunchyroll_screen: CrunchyrollScreen | NetflixPrimeScreen;
  freetrial_info: {
    photo_url: string;
  };
  locked_flow: {
    locked_text: string;
  };
  out_of_stock: {
    gif_url: string;
    messages: string[];
  };
  phonepe_screen: {
    caption: string;
    followup_text: string;
    photo_url: string;
  };
  referral_info: {
    photo_url: string;
  };
  reject_flow: {
    error_text: string;
    gif_url: string;
  };
  slot_booking: {
    button_format: string;
    callback_data: string;
    caption: string;
    gif_url: string;
    photo_url: string;
  };
  start_command: {
    buttons: Array<{
      callback_data: string;
      text: string;
    }>;
    welcome_photo: string;
    welcome_text: string;
  };
}

// Database Schema
export interface DatabaseSchema {
  admin_config: AdminConfig;
  cred1: Credential;
  cred2: Credential;
  cred3: Credential;
  cred4: Credential;
  free_trial_claims: {
    [key: string]: boolean;
  };
  referral_settings: ReferralSettings;
  referrals: {
    [key: string]: Referral;
  };
  settings: Settings;
  transactions: Transactions;
  ui_config: UIConfig;
  used_orderids: {
    [key: string]: boolean;
  };
  users: {
    [key: string]: boolean;
  };
}
