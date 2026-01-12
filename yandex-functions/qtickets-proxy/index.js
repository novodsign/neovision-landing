// Yandex Cloud Function to proxy Qtickets API requests
// This avoids CORS issues in production

const QTICKETS_API_URL = 'https://qtickets.ru/api/rest/v1';
const QTICKETS_API_KEY = 'b2XdRH8Uxj1vCFb7lKKQZHTLWlCUNCZ1';

module.exports.handler = async function (event, context) {
    // CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: '',
        };
    }

    try {
        // Get path from query parameter (simplest approach for Yandex Functions)
        // Usage: ?path=events or ?path=events/61960
        let apiPath = event.queryStringParameters?.path || event.path || '';

        // Remove leading slashes
        apiPath = apiPath.replace(/^\/+/, '');

        // Default to events list
        if (!apiPath) {
            apiPath = 'events';
        }

        // Build the full Qtickets URL
        const url = new URL(`${QTICKETS_API_URL}/${apiPath}`);

        // Forward query parameters (except 'path' which we use for routing)
        if (event.queryStringParameters) {
            Object.entries(event.queryStringParameters).forEach(([key, value]) => {
                if (key !== 'path') {
                    url.searchParams.set(key, value);
                }
            });
        }

        console.log('Proxying to:', url.toString());

        // Make request to Qtickets API
        const response = await fetch(url.toString(), {
            method: event.httpMethod || 'GET',
            headers: {
                'Authorization': `Bearer ${QTICKETS_API_KEY}`,
                'Accept': 'application/json',
            },
        });

        const text = await response.text();

        // Try to parse as JSON
        try {
            const data = JSON.parse(text);
            return {
                statusCode: response.status,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            };
        } catch {
            console.error('Non-JSON response:', text.substring(0, 200));
            return {
                statusCode: 500,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    error: 'Invalid response from Qtickets API',
                    status: response.status,
                    preview: text.substring(0, 200),
                }),
            };
        }
    } catch (error) {
        console.error('Qtickets proxy error:', error);
        return {
            statusCode: 500,
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                error: 'Failed to fetch from Qtickets API',
                message: error.message,
            }),
        };
    }
};
