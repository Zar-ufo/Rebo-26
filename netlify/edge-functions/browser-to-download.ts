// Regular browsers are sent to the download section before any app code loads.
// The Windows (Electron) and Android (WebView) apps identify themselves with "ReboApp"
// in their user agent and keep loading the research workspace.
export default async (req: Request) => {
  const ua = req.headers.get('user-agent') || '';
  const isPackagedApp = /\bReboApp\b/.test(ua) || /\bElectron\//i.test(ua) || (/Android/i.test(ua) && /\bwv\b/.test(ua));
  if (isPackagedApp) return;

  return Response.redirect(new URL('/download', req.url), 302);
};

export const config = {
  path: ['/', '/index.html', '/app'],
};
