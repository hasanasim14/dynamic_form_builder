"use client";

import type React from "react";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import type {
  FormData,
  Section,
  Field,
  FieldType,
  DropdownField,
  RadioField,
  CheckboxField,
  FileField,
  CountryField,
  DateField,
  PhoneField,
  TextField,
} from "../types/form";
import SectionRenderer from "./SectionRenderer";
import FormPreview from "./FormPreview";
import AddSectionModal from "./AddSectionModal";

const FormBuilder: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ sections: [] });
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);
  const methods = useForm();

  const addSection = (
    sectionTitle: string,
    fields: { type: FieldType; label: string; options?: string[] }[]
  ) => {
    const newSection: Section = {
      id: uuidv4(),
      title: sectionTitle,
      label: sectionTitle,
      type: "section",
      fields: fields.map((field) => {
        const baseField = {
          id: uuidv4(),
          ...field,
          value: field.type === "checkbox" ? false : "",
          required: true,
        };

        switch (field.type) {
          case "text":
            return baseField as TextField;
          case "dropdown":
            return {
              ...baseField,
              options: field.options || [],
            } as DropdownField;
          case "radio":
            return { ...baseField, options: field.options || [] } as RadioField;
          case "checkbox":
            return baseField as CheckboxField;
          case "file":
            return baseField as FileField;
          case "country":
            return baseField as CountryField;
          case "date":
            return baseField as DateField;
          case "phone":
            return baseField as PhoneField;
          default:
            throw new Error(`Unknown field type: ${field.type}`);
        }
      }),
    };

    setFormData((prev) => {
      if (currentParentId) {
        return {
          ...prev,
          sections: updateNestedSection(
            prev.sections,
            currentParentId,
            newSection
          ),
        };
      }
      return {
        ...prev,
        sections: [...prev.sections, newSection],
      };
    });
    setCurrentParentId(null);
  };

  const updateNestedSection = (
    sections: Section[],
    parentId: string,
    newSection: Section
  ): Section[] => {
    return sections.map((section) => {
      if (section.id === parentId) {
        return {
          ...section,
          fields: [...section.fields, newSection],
        };
      } else if ("fields" in section) {
        return {
          ...section,
          fields: updateNestedSection(
            section.fields.filter(
              (field): field is Section =>
                "type" in field && field.type === "section"
            ),
            parentId,
            newSection
          ),
        };
      }
      return section;
    });
  };

  const addField = (
    sectionId: string,
    fields: { type: FieldType; label: string; options?: string[] }[]
  ) => {
    setFormData((prev) => {
      const updateFields = (sections: Section[]): Section[] => {
        return sections.map((section) => {
          if (section.id === sectionId) {
            return {
              ...section,
              fields: [
                ...section.fields,
                ...fields.map((field): Field => {
                  const baseField = {
                    id: uuidv4(),
                    ...field,
                    value: field.type === "checkbox" ? false : "",
                    required: true,
                  };

                  switch (field.type) {
                    case "text":
                      return baseField as TextField;
                    case "dropdown":
                      return {
                        ...baseField,
                        options: field.options || [],
                      } as DropdownField;
                    case "radio":
                      return {
                        ...baseField,
                        options: field.options || [],
                      } as RadioField;
                    case "checkbox":
                      return baseField as CheckboxField;
                    case "file":
                      return baseField as FileField;
                    case "country":
                      return baseField as CountryField;
                    case "date":
                      return baseField as DateField;
                    case "phone":
                      return baseField as PhoneField;
                    default:
                      throw new Error(`Unknown field type: ${field.type}`);
                  }
                }),
              ],
            };
          } else if ("fields" in section) {
            return {
              ...section,
              fields: updateFields(
                section.fields.filter(
                  (field): field is Section =>
                    "type" in field && field.type === "section"
                )
              ),
            };
          }
          return section;
        });
      };

      return {
        ...prev,
        sections: updateFields(prev.sections),
      };
    });
  };

  const updateField = (fieldId: string, updates: Partial<Field>) => {
    setFormData((prev) => {
      const updateFields = (
        fields: (Field | Section)[]
      ): (Field | Section)[] => {
        return fields.map((item) => {
          if (item.id === fieldId) {
            return { ...item, ...updates } as Field;
          } else if ("fields" in item) {
            return {
              ...item,
              fields: updateFields(item.fields),
            };
          }
          return item;
        });
      };

      return {
        ...prev,
        sections: updateFields(prev.sections) as Section[],
      };
    });

    methods.setValue(fieldId, updates.value);
  };

  const removeSection = (sectionId: string) => {
    setFormData((prev) => {
      const removeFromSections = (sections: Section[]): Section[] => {
        return sections.filter((section) => {
          if (section.id === sectionId) {
            return false;
          }
          if ("fields" in section) {
            section.fields = removeFromSections(
              section.fields.filter(
                (field): field is Section =>
                  "type" in field && field.type === "section"
              )
            );
          }
          return true;
        });
      };

      return {
        ...prev,
        sections: removeFromSections(prev.sections),
      };
    });
  };

  const removeField = (fieldId: string) => {
    setFormData((prev) => {
      const removeFromFields = (
        fields: (Field | Section)[]
      ): (Field | Section)[] => {
        return fields.filter((field) => {
          if (field.id === fieldId) {
            return false;
          }
          if ("fields" in field) {
            field.fields = removeFromFields(field.fields);
          }
          return true;
        });
      };

      return {
        ...prev,
        sections: removeFromFields(prev.sections) as Section[],
      };
    });
  };

  const hasFields = formData.sections.some(
    (section) =>
      section.fields.length > 0 ||
      section.fields.some((item) => "fields" in item && item.fields.length > 0)
  );

  const onSubmit = (data: any) => {
    console.log("Submitted Data:", data);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="space-y-6 w-[80%] sm:w-[70%] md:w-[60%] lg:w-[45%] mx-auto"
      >
        <div className="space-y-4">
          {formData.sections.map((section) => (
            <SectionRenderer
              key={section.id}
              section={section}
              onAdd={addField}
              updateField={updateField}
              onAddNestedSection={(parentId) => {
                setCurrentParentId(parentId);
                setIsAddSectionModalOpen(true);
              }}
              onRemoveSection={removeSection}
              onRemoveField={removeField}
            />
          ))}
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsAddSectionModalOpen(true)}
            className="md:w-auto w-full"
          >
            Add Form
          </Button>
          <Button
            type="submit"
            variant="outline"
            disabled={!hasFields}
            className="md:w-auto w-full"
          >
            Submit
          </Button>
        </div>
      </form>
      <FormPreview formData={formData} />
      <AddSectionModal
        isOpen={isAddSectionModalOpen}
        onClose={() => setIsAddSectionModalOpen(false)}
        onAdd={addSection}
      />
    </FormProvider>
  );
};

export default FormBuilder;
