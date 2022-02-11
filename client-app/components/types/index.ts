import { string } from "yup";

export interface IValidationRules {
  required?: boolean;
  min?: number;
  max?: number;
  regex?: RegExp;
}

export interface ItemAction {
  icon: string;
  title: string;
  bgColor: string;
  position: string;
  clickHandler(item: any): any;
}

export interface IBreadcrumbs {
  title: string;
  url: string;
}
