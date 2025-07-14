// supabase/functions/get-wc-data/index.ts

import { corsHeaders } from '../_shared/cors.ts'
import { Buffer } from 'https://deno.land/std@0.177.0/node/buffer.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the method and other params from the request body
    const { method, endpoint, user_id, ...bodyData } = await req.json();
    if (!method || !endpoint) throw new Error("Missing method or endpoint parameter");

    // Get environment variables
    const WC_CONSUMER_KEY = Deno.env.get('WC_CONSUMER_KEY');
    const WC_CONSUMER_SECRET = Deno.env.get('WC_CONSUMER_SECRET');
    const WP_SITE_URL = Deno.env.get('WP_SITE_URL');

    let apiUrl = '';
    let fetchOptions: RequestInit = {};

    // --- ROUTE BASED ON THE METHOD PROVIDED IN THE BODY ---

    if (method === 'GET') {
      fetchOptions.method = 'GET';
      let paramStr = '';

      // This logic is from your original file, now correctly placed
      if (endpoint.startsWith('wc/')) {
        // Official WooCommerce API (Basic Auth)
        apiUrl = `${WP_SITE_URL}/wp-json/wc/v3/${endpoint.replace('wc/', '')}`;
        if (user_id) apiUrl += `?customer=${user_id}`;
        
        const authString = `${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`;
        const encodedAuth = Buffer.from(authString).toString('base64');
        fetchOptions.headers = { 'Authorization': `Basic ${encodedAuth}` };

      } else if (endpoint.startsWith('cwc/')) {
        // Your custom plugin endpoints
        const route = endpoint.replace('cwc/', '');

        // This detailed logic is restored to handle all cases correctly
        if (route.startsWith('customer/') || route.startsWith('orders/')) {
           paramStr = `?customer=${user_id}&consumer_secret=${WC_CONSUMER_SECRET}`;
        } else if (user_id) {
           paramStr = `?customer=${user_id}&consumer_secret=${WC_CONSUMER_SECRET}`;
        } else {
           paramStr = `?consumer_secret=${WC_CONSUMER_SECRET}`;
        }
        apiUrl = `${WP_SITE_URL}/wp-json/cwc/v2/${route}${paramStr}`;
      
      } else {
        throw new Error("Unknown endpoint style for GET request.");
      }

    } else if (method === 'PUT') {
      // --- Handle PUT requests (Updating Data) ---
      fetchOptions.method = 'PUT';
      if (endpoint.startsWith('cwc/update-customer/')) {
        const route = endpoint.replace('cwc/', '');
        const paramStr = `?consumer_secret=${WC_CONSUMER_SECRET}`;
        apiUrl = `${WP_SITE_URL}/wp-json/cwc/v2/${route}${paramStr}`;
        fetchOptions.headers = { 'Content-Type': 'application/json' };
        fetchOptions.body = JSON.stringify(bodyData);
      } else {
        throw new Error("Unknown endpoint for PUT request.");
      }

    } else if (method === 'POST') {
      // --- Handle POST requests (Password Change) ---
      fetchOptions.method = 'POST';
      if (endpoint === 'cwc/customer/set-password') {
        const route = endpoint.replace('cwc/', '');
        const paramStr = `?consumer_secret=${WC_CONSUMER_SECRET}`;
        apiUrl = `${WP_SITE_URL}/wp-json/cwc/v2/${route}${paramStr}`;
        fetchOptions.headers = { 'Content-Type': 'application/json' };
        fetchOptions.body = JSON.stringify(bodyData);
      } else {
        throw new Error("Unknown endpoint for POST request.");
      }

    } else {
      throw new Error(`Unsupported method in body: ${method}`);
    }

    // --- Make the final API call to WordPress ---
    const response = await fetch(apiUrl, fetchOptions);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`WordPress API request failed: ${response.status} - ${errorBody}`);
    }

    const data = await response.json();
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