import { supabase } from "../../../api/config/supabase";
import { SupabaseError } from "../../../data/props/supabaseError";

// export async function fetchUsers():  Promise<User[]> {
//     try {
//       const { data: users, error } = await supabase.from("users").select("*");

//       if (error) {
//         throw error as SupabaseError; // Cast error to custom error type
//       }

//     //   console.log(users);
//       return users;
//     } catch (error) {
//       console.error("Error fetching users:", (error as Error).message);
//       return [];
//     }
//   }

export async function fetchUsers(name?: string, role?: string): Promise<User[]> {
    try {
        let query = supabase.from("users").select("*");

        if (name && role) {
            query = query.eq('role', role).ilike('name', `%${name}%`);
        } else if (role) {
            query = query.eq('role', role);
        } else if (name) {
            query = query.ilike('name', `%${name}%`);
        }

        const { data: users, error } = await query;

        if (error) {
            throw error as SupabaseError;
        }

        return users;
    } catch (error) {
        console.error("Error fetching users:", (error as Error).message);
        return [];
    }
}
