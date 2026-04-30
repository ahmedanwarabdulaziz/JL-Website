import Script from "next/script";
import { Suspense } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import GoogleAnalyticsRouteTracker from "@/components/GoogleAnalyticsRouteTracker";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_MICROSOFT_CLARITY_ID;

export default function AnalyticsScripts() {
  return (
    <>
      {GA_MEASUREMENT_ID ? (
        <>
          <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
          <Suspense fallback={null}>
            <GoogleAnalyticsRouteTracker />
          </Suspense>
        </>
      ) : null}

      {CLARITY_PROJECT_ID ? (
        <Script id="microsoft-clarity-init" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);
              t.async=1;
              t.src="https://www.clarity.ms/tag/" + i;
              y=l.getElementsByTagName(r)[0];
              y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
          `}
        </Script>
      ) : null}
    </>
  );
}
