import { supabase } from "../../../api/config/supabase";
import { SupabaseError } from "../../../data/props/supabaseError";
import { User } from "../../../data/types/user";
import { getPublicUrl } from "../getting-public-url/get-public-url";

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
      user.file_names = [];
      
      const imageUUID = user.image_id;
      if(imageUUID){
        let imageData = await getPublicUrl(imageUUID, "profil_image");
        if(imageData){
          user.image_url = imageData?.publicUrl;
          user.image_name = imageData?.fileName;
        }
      }

      const files_id = user.files;
      if(files_id && files_id.length > 0){
        for (let file_id of files_id) {
          const fileUrl = await getPublicUrl(file_id, "userFile");
          if (fileUrl) {
            user.files_url.push(fileUrl.publicUrl);
            // Extract only the file name without the file path
            const fileName = fileUrl.fileName.split('/').pop();
            if (fileName) {
              user.file_names.push(fileName);
            }
          }
        }
      }
      // console.log(`file Name: ${user.file_names}`);
    }
    // console.log(users);
    return users;
  } catch (error) {
    console.error("Error fetching users:", (error as Error).message);
    return [];
  }
}
