// supabase/functions/record-purchase/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // This is needed for CORS requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const { email, file_id } = body

    if (!email || !file_id) {
      // This is the error you were seeing. It means the body was empty.
      console.error("Request body did not contain email or file_id.", body);
      throw new Error("Missing customer email or file ID")
    }
    
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Find the user's ID using their email address
    const { data: userData, error: userError } = await supabaseAdmin.rpc('get_user_id_by_email', { p_email: email });

    if (userError || !userData) {
      console.error("Error finding user:", userError);
      throw new Error(`Could not find user with email: ${email}`);
    }
    const userId = userData;

    // Insert the purchase record into our new table
    const { error: insertError } = await supabaseAdmin
      .from('user_purchases')
      .insert({ user_id: userId, file_id: file_id })

    if (insertError) {
      console.error("Error inserting purchase:", insertError);
      throw insertError
    }

    return new Response(JSON.stringify({ message: 'Purchase recorded successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error("An error occurred in the function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})