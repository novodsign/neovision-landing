// Vercel Serverless Function to proxy Qtickets API requests
// This avoids CORS issues in production

const QTICKETS_API_URL = 'https://qtickets.ru/api/rest/v1';
const QTICKETS_API_KEY = 'b2XdRH8Uxj1vCFb7lKKQZHTLWlCUNCZ1';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Get the path after /api/qtickets/
    const { path } = req.query;
    const apiPath = Array.isArray(path) ? path.join('/') : path;

    // Build the full Qtickets URL
    const url = new URL(`${QTICKETS_API_URL}/${apiPath}`);

    // Forward query parameters (except 'path')
    Object.entries(req.query).forEach(([key, value]) => {
      if (key !== 'path') {
        url.searchParams.set(key, value);
      }
    });

    console.log('Proxying to:', url.toString());

    // Make request to Qtickets API
    const response = await fetch(url.toString(), {
      method: req.method,
      headers: {
        'Authorization': `Bearer ${QTICKETS_API_KEY}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    // Get response data
    const data = await response.json();

    // Return with same status code
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Qtickets proxy error:', error);
    res.status(500).json({
      error: 'Failed to fetch from Qtickets API',
      message: error.message
    });
  }
}
