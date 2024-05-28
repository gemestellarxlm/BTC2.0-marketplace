import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface IInscription {
  address: string;
  inscriptionId: string;
  inscriptionNumber: number;
  output: string;
  outputValue: number;
  content: string;
  price: number;
  tokenTicker: string;
}