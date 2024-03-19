import { supabase, supabaseService } from "../../../api/config/supabase";
import { User } from "../../../data/types/user";
import { uploadUserImage } from "../upload-user-image/uploadUserImage";

// export async function updateUser(user: User, image?: File): Promise<void> {
//   try {
//     console.log(image);
//     // Extract user details
//     const { id, name, email, password, role } = user;

//     // Update user details
//     const { data: userData, error: userError } = await supabase
//       .from("users")
//       .update({ name, email, password, role })
//       .eq("id", id);

//     if (userError) {
//       throw userError;
//     }

//     console.log("User details updated successfully:", userData);

//     // Update user's image if a new image is selected
//     if (image) {
//       // Replace the existing image in storage with the new image
//       const fileName = user.image_name;
//       console.log(fileName);
//       if(fileName) {
//       const { data: updateData, error: updateError } = await supabaseService
//         .storage
//         .from("profil_image")
//         .update(fileName, image);
//         console.log("-----------------------------failed here");
      
//       if (updateError) {
//         throw updateError;
//       }

//       console.log("User image updated successfully:", updateData);
//     }
//     }

//     console.log("User updated successfully!");
//   } catch (error) {
//     console.error("Error updating user:", (error as Error).message);
//     throw error;
//   }
// }

export async function updateUser(user: User, image?: File): Promise<void> {
  try {
    console.log(image);
    // Extract user details
    const { id, name, email, password, role } = user;

    // Update user details
    const { data: userData, error: userError } = await supabase
      .from("users")
      .update({ name, email, password, role })
      .eq("id", id);

    if (userError) {
      throw userError;
    }

    console.log("User details updated successfully:", userData);

    // Update user's image if a new image is selected
    if (image) {
      // Check if user already has an image
      if (!user.image_id) {
        // Upload the new image and get the UUID
        const imageUUID = await uploadUserImage(image);
        // Update the user with the new image UUID
        const { data: updateUserData, error: updateError } = await supabase
          .from("users")
          .update({ image_id: imageUUID })
          .eq("id", id);

        if (updateError) {
          throw updateError;
        }

        console.log("User image updated successfully:", updateUserData);
      } else {
        // Replace the existing image in storage with the new image
        const fileName = user.image_name;
        console.log(fileName);
        if (fileName) {
          const { data: updateData, error: updateError } = await supabaseService
            .storage
            .from("profil_image")
            .update(fileName, image);
          console.log("-----------------------------failed here");

          if (updateError) {
            throw updateError;
          }

          console.log("User image updated successfully:", updateData);
        }
      }
    }

    console.log("User updated successfully!");
  } catch (error) {
    console.error("Error updating user:", (error as Error).message);
    throw error;
  }
}