import { supabase } from "../../../api/config/supabase";
import { User } from "../../../data/types/user";

export async function fetchUser(id: string | undefined): Promise<User | null> { // I have done this because the value in use Param is of type: id: string | undefined
    try {
        const { data: users, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", id);

        if (error) {
            throw error;
        }

        if (users && users.length === 1) {
            return users[0];
        } else {
            console.error("User not found");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user:", (error as Error).message);
        return null;
    }
}
