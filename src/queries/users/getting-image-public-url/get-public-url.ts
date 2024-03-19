import { UUID } from "crypto";
import { supabaseService } from "../../../api/config/supabase";
import { User } from "../../../data/types/user";

export async function getPublicUrl(fileId: UUID, bucketName: string): Promise<string | null> {
  try {
    const { data: file, error } = await supabaseService
      .schema("storage")
      .from("objects")
      .select("*")
      .eq("id", fileId);
    if (error) {
      console.error("Error fetching image:", error.message);
      return null;
    }
    const fileName = file[0].name;
    const { data: fileUrl } = await supabaseService.storage
      .from(bucketName)
      .getPublicUrl(fileName);
    if (fileUrl) {
      return fileUrl.publicUrl;
    }
    return null;
  } catch (error: any) {
    console.error("Error fetching image:", error.message);
    return null;
  }
}
