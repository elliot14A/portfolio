import type { Child } from "hono/jsx";

export type ShellProps = Readonly<{
  title: string;
  description: string;
  children: Child;
}>;

export function Shell(props: ShellProps) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{props.title}</title>
        <meta name="description" content={props.description} />
        <meta name="color-scheme" content="dark" />
        <link rel="stylesheet" href="/css/editor.css" />
        <script src="/js/htmx.js" defer />
        <script type="module" src="/js/client.js" defer />
      </head>
      <body>{props.children}</body>
    </html>
  );
}
