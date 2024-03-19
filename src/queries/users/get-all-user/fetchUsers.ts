import { supabase, supabaseService } from "../../../api/config/supabase";
import { SupabaseError } from "../../../data/props/supabaseError";
import { User } from "../../../data/types/user";
import { getPublicUrl } from "../getting-image-public-url/getting-image-public-url";

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
    getPublicUrl(users);
    // Loop through users
    for (const user of users) {
      user.files_url = [];
      // ------------------------------------------------------------
      // Retrieving the image public url
      const imageUUID = user.image_id;
      // if (imageUUID) {
      // Fetch the image name
      const { data: image, error } = await supabaseService
        .schema("storage")
        .from("objects")
        .select(`*`)
        .eq("id", imageUUID);
      console.log(image);

      if (error) {
        console.error("Error fetching image:", error.message);
      } else {
        const file = image as any;
        const imageName = await file[0].name;
        // console.log(`imageName :-----------${imageName}`);
        // console.log(`image name: ${file[0].name}`);
        // Fetch public URL of the image
        const { data: imageUrl } = supabaseService.storage
          .from("profil_image")
          .getPublicUrl(imageName);
        console.log(imageUrl);
        console.log(`image name: ${imageName}`);
        // console.log(`image url: ${imageUrl.publicUrl}`);
        // console.log(imageName);
        if (imageUrl) {
          // Assign the imageUrl to the user
          user.image_url = imageUrl.publicUrl;
          // console.log(`image public url :-------------------- ${imageUrl.publicUrl}`);
          // console.log(`user image public url :-------------------- ${user.image_url}`);
        }
      }
      //----------------------------------------------------------------------------
      // Retrieving the File public url
      const filesUUID = user.files;
      // if (imageUUID) {
      // Fetch the image name
      for (const file of filesUUID) {
        const { data: bucket_fileName, error } = await supabaseService
          .schema("storage")
          .from("objects")
          .select(`*`)
          .eq("id", file);
        console.log(bucket_fileName);

        if (error) {
          console.error("Error fetching file:", error.message);
        } else {
          const bucket_fileName_any = bucket_fileName as any;
          const fileName = await bucket_fileName_any[0].name;
          // console.log(`imageName :-----------${imageName}`);
          // console.log(`image name: ${file[0].name}`);
          // Fetch public URL of the image
          const { data: fileUrl } = supabaseService.storage
            .from("userFile")
            .getPublicUrl(fileName);
          // console.log(fileUrl);
          // console.log(`image name: ${imageName}`);
          // console.log(`image url: ${imageUrl.publicUrl}`);
          // console.log(imageName);
          if (fileUrl) {
            // Assign the imageUrl to the user
            
            user.files_url.push(fileUrl.publicUrl);
            console.log(user.files_url);
            // console.log(`image public url :-------------------- ${imageUrl.publicUrl}`);
            // console.log(`user image public url :-------------------- ${user.image_url}`);

          }
        }
      }
    }
    // }
    console.log(users);
    return users;
  } catch (error) {
    console.error("Error fetching users:", (error as Error).message);
    return [];
  }
}
