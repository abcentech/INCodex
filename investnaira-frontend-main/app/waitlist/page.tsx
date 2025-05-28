/* eslint-disable @next/next/inline-script-id */
import Head from "next/head";
import Script from "next/script";

const cssLoader = `
    let head = document.getElementsByTagName('HEAD')[0];
    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://prod-waitlist-widget.s3.us-east-2.amazonaws.com/getwaitlist.min.css';
    head.appendChild(link);
`;

export default function Waitlist() {
  return (
    <div className="flex items-center justify-center h-full">
      <Script type="" dangerouslySetInnerHTML={{ __html: cssLoader }}></Script>
      <Script src="https://prod-waitlist-widget.s3.us-east-2.amazonaws.com/getwaitlist.min.js"></Script>

      <div
        id="getWaitlistContainer"
        data-waitlist_id="19709"
        data-widget_type="WIDGET_1"
        className="w-full max-w-md"
      ></div>
    </div>
  );
}
