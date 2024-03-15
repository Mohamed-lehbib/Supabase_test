import { supabase, supabaseService } from "../../../api/config/supabase";

// export async function createUser(name: string, email: string, password: string, role: string): Promise<void> {
//   try {
//     const { data, error } = await supabase
//       .from("users")
//       .insert([{ name, email, password, role }]);

//     if (error) {
//       throw error;
//     }

//     console.log("User created successfully:", data);
//   } catch (error) {
//     console.error("Error creating user:", (error as Error).message);
//     throw error;
//   }
// }

// import { supabase } from "../../../api/config/supabase";
// import { Storage } from '@supabase/storage';

export async function createUser(
  name: string,
  email: string,
  password: string,
  role: string,
  file?: File
): Promise<void> {
  try {
    // Upload file to Supabase Storage if provided
    const { v4: uuidv4 } = require("uuid");

    let imageId: string | null = null;
    if (file) {
      // const fileName = `${uuidv4()}.${file.name.split(".").pop()}`; // Generating UUID and appending file extension
      const { data, error } = await supabaseService.storage
        .from("profil_image")
        .upload(`/${uuidv4()}/${file.name}`, file);

      if (error) {
        throw error;
      }
      let dataAny = data as any;
      console.log(data);
      imageId = dataAny?.id;
    }

    // Insert user into the "users" table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert([{ name, email, password, role, image_id: imageId }]);

    if (userError) {
      throw userError;
    }

    console.log("User created successfully:", userData);
  } catch (error) {
    console.error("Error creating user:", (error as Error).message);
    throw error;
  }

  // const { data, error } = await supabase
  // .storage
  // .listBuckets()
  // console.log(data);
}
