import { useMutation } from "@tanstack/react-query";
import { message } from "antd";

export const useSubmitForm = (slug) => {
    return useMutation({
      mutationFn: async (formData) => {
        const res = await fetch(`https://api.vbooking.ai/api/v6/forms/${slug}/submissions/submit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
  
        if (!res.ok) {
          throw new Error("Failed to submit form");
        }
  
        return res.json();
      },
      onSuccess: () => {
        message.success("Thank you for applying!");
      },
      onError: () => {
        message.error("Form submission failed");
      },
    });
  };
  