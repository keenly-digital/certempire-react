// supabase/functions/record-purchase/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

function generateRandomPassword() {
  return Math.random().toString(36).slice(-12);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const { email, file_id } = body
    console.log(`Function invoked for email: ${email} and file_id: ${file_id}`);

    if (!email || !file_id) {
      throw new Error("Missing customer email or file ID")
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    let { data: existingUser, error: findError } = await supabaseAdmin.rpc('get_user_id_by_email', { p_email: email });
    let userId = existingUser;

    if (!userId) {
      console.log(`User not found. Creating new user for: ${email}`);
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: generateRandomPassword(),
        email_confirm: true,
      });
      if (createError) throw createError;
      userId = newUser.user.id;
      console.log(`New user created with ID: ${userId}`);
    } else {
      console.log(`Found existing user with ID: ${userId}`);
    }
    
    // --- THIS IS THE PART WE NEED TO DEBUG ---
    console.log(`Attempting to insert into user_purchases: user_id=${userId}, file_id=${file_id}`);

    const { data: insertData, error: insertError } = await supabaseAdmin
      .from('user_purchases')
      .insert({ user_id: userId, file_id: file_id })
      .select() // Add .select() to get the inserted data back

    if (insertError) {
      console.error("DATABASE INSERT FAILED:", insertError); // Detailed log for insert error
      throw insertError
    }

    console.log("Purchase recorded successfully:", insertData);
    
    return new Response(JSON.stringify({ message: 'Purchase recorded successfully', supabase_user_id: userId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error("An error occurred in the function:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})