import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

// 🔹 Replace with your Supabase project details
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --------------- Helper Functions -----------------

// Register a new user
export async function registerUser(email: string, name: string, password: string) {
  try {
    // hash password on client (you could also hash in API/server)
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("users")
      .insert([{ email, name, password_hash: hashedPassword }])
      .select();

    if (error) throw error;
    return { user: data[0], error: null };
  } catch (err: any) {
    return { user: null, error: err.message };
  }
}

// Login user (manual password check)
export async function loginUser(email: string, password: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, email, name, password_hash")
      .eq("email", email)
      .single();

    if (error) throw error;

    const isValid = await bcrypt.compare(password, data.password_hash);
    if (!isValid) {
      throw new Error("Invalid password");
    }

    // Return user without password
    const { password_hash, ...userSafe } = data;
    return { user: userSafe, error: null };
  } catch (err: any) {
    return { user: null, error: err.message };
  }
}
