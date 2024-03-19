import { supabase, supabaseService } from "../../../api/config/supabase";
import { SupabaseError } from "../../../data/props/supabaseError";
import { User } from "../../../data/types/user";
import { getPublicUrl } from "../getting-image-public-url/get-public-url";

export async function fetchUsers(
  name?: string,
  role?: string
): Promise<User[]> {
  try {
    let query = supabase.from("users").select("*");
    if (role) {
      query = query.eq("role", role);
    }
    if (name) {
      query = query.ilike("name", `%${name}%`);
    }

    const { data: users, error } = await query;

    if (error) {
      throw error as SupabaseError;
    }

    for (const user of users) {
      user.files_url = [];
      
      const imageUUID = user.image_id;
      if(imageUUID){
        user.image_url= await getPublicUrl(imageUUID, "profil_image");
      }

      const files_id = user.files;
      if(files_id && files_id.length > 0){
        for (let file_id of files_id) {
          const fileUrl = await getPublicUrl(file_id, "userFile");
          if (fileUrl) {
            user.files_url.push(fileUrl);
          }
        }
      }
    }
    console.log(users);
    return users;
  } catch (error) {
    console.error("Error fetching users:", (error as Error).message);
    return [];
  }
}
