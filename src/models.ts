export interface Wind10m {
  direction: string;
  speed: number;
}

export interface Datasery {
  timepoint: number;
  cloudcover: number;
  seeing: number;
  transparency: number;
  lifted_index: number;
  rh2m: number;
  wind10m: Wind10m;
  temp2m: number;
  prec_type: string;
}

export interface RootObject {
  product: string;
  init: string;
  dataseries: Datasery[];
}
