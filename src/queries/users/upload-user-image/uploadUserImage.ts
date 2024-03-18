import { supabaseService } from "../../../api/config/supabase";

export async function uploadUserImage(image: File): Promise<string| null> {

    const { v4: uuidv4 } = require("uuid");

    let imageId: string | null = null;
    if (image) {
      // const fileName = `${uuidv4()}.${file.name.split(".").pop()}`; // Generating UUID and appending file extension
      const { data, error } = await supabaseService.storage
        .from("profil_image")
        .upload(`/${uuidv4()}/${image.name}`, image);

      if (error) {
        throw error;
      }
      let dataAny = data as any;
      console.log(data);
      imageId = dataAny?.id;
    }
    return imageId;

}