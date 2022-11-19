import { AirNodes } from './data-firestore.interface';

export interface HeatData {
  name: string;
  data: CoordinateHeat[];
}

export interface CoordinateHeat {
  x: string;
  y: number;
}
export interface GroupUserData {
  [key: string]: AirNodes[];
}
