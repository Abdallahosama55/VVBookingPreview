import { useQuery } from '@tanstack/react-query';

const fetchForm = async (slug) => {
  const base_url = "https://v-booking-eight.vercel.app";
  const response = await fetch(`${base_url}/api/forms/${slug}`);
  
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data;
};

export const useClientOnboardingForm = (slug) => {
  return useQuery({
    queryKey: ['client-onboarding-form', slug],
    queryFn: () => fetchForm(slug),
    enabled: !!slug, // ensures the query only runs when slug is truthy
  });
};
