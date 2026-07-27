import type { Child } from "hono/jsx";

const SITE_URL = "https://elliot14a.work";
const OG_IMAGE = `${SITE_URL}/og.png`;

export type ShellProps = Readonly<{
  title: string;
  description: string;
  noIndex?: boolean;
  children: Child;
}>;

export function Shell(props: ShellProps) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <title>{props.title}</title>
        <meta name="description" content={props.description} />
        <meta name="color-scheme" content="dark" />
        {props.noIndex ? <meta name="robots" content="noindex" /> : null}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:title" content={props.title} />
        <meta property="og:description" content={props.description} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={props.title} />
        <meta name="twitter:description" content={props.description} />
        <meta name="twitter:image" content={OG_IMAGE} />
        <link
          rel="preload"
          href="/fonts/JetBrainsMono-Regular.woff2"
          as="font"
          type="font/woff2"
          crossorigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/NerdIcons.woff2"
          as="font"
          type="font/woff2"
          crossorigin="anonymous"
        />
        <link rel="stylesheet" href="/css/editor.css" />
        <script src="/js/htmx.js" defer />
        <script type="module" src="/js/client.js" defer />
      </head>
      <body>{props.children}</body>
    </html>
  );
}
