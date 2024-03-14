import { supabase } from "../../../api/config/supabase";

export async function updateUser(id: string | undefined, name: string, email: string, password: string, role: string): Promise<void> {
  try {
    const { data, error } = await supabase
      .from("users")
      .update({ name, email, password, role })
      .eq("id", id)

    if (error) {
      throw error;
    }

    console.log("User updated successfully:", data);
  } catch (error) {
    console.error("Error updating user:", (error as Error).message);
    throw error;
  }
}
