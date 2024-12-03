import axios from "axios"; // Ensure axios is imported

const translatePropertyName = async () => {
  try {
    console.log("Translating property name...");

    // Ensure propertyName and currentLanguage are defined
    if (!propertyName.value || !currentLanguage.value) {
      throw new Error("propertyName or currentLanguage is not defined.");
    }

    const response = await axios.post("/api/translate", {
      text: propertyName.value.hr, // Croatian text
      targetLanguage: currentLanguage.value, // Language code (en, it, de)
    });

    console.log("Translation response:", response.data);

    // Update the propertyName object with the translated text
    propertyName.value[currentLanguage.value] = response.data.translatedText;
    console.log("Updated property name:", propertyName.value);
  } catch (error) {
    console.error("Error translating property name:", error);
    alert("Error translating property name. Please try again.");
  }
};
