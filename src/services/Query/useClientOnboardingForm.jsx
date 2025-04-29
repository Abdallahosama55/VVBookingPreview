import { useQuery } from '@tanstack/react-query';

const fetchForm = async (slug) => {
  const base_url = "https://api.vbooking.ai/api/v6";
  const response = await fetch(`${base_url}/forms/${slug}`);
  
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data;
};
const fetchSubmissionById = async (submissionId) => {
  const base_url = "https://api.vbooking.ai/api/v6";
  const response = await fetch(`${base_url}/forms/${submissionId}/submissions/get-by-id`);

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
export const useClientOnboardingFormId = (submissionId) => {
  return useQuery({
    queryKey: ['client-onboarding-form', submissionId],
    queryFn: () => fetchSubmissionById(submissionId),
    enabled: !!submissionId, // only fetch if submissionId is provided
  });
};