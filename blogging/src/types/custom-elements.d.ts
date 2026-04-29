import type { HTMLAttributes } from "react";

type AmpAutoAdsProps = HTMLAttributes<HTMLElement> & {
  type?: string;
  "data-ad-client"?: string;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "amp-auto-ads": AmpAutoAdsProps;
    }
  }
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "amp-auto-ads": AmpAutoAdsProps;
    }
  }
}
