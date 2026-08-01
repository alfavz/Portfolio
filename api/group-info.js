// Vercel serverless function: /api/group-info?url=<whatsapp invite/channel link>
// Supports:
//   - WA Group/Community : https://chat.whatsapp.com/XXXX
//   - WA Channel         : https://whatsapp.com/channel/XXXX

import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  const { url } = req.query;

  const isGroup   = url && url.startsWith('https://chat.whatsapp.com/');
  const isChannel = url && (
    url.startsWith('https://whatsapp.com/channel/') ||
    url.startsWith('https://www.whatsapp.com/channel/')
  );

  if (!isGroup && !isChannel) {
    return res.status(400).json({
      status: false,
      message: 'Provide a valid WhatsApp group or channel URL.',
    });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
      },
    });

    if (!response.ok) throw new Error(`WhatsApp responded with ${response.status}`);

    const html = await response.text();
    const $ = cheerio.load(html);

    const groupName  = $('meta[property="og:title"]').attr('content') || null;
    const groupIcon  = $('meta[property="og:image"]').attr('content') || null;
    const inviteType = isChannel
      ? 'CHANNEL'
      : ($('meta[property="invite_link_type_v2"]').attr('content') || 'DEFAULT');
    const community  = $('meta[property="parent_group_subject"]').attr('content') || null;
    const description = $('meta[property="og:description"]').attr('content') || null;

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return res.status(200).json({
      status: true,
      type: isChannel ? 'channel' : 'group',
      data: { groupName, groupIcon, inviteType, community, description },
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
}
