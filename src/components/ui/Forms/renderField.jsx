// renderField.js
import React from 'react';
import { Controller } from 'react-hook-form';
import { 
  Input, 
  Checkbox, 
  Radio, 
  Row, 
  Col, 
  Upload, 
  message, 
  Spin, 
  Select,
  Typography 
} from 'antd';
import { ArrowDownOutlined, LoadingOutlined } from '@ant-design/icons';
import  UploadSVG from "../../../assets/svg/uploadSVG"; 
import ArrowIcon from '../../../assets/svg/arrow';
const { TextArea } = Input;
const { Dragger } = Upload;
const { Text } = Typography;
const { Option } = Select;

const inputStyle = {
  background: "#ffff",
  color: "#B0B4C0",
  boxShadow: "0px 1px 2px 0px #1018280D",
  borderRadius: 6,
  height: 40,
  width: 80,
};

const selectStyle = {
  width: 120,
  height: 40,
  borderRadius: 6,
  marginTop: 0,
};

export const renderField = (field, { control, errors, getValues, fileUploadMutation }) => {
  const fieldName = field.id;
  const rules = {
    required: `${field.questionText} is required`,
  };

  switch (field.answerType) {
    case "paragraph":
      return (
        <Controller
          name={fieldName}
          control={control}
          rules={rules}
          render={({ field: { onChange, value } }) => (
            <TextArea
              onChange={onChange}
              value={value}
              style={{
                background: "#ffff",
                color: "#B0B4C0",
                borderColor: errors[fieldName] ? "#ff4d4f" : "#D0D5DD",
                boxShadow: "0px 1px 2px 0px #1018280D",
                borderRadius: 6,
                minHeight: "100px",
                maxHeight: "200px",
              }}
              autoSize={"none"}
              placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
            />
          )}
        />
      );
    case "short_answer":
      return (
        <Controller
          name={fieldName}
          control={control}
          rules={rules}
          render={({ field: { onChange, value } }) => (
            <Input
              onChange={onChange}
              value={value}
              style={{
                background: "#ffff",
                color: "#B0B4C0",
                borderColor: errors[fieldName] ? "#ff4d4f" : "#D0D5DD",
                boxShadow: "0px 1px 2px 0px #1018280D",
                borderRadius: 6,
                height: 40,
              }}
              placeholder="Enter your answer"
            />
          )}
        />
      );
    case "checkboxes":
      return (
        <Controller
          name={fieldName}
          control={control}
          rules={rules}
          render={({ field: { onChange, value } }) => (
            <Checkbox.Group
              onChange={onChange}
              value={value}
              style={{ width: "100%" }}
            >
              <Row gutter={[0, 8]}>
                {field.Options.map((option) => (
                  <Col span={24} key={option.id}>
                    <Checkbox value={option.text}>{option.text}</Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          )}
        />
      );
    case "multiple_choice":
      return (
        <Controller
          name={fieldName}
          control={control}
          rules={rules}
          render={({ field: { onChange, value } }) => (
            <Radio.Group
              onChange={onChange}
              value={value}
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              {field.Options.map((option) => (
                <Radio key={option.id} value={option.text}>
                  {option.text}
                </Radio>
              ))}
            </Radio.Group>
          )}
        />
      );
    case "file_upload":
      return (
        <Controller
          name={fieldName}
          control={control}
          rules={rules}
          render={({ field: { onChange } }) => (
            <Dragger
              style={{ padding: "20px 0" }}
              multiple={false}
              maxCount={1}
              showUploadList={false}
              beforeUpload={(file) => {
                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isLt5M) {
                  message.error("Image must be smaller than 5MB!");
                  return false;
                }
                onChange(file);
                return false;
              }}
            >
              {fileUploadMutation?.isPending ? (
                <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
              ) : (
                <>
                  <UploadSVG />
                  <p style={{ marginTop: 12, color: "#2f54eb", fontWeight: 500 }}>
                    Choose file
                  </p>
                </>
              )}
              <Text type="secondary">Size limit: 5MB</Text>
            </Dragger>
          )}
        />
      );

      case "date":
  return (
    <Controller
      name={fieldName}
      control={control}
      rules={{
        validate: (value) => {
          const errors = [];
          const month = parseInt(value?.month, 10);
          const day = parseInt(value?.day, 10);
          const year = parseInt(value?.year, 10);
          if (!month || month > 12) errors.push("Month must be between 1 and 12.");
          if (!day || day > 31) errors.push("Day must be between 1 and 31.");
          if (!year || value.year.length !== 4) errors.push("Year must be a 4-digit number.");
          return errors.length > 0 ? errors.join(" ") : true;
        },
      }}
      render={({ field: { onChange, value = {} } }) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Input
            placeholder="Month"
            value={value.month}
            onChange={(e) => onChange({ ...value, month: e.target.value })}
            style={inputStyle}
            maxLength={2}
          />
          <Input
            placeholder="Day"
            value={value.day}
            onChange={(e) => onChange({ ...value, day: e.target.value })}
            style={inputStyle}
            maxLength={2}
          />
          <Input
            placeholder="Year"
            value={value.year}
            onChange={(e) => onChange({ ...value, year: e.target.value })}
            style={{ ...inputStyle, width: 100 }}
            maxLength={4}
          />
        </div>
      )}
    />
  );

  case "time":
  return (
    <Controller
      name={fieldName}
      control={control}
      rules={{
        validate: (value) => {
          const hour = parseInt(value?.hour, 10);
          const minute = parseInt(value?.minute, 10);
          if (!hour || hour > 12) return "Hour must be between 1 and 12.";
          if (!minute || minute > 59) return "Minute must be between 0 and 59.";
          return true;
        },
      }}
      render={({ field: { onChange, value = {} } }) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Input
            placeholder="Hour"
            value={value.hour}
            onChange={(e) => onChange({ ...value, hour: e.target.value })}
            style={inputStyle}
            maxLength={2}
          />
          <Input
            placeholder="Minute"
            value={value.minute}
            onChange={(e) => onChange({ ...value, minute: e.target.value })}
            style={inputStyle}
            maxLength={2}
          />
          <Select
            placeholder="Time"
            value={value.period}
            suffixIcon={<ArrowIcon/>}
            onChange={(val) => onChange({ ...value, period: val })}
            style={{ ...selectStyle, width: 100 }}
            options={[
              { value: "AM", label: "AM" },
              { value: "PM", label: "PM" },
            ]}
          />
        </div>
      )}
    />
  );

    default:
      return null;
  }
};