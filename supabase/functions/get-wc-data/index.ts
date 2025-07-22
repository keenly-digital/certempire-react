// supabase/functions/get-wc-data/index.ts

import { corsHeaders } from '../_shared/cors.ts'
import { Buffer } from 'https://deno.land/std@0.177.0/node/buffer.ts'

Deno.serve(async (req) => {
  console.log('Edge Function Env Vars:', {
    WP_SITE_URL: Deno.env.get('STAGING_SITE_URL'),
    WC_CONSUMER_KEY: Deno.env.get('STAGING_CONSUMER_KEY'),
    WC_CONSUMER_SECRET: Deno.env.get('STAGING_SECRET_KEY'),
  });

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Parse and log request body
    const reqBody = await req.json();
    console.log('Edge Function: Received Body:', reqBody);
    const { site, method, endpoint, user_id, ...bodyData } = reqBody;

    // 2. Select envs and log
    let WC_CONSUMER_KEY, WC_CONSUMER_SECRET, WP_SITE_URL;
    if (site === 'certempire') {
      WC_CONSUMER_KEY = Deno.env.get('CERTMPIRE_WC_CONSUMER_KEY');
      WC_CONSUMER_SECRET = Deno.env.get('CERTMPIRE_WC_CONSUMER_SECRET');
      WP_SITE_URL = Deno.env.get('CERTMPIRE_WP_SITE_URL');
    } else if (site === 'staging') {
      WC_CONSUMER_KEY = Deno.env.get('STAGING_CONSUMER_KEY');
      WC_CONSUMER_SECRET = Deno.env.get('STAGING_SECRET_KEY');
      WP_SITE_URL = Deno.env.get('STAGING_SITE_URL');
    }
    console.log('Using Env:', { site, WP_SITE_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET });

    let apiUrl = '';
    let fetchOptions: RequestInit = {};

    // --- ROUTE BASED ON THE METHOD PROVIDED IN THE BODY ---

    if (method === 'GET') {
      fetchOptions.method = 'GET';
      let paramStr = '';

      if (endpoint.startsWith('wc/')) {
        apiUrl = `${WP_SITE_URL}/wp-json/wc/v3/${endpoint.replace('wc/', '')}`;
        if (user_id) apiUrl += `?customer=${user_id}`;
        const authString = `${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`;
        const encodedAuth = Buffer.from(authString).toString('base64');
        fetchOptions.headers = { 'Authorization': `Basic ${encodedAuth}` };
      } else if (endpoint.startsWith('cwc/')) {
        const route = endpoint.replace('cwc/', '');
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

    // 3. Log API call details
    console.log('Calling WordPress API:', { apiUrl, fetchOptions });

    // 4. Fetch, log response status/body, and parse result
    const response = await fetch(apiUrl, fetchOptions);
    const responseText = await response.text();
    console.log('WordPress API response status:', response.status);
    console.log('WordPress API raw response body:', responseText);

    if (!response.ok) {
      throw new Error(`WordPress API request failed: ${response.status} - ${responseText}`);
    }

    const data = JSON.parse(responseText);
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Edge Function Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
