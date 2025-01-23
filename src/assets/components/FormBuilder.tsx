"use client";

import React, { useState } from "react";
import SectionRenderer from "./SectionRenderer";
import FormPreview from "./FormPreview";
import AddSectionModal from "./AddSectionModal";
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
  FileField,
  TextField,
  CheckboxField,
  CountryField,
  DateField,
  PhoneField,
} from "../types/form";

const FormBuilder: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ sections: [] });
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);
  const methods = useForm();

  // const addSection = (
  //   formTitle: string,
  //   fields: { type: FieldType; label: string; options?: string[] }[]
  // ) => {
  //   const newSection: Section = {
  //     id: uuidv4(),
  //     title: formTitle,
  //     fields: fields.map((field) => ({
  //       id: uuidv4(),
  //       ...field,
  //     })),
  //   };
  //   setFormData((prev) => {
  //     if (currentParentId) {
  //       return {
  //         ...prev,
  //         sections: updateNestedSection(
  //           prev.sections,
  //           currentParentId,
  //           newSection
  //         ),
  //       };
  //     }
  //     return {
  //       ...prev,
  //       sections: [...prev.sections, newSection],
  //     };
  //   });
  //   setCurrentParentId(null);
  // };

  const addSection = (
    formTitle: string,
    fields: { type: FieldType; label: string; options?: string[] }[]
  ) => {
    const newSection: Section = {
      id: uuidv4(),
      title: formTitle,
      fields: fields.map((field) => {
        switch (field.type) {
          case "dropdown":
          case "radio":
            return {
              id: uuidv4(),
              type: field.type,
              label: field.label,
              options: field.options || [],
            } as DropdownField | RadioField;

          case "file":
            return {
              id: uuidv4(),
              type: field.type,
              label: field.label,
            } as FileField;

          case "checkbox":
          case "country":
          case "date":
          case "phone":
          case "text":
            return {
              id: uuidv4(),
              type: field.type,
              label: field.label,
            } as
              | TextField
              | CheckboxField
              | CountryField
              | DateField
              | PhoneField;

          default:
            throw new Error(`Unsupported field type: ${field.type}`);
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

  const hasFields = formData.sections.some(
    (section) =>
      section.fields.length > 0 ||
      section.fields.some((item) => "fields" in item && item.fields.length > 0)
  );

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
            section.fields as Section[],
            parentId,
            newSection
          ),
        };
      }
      return section;
    });
  };

  const addField = (sectionId: string) => {
    setFormData((prev) => {
      const newField: Field = {
        id: uuidv4(),
        type: "text",
        label: "New Field",
      };

      // const updateFields = (fields: (Field | Section)[]) => {
      //   return fields.map((item) => {
      //     if (item.id === sectionId) {
      //       return {
      //         ...item,
      //         fields: [...(item as Section).fields, newField],
      //       };
      //     } else if ("fields" in item) {
      //       return {
      //         ...item,
      //         fields: updateFields(item.fields),
      //       };
      //     }
      //     return item;
      //   });
      // };

      const updateFields = (
        fields: (Field | Section)[]
      ): (Field | Section)[] => {
        return fields.map((item) => {
          if (item.id === sectionId) {
            return {
              ...item,
              fields: [...(item as Section).fields, newField],
            };
          } else if ("fields" in item) {
            return {
              ...item,
              fields: updateFields(item.fields), // Recursive call
            };
          }
          return item; // Return unchanged item
        });
      };

      return {
        ...prev,
        sections: updateFields(prev.sections) as Section[],
      };
    });
  };

  // const removeField = (fieldId: string) => {
  //   setFormData((prev) => {
  //     const filterFields = (
  //       fields: (Field | Section)[]
  //     ): (Field | Section)[] => {
  //       return fields
  //         .filter((item) => item.id !== fieldId) // Exclude the field by ID
  //         .map((item) => {
  //           if ("fields" in item) {
  //             return { ...item, fields: filterFields(item.fields) };
  //           }
  //           return item;
  //         });
  //     };

  //     return {
  //       ...prev,
  //       sections: filterFields(prev.sections) as Section[],
  //     };
  //   });
  // };

  // const isSection = (item: Field | Section): item is Section => {
  //   return "fields" in item;
  // };

  // const updateField = (fieldId: string, updates: Partial<Field>) => {
  //   setFormData((prev) => {
  //     // const updateFields = (fields: (Field | Section)[]) => {
  //     //   return fields.map((item) => {
  //     //     if (item.id === fieldId) {
  //     //       return { ...item, ...updates };
  //     //     } else if ("fields" in item) {
  //     //       return {
  //     //         ...item,
  //     //         fields: updateFields(item.fields),
  //     //       };
  //     //     }
  //     //     return item;
  //     //   });
  //     // };

  //     return {
  //       ...prev,
  //       sections: updateFields(prev.sections) as Section[],
  //     };
  //   });
  // };

  // const updateField = (fieldId: string, updates: Partial<Field>) => {
  //   setFormData((prev) => {
  //     const updateFields = (
  //       fields: (Field | Section)[]
  //     ): (Field | Section)[] => {
  //       return fields.map((item) => {
  //         if (item.id === fieldId) {
  //           // Update the matching field
  //           return { ...item, ...updates };
  //         } else if ("fields" in item) {
  //           // Recursively handle sections containing fields
  //           return {
  //             ...item,
  //             fields: updateFields(item.fields),
  //           };
  //         }
  //         return item;
  //       });
  //     };

  //     return {
  //       ...prev,
  //       sections: updateFields(prev.sections) as Section[],
  //     };
  //   });
  // };

  const updateField = (fieldId: string, updates: Partial<Field>) => {
    console.log("updateField called with:", { fieldId, updates });
    setFormData((prev) => {
      const updateFields = (fields: (Field | Section)[]): Section[] => {
        return fields
          .map((item) => {
            if ("fields" in item) {
              // If the item is a Section, recursively update its fields
              return {
                ...item,
                fields: updateFields(item.fields),
              } as Section;
            } else {
              // If the item is a Field, update it if its id matches the fieldId
              if (item.id === fieldId) {
                return { ...item, ...updates };
              }
              return item;
            }
          })
          .filter((item): item is Section => "fields" in item);
      };

      return {
        ...prev,
        sections: updateFields(prev.sections),
      };
    });
  };

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    // <div className="w-full flex flex-col-items-center">
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {formData.sections.map((section) => (
            <SectionRenderer
              key={section.id}
              section={section}
              addField={addField}
              // removeField={removeField}
              updateField={updateField}
              onAddNestedSection={(parentId) => {
                setCurrentParentId(parentId);
                setIsAddSectionModalOpen(true);
              }}
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
    // </div>
  );
};

export default FormBuilder;
