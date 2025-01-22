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
    return (
      <div key={field.id} className="ml-4">
        <strong>{field.label}:</strong> {value ? value.toString() : "N/A"}
      </div>
    );
  };

  const renderSection = (section: Section) => {
    return (
      <div key={section.id} className="mb-4">
        <h3 className="font-bold">{section.title}</h3>
        {section.fields.map((field) =>
          "fields" in field ? renderSection(field) : renderField(field)
        )}
      </div>
    );
  };

  return (
    <div className="mt-8 border-t pt-4">
      <h2 className="text-xl font-bold mb-4">Form Preview</h2>
      {formData.sections.map(renderSection)}
    </div>
  );
};

export default FormPreview;
