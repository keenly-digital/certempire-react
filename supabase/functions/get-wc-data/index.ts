// supabase/functions/get-wc-data/index.ts

import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  // For CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email) throw new Error('Missing email');

    // WooCommerce API credentials and site URL from Supabase secrets
    const WC_CONSUMER_KEY = Deno.env.get('WC_CONSUMER_KEY') ?? '';
    const WC_CONSUMER_SECRET = Deno.env.get('WC_CONSUMER_SECRET') ?? '';
    const WP_SITE_URL = Deno.env.get('WP_SITE_URL') ?? '';

    if (!WC_CONSUMER_KEY || !WC_CONSUMER_SECRET || !WP_SITE_URL) {
      throw new Error('WooCommerce keys or site URL are missing');
    }

    // Official WooCommerce REST API: filter by customer email
    // Documentation: https://woocommerce.github.io/woocommerce-rest-api-docs/#list-all-orders
    const apiUrl = `${WP_SITE_URL}/wp-json/wc/v3/orders?customer=${encodeURIComponent(email)}`;

    // HTTP Basic Auth (base64 encode key:secret)
    const authString = btoa(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`);

    // Fetch orders for this customer
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`WooCommerce API request failed with status: ${response.status}`);
    }

    const orders = await response.json();

    return new Response(JSON.stringify({ orders }), {
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
