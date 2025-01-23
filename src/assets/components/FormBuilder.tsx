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
import ShadToast from "@/components/ui/shadToast";

const FormBuilder: React.FC = () => {
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({ sections: [] });
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);
  const methods = useForm();

  console.log("FormData", formData);
  console.log("FormData", currentParentId);

  // const addSection = (
  //   sectionTitle: string,
  //   fields: { type: FieldType; label: string; options?: string[] }[]
  // ) => {
  //   const newSection: Section = {
  //     id: uuidv4(),
  //     title: sectionTitle,
  //     fields: fields.map((field) => ({
  //       id: uuidv4(),
  //       ...field,
  //       value: field.type === "checkbox" ? false : "",
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
    sectionTitle: string,
    fields: { type: FieldType; label: string; options?: string[] }[]
  ) => {
    const newSection: Section = {
      id: uuidv4(),
      title: sectionTitle,
      label: sectionTitle, // Assuming label is same as title, or can adjust based on your needs.
      type: "section", // Must be 'section' to meet the Section interface.
      fields: fields.map((field) => {
        const fieldWithValue = {
          ...field,
          id: uuidv4(),
          value: field.type === "checkbox" ? false : "", // Default value based on type
        };

        // Ensure the type matches the specific field interfaces
        switch (field.type) {
          case "text":
            return fieldWithValue as TextField;
          case "dropdown":
            return {
              ...fieldWithValue,
              options: field.options,
            } as DropdownField;
          case "radio":
            return { ...fieldWithValue, options: field.options } as RadioField;
          case "checkbox":
            return fieldWithValue as CheckboxField;
          case "file":
            return fieldWithValue as FileField;
          case "country":
            return fieldWithValue as CountryField;
          case "date":
            return fieldWithValue as DateField;
          case "phone":
            return fieldWithValue as PhoneField;
          default:
            // We shouldn't reach here, but if we do, throw an error
            throw new Error(`Unknown field type: ${field.type}`);
        }
      }),
    };

    return newSection;
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
            section.fields as Section[],
            parentId,
            newSection
          ),
        };
      }
      return section;
    });
  };

  // const addField = (
  //   sectionId: string,
  //   fields: { type: FieldType; label: string; options?: string[] }[]
  // ) => {
  //   setFormData((prev) => {
  //     const updateFields = (sections: Section[]): Section[] => {
  //       return sections.map((section) => {
  //         if (section.id === sectionId) {
  //           return {
  //             ...section,
  //             fields: [
  //               ...section.fields,
  //               ...fields.map((field) => ({
  //                 id: uuidv4(),
  //                 ...field,
  //                 value: field.type === "checkbox" ? false : "",
  //               })),
  //             ],
  //           };
  //         } else if ("fields" in section) {
  //           return {
  //             ...section,
  //             fields: updateFields(section.fields as Section[]),
  //           };
  //         }
  //         return section;
  //       });
  //     };

  //     return {
  //       ...prev,
  //       sections: updateFields(prev.sections),
  //     };
  //   });
  // };

  // working
  const addField = (
    sectionId: string,
    fields: { type: FieldType; label: string; options?: string[] }[]
  ) => {
    setFormData((prev) => {
      const updateFields = (sections: Section[]): Section[] => {
        return sections.map((section) => {
          if (section.id === sectionId) {
            // Ensure the correct field type by using type guards and assertions
            return {
              ...section,
              fields: [
                ...section.fields,
                ...fields.map((field) => {
                  const fieldWithValue = {
                    id: uuidv4(),
                    ...field,
                    value: field.type === "checkbox" ? false : "",
                  };

                  // Assert the correct type for each field
                  switch (field.type) {
                    case "text":
                      return fieldWithValue as TextField;
                    case "dropdown":
                      return {
                        ...fieldWithValue,
                        options: field.options,
                      } as DropdownField;
                    case "radio":
                      return {
                        ...fieldWithValue,
                        options: field.options,
                      } as RadioField;
                    case "checkbox":
                      return fieldWithValue as CheckboxField;
                    case "file":
                      return fieldWithValue as FileField;
                    case "country":
                      return fieldWithValue as CountryField;
                    case "date":
                      return fieldWithValue as DateField;
                    case "phone":
                      return fieldWithValue as PhoneField;
                    default:
                      throw new Error(`Unknown field type: ${field.type}`);
                  }
                }),
              ],
            };
          } else if ("fields" in section) {
            return {
              ...section,
              fields: updateFields(section.fields as Section[]),
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

  // const updateField = (fieldId: string, updates: Partial<Field>) => {
  //   setFormData((prev) => {
  //     // Explicitly define the type of fields as an array of either Fields or Sections
  //     const updateFields = (
  //       fields: (Field | Section)[]
  //     ): (Field | Section)[] => {
  //       return fields.map((item) => {
  //         // Ensure each item is either Field or Section
  //         if ("id" in item && item.id === fieldId) {
  //           // Spread the existing item with the updates for matching field ID
  //           return { ...item, ...updates };
  //         } else if ("fields" in item) {
  //           // Recursively call updateFields for sections that contain other fields or sections
  //           return {
  //             ...item,
  //             fields: updateFields(item.fields), // recurse into the nested fields
  //           };
  //         }
  //         return item; // return the item unchanged if no matching field ID
  //       });
  //     };

  //     // Now return the updated form data structure
  //     return {
  //       ...prev,
  //       sections: updateFields(prev.sections), // Ensure sections are updated with modified fields
  //     };
  //   });
  // };

  // const addField = (
  //   sectionId: string,
  //   fields: { type: FieldType; label: string; options?: string[] }[] // Declare your field types here.
  // ) => {
  //   setFormData((prev) => {
  //     const updateFields = (sections: Section[]): Section[] => {
  //       return sections.map((section) => {
  //         if (section.id === sectionId) {
  //           return {
  //             ...section,
  //             fields: [
  //               ...section.fields,
  //               ...fields.map((field) => {
  //                 // Dynamically map field types correctly
  //                 if (field.type === "dropdown") {
  //                   return {
  //                     id: uuidv4(),
  //                     type: "dropdown",
  //                     label: field.label,
  //                     options: field.options || [],
  //                     value: "",
  //                   } as DropdownField;
  //                 }

  //                 if (field.type === "text") {
  //                   return {
  //                     id: uuidv4(),
  //                     type: "text",
  //                     label: field.label,
  //                     value: "",
  //                   } as TextField;
  //                 }

  //                 if (field.type === "radio") {
  //                   return {
  //                     id: uuidv4(),
  //                     type: "radio",
  //                     label: field.label,
  //                     options: field.options || [],
  //                     value: "",
  //                   } as RadioField;
  //                 }

  //                 // For any other type of fields (checkbox, phone, etc.)
  //                 return {
  //                   id: uuidv4(),
  //                   type: field.type,
  //                   label: field.label,
  //                   value: field.type === "checkbox" ? false : "",
  //                 };
  //               }),
  //             ],
  //           };
  //         } else if ("fields" in section) {
  //           return {
  //             ...section,
  //             fields: updateFields(section.fields as Section[]),
  //           };
  //         }
  //         return section;
  //       });
  //     };

  //     return {
  //       ...prev,
  //       sections: updateFields(prev.sections), // Ensure type safety here
  //     };
  //   });
  // };

  // const updateField = (fieldId: string, updates: Partial<Field>) => {
  //   setFormData((prev) => {
  //     // Explicitly update the sections while respecting the FormData structure
  //     const updateFields = (
  //       fields: (Field | Section)[]
  //     ): (Field | Section)[] => {
  //       return fields.map((item) => {
  //         if ("id" in item && item.id === fieldId) {
  //           return { ...item, ...updates }; // Update matching field
  //         } else if ("fields" in item) {
  //           return {
  //             ...item,
  //             fields: updateFields(item.fields), // Recursively update fields in nested sections
  //           };
  //         }
  //         return item; // Return unchanged item if no match
  //       });
  //     };

  //     // Return the updated formData structure ensuring sections are strictly Section[]
  //     return {
  //       ...prev,
  //       sections: updateFields(prev.sections) as Section[], // Ensure sections are typed correctly
  //     };
  //   });
  // };

  // Type guard to check for a TextField type

  // const updateField = (fieldId: string, updates: Partial<Field>) => {
  //   setFormData((prev) => {
  //     const updateFields = (fields: (Field | Section)[]) => {
  //       return fields.map((item) => {
  //         if (item.id === fieldId) {
  //           return { ...item, ...updates }
  //         } else if ("fields" in item) {
  //           return {
  //             ...item,
  //             fields: updateFields(item.fields),
  //           }
  //         }
  //         return item
  //       })
  //     }

  //     return {
  //       ...prev,
  //       sections: updateFields(prev.sections) as Section[],
  //     }
  //   })
  // }

  // const updateField = (fieldId: string, updates: Partial<Field>) => {
  //   setFormData((prev: FormData) => {
  //     const updateFields = (fields: (Field | Section)[]): (Field | Section)[] => {
  //       return fields.map((item: Field | Section) => {
  //         if (item.id === fieldId) {
  //           return { ...item, ...updates };
  //         } else if ("fields" in item) {
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
  //       sections: updateFields(prev.sections),
  //     };
  //   });
  // };
  // Type Guards for Fields
  function isTextField(field: Field): field is TextField {
    return field.type === "text";
  }

  function isDropdownField(field: Field): field is DropdownField {
    return field.type === "dropdown";
  }

  function isRadioField(field: Field): field is RadioField {
    return field.type === "radio";
  }

  function isFileField(field: Field): field is FileField {
    return field.type === "file";
  }

  function isCheckboxField(field: Field): field is CheckboxField {
    return field.type === "checkbox";
  }

  function isCountryField(field: Field): field is CountryField {
    return field.type === "country";
  }

  function isDateField(field: Field): field is DateField {
    return field.type === "date";
  }

  function isPhoneField(field: Field): field is PhoneField {
    return field.type === "phone";
  }

  function isSection(field: Field): field is Section {
    return field.type === "section";
  }

  // Modified updateField method
  // Modified updateField method
  const updateField = (fieldId: string, updates: Partial<Field>) => {
    setFormData((prev: FormData) => {
      // Function to update fields within sections (recursive)
      const updateFields = (
        fields: (Field | Section)[]
      ): (Field | Section)[] => {
        return fields.map((item) => {
          // If this item is a Section, update its fields recursively
          if (isSection(item)) {
            return {
              ...item,
              fields: updateFields(item.fields), // Recursive update for nested fields
            } as Section;
          }

          // If the current item is the field to be updated
          if (item.id === fieldId) {
            // Handle TextField update
            if (isTextField(item)) {
              return { ...item, ...updates } as TextField;
            }
            // Handle DropdownField update
            if (isDropdownField(item)) {
              return { ...item, ...updates } as DropdownField;
            }
            // Handle RadioField update
            if (isRadioField(item)) {
              return { ...item, ...updates } as RadioField;
            }
            // Handle FileField update
            if (isFileField(item)) {
              return { ...item, ...updates } as FileField;
            }
            // Handle CheckboxField update
            if (isCheckboxField(item)) {
              return { ...item, ...updates } as CheckboxField;
            }
            // Handle CountryField update
            if (isCountryField(item)) {
              return { ...item, ...updates } as CountryField;
            }
            // Handle DateField update
            if (isDateField(item)) {
              return { ...item, ...updates } as DateField;
            }
            // Handle PhoneField update
            if (isPhoneField(item)) {
              return { ...item, ...updates } as PhoneField;
            }
          }

          // If the item doesn't match the id, just return it unchanged
          return item;
        });
      };

      // Returning updated form data structure with Section[]
      return {
        ...prev,
        sections: updateFields(prev.sections).filter(
          (section): section is Section => isSection(section)
        ),
      };
    });
  };
  const removeSection = (sectionId: string) => {
    setFormData((prev) => {
      const removeFromSections = (sections: Section[]): Section[] => {
        return sections.filter((section) => {
          if (section.id === sectionId) {
            return false;
          }
          if ("fields" in section) {
            section.fields = removeFromSections(section.fields as Section[]);
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

  // On success of the form
  const formSubmit = async (data: any) => {
    console.log("Submitted Data:", data);
    setIsToastOpen(true);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(formSubmit)}
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
            disabled={methods.formState.isSubmitting || !hasFields}
            className="md:w-auto w-full"
          >
            Submit
          </Button>
          <ShadToast
            message="Form Submitted Successfully"
            isOpen={isToastOpen}
            setIsOpen={setIsToastOpen}
          />
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
