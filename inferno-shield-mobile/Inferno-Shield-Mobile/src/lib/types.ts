
export interface User {
  id: string;
  username: string;
  password?: string;
  role: 'admin' | 'client';
  canLogin?: boolean;
}

export interface Incident {
  id: string;
  date: string;
  location: string;
  severity: 'Minor' | 'Moderate' | 'Critical';
  duration: string;
  log: string;
  recommendations?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
}

export type ZoneStatus = 'normal' | 'warning' | 'critical';

export interface Sensor {
    name: string;
    status: string;
}

export interface Zone {
  id: string;
  name: string;
  status: ZoneStatus;
  temp: number;
  sensors: Sensor[];
}

export interface SensorDetail {
    id: string;
    type: string;
    status: 'Active' | 'Warning' | 'Triggered';
    lastCheckIn: string;
    operationalSince: string;
    currentReading: {
        value: number;
        unit: string;
    };
    history: { time: string; value: number }[];
}
