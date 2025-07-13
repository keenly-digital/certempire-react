// supabase/functions/get-wc-data/index.ts

import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Pull the data you need from the request
    const { endpoint, user_id } = await req.json();
    if (!endpoint || !user_id) throw new Error('Missing endpoint or user_id');

    const WC_CONSUMER_KEY = Deno.env.get('WC_CONSUMER_KEY') ?? '';
    const WC_CONSUMER_SECRET = Deno.env.get('WC_CONSUMER_SECRET') ?? '';
    const WP_SITE_URL = Deno.env.get('WP_SITE_URL') ?? '';

    if (!WC_CONSUMER_KEY || !WC_CONSUMER_SECRET || !WP_SITE_URL) {
      throw new Error('WooCommerce keys or site URL are missing');
    }

    let apiUrl = "";

    if (endpoint === "downloads") {
      apiUrl = `${WP_SITE_URL}/wp-json/wc/v3/customers/${user_id}/downloads?consumer_key=${WC_CONSUMER_KEY}&consumer_secret=${WC_CONSUMER_SECRET}`;
    } else if (endpoint === "orders") {
      apiUrl = `${WP_SITE_URL}/wp-json/wc/v3/orders?customer=${user_id}&consumer_key=${WC_CONSUMER_KEY}&consumer_secret=${WC_CONSUMER_SECRET}`;
    } else {
      throw new Error("Unknown endpoint requested");
    }

    // Call WooCommerce REST API (no Authorization header needed if using keys in URL)
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`WooCommerce API request failed with status: ${response.status}`);
    }

    const data = await response.json();

    // Return as flat array, not nested
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
