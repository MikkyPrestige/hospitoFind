import type { VercelRequest, VercelResponse } from '@vercel/node';

const BOT_USER_AGENTS = [
  'bot', 'crawler', 'spider', 'facebookexternalhit', 'twitterbot',
  'linkedinbot', 'whatsapp', 'slackbot', 'telegrambot', 'googlebot',
  'pinterest', 'discordbot', 'skypeuripreview', 'msnbot', 'bingbot'
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  const userAgent = (req.headers['user-agent'] || '').toLowerCase();
  const isBot = BOT_USER_AGENTS.some((bot) => userAgent.includes(bot));

  if (!isBot) {
    res.status(200).send('OK');
    return;
  }

  const url = req.url || '';
  let title = "HospitoFind - Find Hospitals & Healthcare Services Near You";
  let description = "Instantly locate verified hospitals, clinics, doctors, and healthcare services near you.";
  let image = "https://hospitofind.online/og-default.jpg";

  if (url.includes('/hospital/')) {
    title = "Hospital Details | HospitoFind";
    description = "Verified hospital information, services, contact details, opening hours, directions, and real-time availability.";
    image = "https://hospitofind.online/og-hospital.jpg";
  }
  else if (url.includes('/health-tips')) {
    title = "Daily Wellness Tips & Health Advice | HospitoFind";
    description = "Get daily actionable wellness tips for better physical and mental health. Science-backed advice from trusted experts.";
    image = "https://hospitofind.online/og-wellness.jpg";
  }
  else if (url.includes('/disease-outbreaks') || url.includes('/outbreaks')) {
    title = "Live Outbreak Alerts & Global Health Warnings | HospitoFind";
    description = "Stay updated with real-time disease outbreak alerts, health warnings, and safety protocols worldwide.";
    image = "https://hospitofind.online/og-alerts.jpg";
  }
  else if (url.includes('/health-news')) {
    title = "Global Health News & Medical Updates | HospitoFind";
    description = "Latest global health news, medical research, breakthroughs, and healthcare innovations.";
    image = "https://hospitofind.online/og-news.jpg";
  }
  else if (url.includes('/about')) {
    title = "Our Mission | Making Healthcare Accessible Worldwide";
    description = "Making global healthcare accessible, transparent, and verified for everyone, everywhere.";
    image = "https://hospitofind.online/og-about.jpg";
  }
  else if (url.includes('/directory') || url.includes('/country')) {
    title = "Global Hospital Directory | HospitoFind";
    description = "Browse verified hospitals, clinics, and healthcare facilities worldwide by country or continent.";
    image = "https://hospitofind.online/og-directory.jpg";
  }
  else if (url.includes('/share/')) {
    title = "Shared Hospitals | HospitoFind";
    description = "Shared list of verified hospitals and healthcare facilities from HospitoFind.";
    image = "https://hospitofind.online/og-share.jpg";
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">

    <!-- Open Graph -->
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://hospitofind.online${url}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="HospitoFind" />
    <meta property="og:site_name" content="HospitoFind" />

    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
</head>
<body>
    <h1>HospitoFind</h1>
    <p>Loading the best healthcare directory...</p>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(html);
}