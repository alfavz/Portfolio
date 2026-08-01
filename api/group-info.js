// Vercel serverless function: /api/group-info?url=<whatsapp invite link>
// Runs server-side (not in the browser) so it isn't blocked by CORS/robots
// rules the way a direct fetch from script.js would be.
//
// Reads OpenGraph meta tags from the WhatsApp invite page:
//   og:title                 -> group/community name
//   og:image                 -> group/community photo
//   invite_link_type_v2      -> PARENT (community) | SUB (group) | DEFAULT
//   parent_group_subject     -> name of the parent community, if any

import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || !url.startsWith('https://chat.whatsapp.com/')) {
    return res.status(400).json({
      status: false,
      message: 'Provide a valid WhatsApp invite URL, e.g. ?url=https://chat.whatsapp.com/XXXX',
    });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`WhatsApp responded with ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const groupName = $('meta[property="og:title"]').attr('content') || null;
    const groupIcon = $('meta[property="og:image"]').attr('content') || null;
    const inviteType = $('meta[property="invite_link_type_v2"]').attr('content') || 'DEFAULT';
    const community = $('meta[property="parent_group_subject"]').attr('content') || null;

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return res.status(200).json({
      status: true,
      data: { groupName, groupIcon, inviteType, community },
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
}
