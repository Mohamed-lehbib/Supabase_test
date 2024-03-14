import { supabase } from "../../../api/config/supabase";
import { SupabaseError } from "../../../data/props/supabaseError";

export async function fetchUsers():  Promise<User[]> {
    try {
      const { data: users, error } = await supabase.from("users").select("*");

      if (error) {
        throw error as SupabaseError; // Cast error to custom error type
      }

    //   console.log(users);
      return users;
    } catch (error) {
      console.error("Error fetching users:", (error as Error).message);
      return [];
    }
  }