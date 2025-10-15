import { fetchAllUsers } from "../api/FetchAllUsersAPI";

export const userVisaConfig = {
  entity: "UserVisaInfo",
  idField: "SR_NO", // unique field from response

  fields: [
    {
      name: "SR_NO",
      label: "Sr No",
      type: "number",
      readonly: true,
      minWidth: 80,
      flex: 0.5,
    },
    {
      name: "Full_Name",
      label: "Full Name",
      type: "text",
      minWidth: 180,
      flex: 1.2,
    },
    {
      name: "Address",
      label: "Address",
      type: "text",
      minWidth: 200,
      flex: 1.5,
    },
    {
      name: "Email_ID",
      label: "Email",
      type: "text",
      minWidth: 200,
      flex: 1.5,
    },
    {
      name: "Valid_Visa",
      label: "Valid Visa",
      type: "text",
      minWidth: 120,
      flex: 1,
    },
    {
      name: "Arranging_Visa",
      label: "Arranging Visa",
      type: "text",
      minWidth: 150,
      flex: 1,
    },
    {
      name: "Flight_Booking",
      label: "Flight Booking",
      type: "text",
      minWidth: 150,
      flex: 1,
    },
    {
      name: "Departure_City",
      label: "Departure City",
      type: "text",
      minWidth: 150,
      flex: 1,
    },
    {
      name: "Arrival_City",
      label: "Arrival City",
      type: "text",
      minWidth: 150,
      flex: 1,
    },
    {
      name: "Preference_Leisure_Activity",
      label: "Leisure Activity",
      type: "text",
      minWidth: 180,
      flex: 1.2,
    },
    {
      name: "Meal_Preference",
      label: "Meal Preference",
      type: "text",
      minWidth: 160,
      flex: 1.2,
    },
    {
      name: "Food_Allergies",
      label: "Food Allergies",
      type: "text",
      minWidth: 160,
      flex: 1.2,
    },
    {
      name: "Created_At",
      label: "Created At",
      type: "text",
      minWidth: 180,
      flex: 1,
      valueFormatter: (params) => {
        if (params?.value) {
          try {
            return new Date(params.value).toLocaleString();
          } catch {
            return params.value;
          }
        }
        return "";
      },
    },
  ],

  api: {
    getAll: async (filters) => {
      try {
        console.log("UserVisa API getAll called with filters:", filters);
        const response = await fetchAllUsers(filters);
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
