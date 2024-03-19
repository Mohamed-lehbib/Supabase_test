import { supabaseService } from "../../../api/config/supabase";
import { User } from "../../../data/types/user";

export async function getPublicUrl(users: User[]){
  for (const user of users) {
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
  }
}
