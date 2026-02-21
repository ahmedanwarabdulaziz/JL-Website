declare module "react-google-recaptcha" {
  import { Component } from "react";
  export interface ReCAPTCHAProps {
    sitekey: string;
    theme?: "light" | "dark";
    onChange?: (token: string | null) => void;
    [key: string]: unknown;
  }
  export default class ReCAPTCHA extends Component<ReCAPTCHAProps> {
    getValue(): string | null;
    reset(): void;
  }
}
