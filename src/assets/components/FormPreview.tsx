import type React from "react";
import { useFormContext } from "react-hook-form";
import type { FormData, Section, Field } from "../types/form";

interface FormPreviewProps {
  formData: FormData;
}

const FormPreview: React.FC<FormPreviewProps> = ({ formData }) => {
  const { watch } = useFormContext();

  const renderField = (field: Field) => {
    const value = watch(field.id);
    let displayValue: string;

    switch (field.type) {
      case "checkbox":
        displayValue = value ? "Yes" : "No";
        break;
      case "file":
        displayValue = value ? "File selected" : "No file selected";
        break;
      case "dropdown":
      case "radio":
      case "country":
        displayValue = value || "Not selected";
        break;
      case "date":
        displayValue = value ? new Date(value).toLocaleDateString() : "Not set";
        break;
      case "phone":
        displayValue = value || "Not provided";
        break;
      default:
        displayValue = value ? value.toString() : "Not provided";
    }

    return (
      <div key={field.id} className="ml-4 mb-2">
        <span className="font-semibold">{field.label}:</span> {displayValue}
      </div>
    );
  };

  const renderSection = (section: Section, depth = 0) => {
    return (
      <div key={section.id} className={`mb-4 ${depth > 0 ? "ml-4" : ""}`}>
        <h3 className={`font-bold ${depth === 0 ? "text-lg" : "text-md"} mb-2`}>
          {section.title}
        </h3>
        {section.fields.map((field) =>
          "fields" in field
            ? renderSection(field as Section, depth + 1)
            : renderField(field as Field)
        )}
      </div>
    );
  };

  return (
    <div className="mt-8 border-t pt-4">
      <h2 className="text-2xl font-bold mb-4">Form Preview</h2>
      {formData.sections.length > 0 ? (
        formData.sections.map((section) => renderSection(section))
      ) : (
        <p>No form sections added yet.</p>
      )}
    </div>
  );
};

export default FormPreview;
