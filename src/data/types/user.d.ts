import { UUID } from "crypto";

type User = {
    id: number;
    name: string;
    email: string;
    password?: string;
    role: string;
    image_id?: UUID;
    image_url?: string;
  };