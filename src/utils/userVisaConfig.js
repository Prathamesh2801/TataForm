import { fetchAllUsers } from "../api/FetchAllUsersAPI";

export const userVisaConfig = {
  entity: "UserVisaInfo",
  idField: "SR_NO",

  fields: [
    { name: "SR_NO", label: "Sr No", type: "number", readonly: true, minWidth: 80, flex: 0.5 },
    { name: "Full_Name", label: "Full Name", type: "text", minWidth: 180, flex: 1.2 },
    { name: "Email_ID", label: "Email", type: "text", minWidth: 200, flex: 1.5 },
    { name: "Valid_Visa", label: "Valid Visa", type: "text", minWidth: 200, flex: 1.5 },
  ],

  api: {
    getAll: async (filters = {}) => {
      try {
        console.log("UserVisa API getAll called with filters:", filters);

        // extract Email_ID if passed
        const email = filters.Email_ID || null;

        const response = await fetchAllUsers(email);
        console.log("UserVisa API getAll response:", response);

        if (response?.Status && Array.isArray(response?.Data)) {
          return response.Data;
        } else {
          throw new Error(response?.Message || "Invalid response format");
        }
      } catch (error) {
        console.error("UserVisa API getAll error:", error);
        throw error;
      }
    },
  },
};
