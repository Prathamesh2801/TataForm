import axios from "axios";
import { BASE_URL } from "../../config";

const SUBMIT_URL = BASE_URL + "/data.php";

export async function SubmitData(formData) {
  const bodyFormData = new FormData();

  // Map frontend formData to backend field names
  bodyFormData.append("Full_Name", formData.fullName || "");
  bodyFormData.append("Email_ID", formData.email || "");
  bodyFormData.append("Address", formData.address || "");
  bodyFormData.append("Valid_Visa", formData.hasVisa || ""); // Yes / No
  bodyFormData.append("Arranging_Visa", formData.needsVisaAssistance || ""); // Yes / No
  bodyFormData.append("Flight_Booking", formData.needsFlightBooking || ""); // Yes / No

  // Meal Preference (and other fields)
  bodyFormData.append("Meal_Preference", formData.mealPreference || "");
  bodyFormData.append(
    "Meal_Preference_Other",
    formData.mealPreferenceOther || ""
  );
  bodyFormData.append("Food_Allergies", formData.foodAllergies || "");

  // Departure and Arrival
  bodyFormData.append("Departure_City", formData.departureCity || "");
  bodyFormData.append(
    "Departure_City_Other",
    formData.departureCityOther || ""
  );
  bodyFormData.append("Arrival_City", formData.arrivalCity || "");
  bodyFormData.append("Arrival_City_Other", formData.arrivalCityOther || "");

  // Optional travel options
  bodyFormData.append("Flight_Option_Departure", "");
  bodyFormData.append("Flight_Option_Arrival", "");
  bodyFormData.append(
    "Preference_Leisure_Activity",
    formData.leisureActivity || ""
  );

  try {
    const response = await axios.post(SUBMIT_URL, bodyFormData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      validateStatus: (status) => true,
    });

    console.log(" Data submitted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(" Error submitting data:", error);
    throw error;
  }
}
