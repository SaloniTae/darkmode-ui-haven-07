
// Database types for the application

export interface AdminConfig {
  superior_admins: string[];
  inferior_admins: string[];
}

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

// Interface for Crunchyroll screen which uses photo_url
export interface CrunchyrollScreen {
  button_text: string;
  callback_data: string;
  caption: string;
  photo_url: string;
}

// Interface for Netflix/Prime screen which uses gif_url
export interface StreamingScreen {
  button_text: string;
  callback_data: string;
  caption: string;
  gif_url: string;
}

export interface Referral {
  referral_code: string;
  referral_points: number;
  referred_users?: (string | number)[];
}

export interface ReferralSettings {
  buy_with_points_enabled: boolean;
  free_trial_enabled: boolean;
  points_per_referral: number;
  required_point: number;
}

export interface Transactions {
  [key: string]: any;
}

// Service-specific configuration data
export interface ServiceConfig {
  admin_config: AdminConfig;
  slots: Slots;
  // This field will be CrunchyrollScreen for crunchyroll and StreamingScreen for others
  crunchyroll_screen: CrunchyrollScreen | StreamingScreen;
  referral_settings: ReferralSettings;
  transactions: Transactions;
  free_trial_claims: { [key: string]: boolean };
  [key: string]: any; // For other properties
}
