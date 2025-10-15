import axios from "axios";
import { BASE_URL } from "../../config";

const GET_ALL_USERS_URL = BASE_URL + "/data.php";

export async function fetchAllUsers() {
  try {
    const response = await axios.get(GET_ALL_USERS_URL, {
      validateStatus: (status) => true,
    });

    console.log(" Data fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(" Error fetching data:", error);
    throw error;
  }
}
