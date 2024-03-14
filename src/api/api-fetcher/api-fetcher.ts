import { supabase } from "../config/supabase";


async function logResponse(response: any): Promise<void> {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Response:`, response);
}

async function makeRequest<T>(
    url: string,
    method: string,
    data?: unknown,
    headers?: HeadersInit
  ): Promise<any> {
    try {
      let response;
  
      switch (method) {
        case "GET":
          response = await supabase.from(url).select('*'); 
          break;
        case "POST":
          response = await supabase.from(url).insert(data); // Incorrect usage, remove '.headers(headers)'
          break;
        case "PUT":
          response = await supabase.from(url).update(data); // Incorrect usage, remove '.headers(headers)'
          break;
        case "DELETE":
          response = await supabase.from(url).delete(); // Incorrect usage, remove '.headers(headers)'
          break;
        default:
          throw new Error("Unsupported HTTP method");
      }
  
      if (response.error) {
        throw new Error(`Supabase error: ${response.error.message}`);
      }
  
      await logResponse(response);
      return response;
    } catch (error) {
      console.error("Error making request:", error);
      throw error;
    }
  }
  

export async function apiFetcher(request: RequestType): Promise<any> {
  try {
    const response = await makeRequest(request.url, request.method, request.body, request.headers);
    return response;
  } catch (error) {
    throw error;
  }
}
