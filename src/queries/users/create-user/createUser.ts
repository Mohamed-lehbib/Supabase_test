import { supabase } from "../../../api/config/supabase";

export async function createUser(name: string, email: string, password: string, role: string): Promise<void> {
  try {
    const { data, error } = await supabase
      .from("users")
      .insert([{ name, email, password, role }]);

    if (error) {
      throw error;
    }

    console.log("User created successfully:", data);
  } catch (error) {
    console.error("Error creating user:", (error as Error).message);
    throw error;
  }
}
