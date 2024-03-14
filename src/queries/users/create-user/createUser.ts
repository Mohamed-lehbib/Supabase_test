import { supabase } from "../../../api/config/supabase";

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

export async function createUser(name: string, email: string, password: string, role: string, file?: File): Promise<void> {
  // try {
  //   // Upload file to Supabase Storage if provided
  //   let imageId: string | null = null;
  //   if (file) {
  //     const { data, error } = await supabase.storage.from('profil_image').upload(`/${file.name}`, file);

  //     if (error) {
  //       throw error;
  //     }
  //     console.log(data);
  //     // imageId = data?.id;
  //   }

  //   // Insert user into the "users" table
  //   const { data: userData, error: userError } = await supabase
  //     .from("users")
  //     .insert([{ name, email, password, role, image_id: imageId }]);

  //   if (userError) {
  //     throw userError;
  //   }

  //   console.log("User created successfully:", userData);
  // } catch (error) {
  //   console.error("Error creating user:", (error as Error).message);
  //   throw error;
  // }
  
const { data, error } = await supabase
.storage
.listBuckets()
console.log(data);
}
