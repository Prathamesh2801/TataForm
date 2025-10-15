import axios from "axios";
import { BASE_URL } from "../../config";

const GET_ALL_USERS_URL = BASE_URL + "/data.php";

export async function fetchAllUsers(Email_ID = null) {
  try {
    const response = await axios.get(GET_ALL_USERS_URL, {
      params: Email_ID ? { Email_ID } : {}, // 👈 only send when provided
      validateStatus: (status) => true,
    });

    console.log(
      Email_ID
        ? ` Data fetched successfully for Email_ID: ${Email_ID}`
        : " Data fetched successfully (all users)",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(" Error fetching data:", error);
    throw error;
  }
}
