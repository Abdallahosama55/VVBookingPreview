import React, { useState, useEffect } from "react";
import { Button, Divider, Result, Spin, Typography, message } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useSubmitForm } from "../services/submitForm/useSubmitForm";
import { renderField } from "../components/ui/Forms/renderField";
import NotAvalible from "../components/ui/Forms/NotAvalible";
import { useClientOnboardingForm, useClientOnboardingFormId } from "../services/Query/useClientOnboardingForm";
import { useParams, useSearchParams } from "react-router-dom";

const { Title, Text } = Typography;

const useFileUpload = () => {
  return useMutation({
    mutationFn: async (file) => {
      // In a real app, replace this with actual file upload API call
      // Example: return fetch('/api/upload', { method: 'POST', body: file })
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return {
        fileUrl: `https://example-bucket.s3.amazonaws.com/${file.name}`,
      };
    },
    onError: () => {
      message.error("File upload failed");
    },
  });
};

const TravelForm = () => {
  const [searchParams] = useSearchParams();
const submissionId = searchParams.get("getsubmit");

  const { data: dataFormInit, isLoading: isLoadingInit } = useClientOnboardingFormId(submissionId);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const { slug } = useParams(); // expects route like /forms/:slug
  const { data, isLoading, error, isError } = useClientOnboardingForm(slug);

  const fileUploadMutation = useFileUpload();
  const formSubmitMutation = useSubmitForm(slug);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Initialize form with default values when both form structure and initial data are loaded
  useEffect(() => {
    if (data && dataFormInit) {
      const defaultValues = {};
      
      // Map through the form questions and set initial values from dataFormInit
      data.Questions.forEach((question) => {
        const answerObj = dataFormInit.answers.find(
          (ans) => ans.question === question.questionText
        );
        
        if (answerObj) {
          if (question.answerType === "date" && answerObj.answer) {
            const [year, month, day] = answerObj.answer.split('-');
            defaultValues[question.id] = { year, month, day };
          } else if (question.answerType === "time" && answerObj.answer) {
            const [hour, minute] = answerObj.answer.split(':');
            let period = "AM";
            let hour12 = parseInt(hour);
            if (hour12 >= 12) {
              period = "PM";
              if (hour12 > 12) hour12 -= 12;
            }
            if (hour12 === 0) hour12 = 12;
            defaultValues[question.id] = {
              hour: hour12.toString(),
              minute,
              period
            };
          } else {
            defaultValues[question.id] = answerObj.answer;
          }
        }
      });
      
      reset(defaultValues);
    }
  }, [data, dataFormInit, reset]);

  const onSubmit = async (formData) => {
    try {
      // First handle file upload if present
      const fileUploadQuestion = data.Questions.find(
        (q) => q.answerType === "file_upload"
      );
      let fileUrl = null;

      if (fileUploadQuestion && formData[fileUploadQuestion.id]) {
        const uploadResponse = await fileUploadMutation.mutateAsync(
          formData[fileUploadQuestion.id]
        );
        fileUrl = uploadResponse.fileUrl;
      }

      // Prepare the submission data (without submit wrapper)
      const answers = data.Questions.map((question) => {
        const answerValue = formData[question.id];

        if (question.answerType === "date" && answerValue) {
          const { month, day, year } = answerValue;
          return {
            questionId: question.id,
            answer: `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
          };
        } else if (question.answerType === "time" && answerValue) {
          const { hour, minute, period } = answerValue;
          let hours = parseInt(hour);
          if (period === "PM" && hours < 12) hours += 12;
          if (period === "AM" && hours === 12) hours = 0;
          return {
            questionId: question.id,
            answer: `${hours.toString().padStart(2, "0")}:${minute.padStart(2, "0")}`,
          };
        } else if (question.answerType === "file_upload") {
          return {
            questionId: question.id,
            fileUrl: fileUrl, // Will be null if no file was uploaded
          };
        } else {
          return {
            questionId: question.id,
            answer: answerValue,
          };
        }
      }).filter(
        (item) => item.answer !== undefined || item.fileUrl !== undefined
      );

      // Create the final submission payload
      const submissionPayload = { answers };

      console.log("Form submission data:", submissionPayload);
      await formSubmitMutation.mutateAsync(submissionPayload, slug);
      setSubmissionSuccess(true);
    } catch (error) {
      console.error("Submission error:", error);
      // Consider adding user-facing error handling here
    }
  };

  if (isLoading || isLoadingInit) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" tip="Loading form..." />
      </div>
    );
  }

  if (isError || !slug) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Result
          status="error"
          title="Failed to Load Form"
          subTitle={
            error?.message || "Something went wrong. Please try again later."
          }
        />
      </div>
    );
  }

  if (data.status === "inactive") {
    return <NotAvalible />;
  }

  if (submissionSuccess) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Result
          status="success"
          title="Form Submitted Successfully!"
          subTitle="Thank you for your submission. We'll get back to you soon."
        />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ maxWidth: 800, margin: "0 auto" }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          padding: 24,
          paddingTop: 5,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          marginBottom: 16,
        }}
      >
        <Title level={3} style={{ color: "#2A5CC1", fontSize: "28px" }}>
          {data.name}
        </Title>
        <Divider />
        <Title
          level={5}
          style={{ color: "#000", fontSize: "16px", fontWeight: "400" }}
        >
          {data.description}
        </Title>
      </div>
      {data.Questions.map((field) => (
        <div
          key={field.id}
          style={{
            background: "#fff",
            borderRadius: 8,
            padding: 24,
            paddingTop: 5,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            marginBottom: 16,
          }}
        >
          <Title level={5} style={{ color: "#2A5CC1", fontSize: "18px" }}>
            {field.questionText}
          </Title>
          <Divider
            style={{
              marginTop: 0,
              marginBottom: 16,
              color: "#D0D5DD",
              backgroundColor: "#D0D5DD",
            }}
          />
          {renderField(field, {
            control,
            errors,
            getValues,
            fileUploadMutation,
          })}
          {errors[field.id] && (
            <Text style={{ color: "#ff4d4f", marginTop: 8, display: "block" }}>
              {errors[field.id].message}
            </Text>
          )}
        </div>
      ))}

      <Button
        type="primary"
        htmlType="submit"
        loading={formSubmitMutation.isPending || fileUploadMutation.isPending}
        style={{
          width: "100%",
          fontWeight: "600",
          paddingBlock: "18px",
          backgroundColor: "#2D6ADB",
          borderColor: "#2D6ADB",
          height: 42,
          borderRadius: 8,
        }}
      >
        {formSubmitMutation.isPending || fileUploadMutation.isPending
          ? "Submitting..."
          : "Submit Form"}
      </Button>
    </form>
  );
};

export default TravelForm;