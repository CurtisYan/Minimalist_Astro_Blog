import { siteConfig } from '../config/site';

export function redirectResponse(destination: string, title = 'Redirecting', label = destination) {
  const html = `<!doctype html>
<html lang="${siteConfig.lang}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="refresh" content="0; url=${destination}">
    <link rel="canonical" href="${destination}">
    <title>${title} | ${siteConfig.title}</title>
  </head>
  <body>
    <p>Redirecting to <a href="${destination}">${label}</a>.</p>
  </body>
</html>`;

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8'
    }
  });
}
