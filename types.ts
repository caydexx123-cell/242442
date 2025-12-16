export interface IPAnalysis {
  ip: string;
  success: boolean;
  type: string;
  continent: string;
  country: string;
  country_code: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
  isp: string;
  org: string;
  asn: string;
  timezone: {
    id: string;
    current_time: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isAnalysis?: boolean;
}
