import { supabase } from "../../../api/config/supabase";

export async function deleteUser(id: number, setListlen: React.Dispatch<React.SetStateAction<number>>): Promise<void> {
    try {
        const { error } = await supabase.from("users").delete().eq("id", id);

        if (error) {
            throw error;
        }

        console.log("User deleted successfully:", id);
        setListlen(prev => prev - 1);
    } catch (error) {
        console.error("Error deleting user:", (error as Error).message);
    }
};
