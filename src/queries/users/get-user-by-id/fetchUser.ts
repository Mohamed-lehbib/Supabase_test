import { supabase } from "../../../api/config/supabase";
import { User } from "../../../data/types/user";
import { getPublicUrl } from "../getting-image-public-url/get-public-url";

export async function fetchUser(id: string | undefined): Promise<User | null> {
    try {
        const { data: users, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", id);

        if (error) {
            throw error;
        }

        if (users && users.length === 1) {
            const user = users[0];
            if (user.image_id) {
                const imageData = await getPublicUrl(user.image_id, "profil_image");
                user.image_url = imageData?.publicUrl;
                user.image_name = imageData?.fileName;
            }
            return user;
        } else {
            console.error("User not found");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user:", (error as Error).message);
        return null;
    }
}
