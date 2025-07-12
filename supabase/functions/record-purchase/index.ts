// supabase/functions/record-purchase/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

// This function generates a random password for new users, as WordPress handles the actual login.
function generateRandomPassword() {
  return Math.random().toString(36).slice(-12);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, file_id } = await req.json()
    if (!email || !file_id) throw new Error("Missing customer email or file ID")

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check if user already exists
    let { data: existingUser, error: findError } = await supabaseAdmin.rpc('get_user_id_by_email', { p_email: email });

    let userId = existingUser;

    // If user does NOT exist, create them
    if (!userId) {
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: generateRandomPassword(),
        email_confirm: true, // Automatically confirm the email
      });

      if (createError) throw createError;
      userId = newUser.user.id;
    }
    
    // Now that we have a userId (either existing or new), record the purchase.
    const { error: insertError } = await supabaseAdmin
      .from('user_purchases')
      .insert({ user_id: userId, file_id: file_id })

    if (insertError) throw insertError

    // IMPORTANT: We now return the Supabase User ID in the response
    return new Response(JSON.stringify({ message: 'Purchase recorded successfully', supabase_user_id: userId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})