// // "use client"

// // import type React from "react"
// // import { useState } from "react"
// // import { useForm, FormProvider } from "react-hook-form"
// // import { v4 as uuidv4 } from "uuid"
// // import { Button } from "@/components/ui/button"
// // import type { FormData, Section, Field, FieldType } from "../types/form"
// // import SectionRenderer from "./SectionRenderer"
// // import FormPreview from "./FormPreview"
// // import AddSectionModal from "./AddSectionModal"

// // const FormBuilder: React.FC = () => {
// //   const [formData, setFormData] = useState<FormData>({ sections: [] })
// //   const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false)
// //   const [currentParentId, setCurrentParentId] = useState<string | null>(null)
// //   const methods = useForm()

// //   const addSection = (sectionTitle: string, fields: { type: FieldType; label: string; options?: string[] }[]) => {
// //     const newSection: Section = {
// //       id: uuidv4(),
// //       title: sectionTitle,
// //       fields: fields.map((field) => ({
// //         id: uuidv4(),
// //         ...field,
// //       })),
// //     }
// //     setFormData((prev) => {
// //       if (currentParentId) {
// //         return {
// //           ...prev,
// //           sections: updateNestedSection(prev.sections, currentParentId, newSection),
// //         }
// //       }
// //       return {
// //         ...prev,
// //         sections: [...prev.sections, newSection],
// //       }
// //     })
// //     setCurrentParentId(null)
// //   }

// //   const updateNestedSection = (sections: Section[], parentId: string, newSection: Section): Section[] => {
// //     return sections.map((section) => {
// //       if (section.id === parentId) {
// //         return {
// //           ...section,
// //           fields: [...section.fields, newSection],
// //         }
// //       } else if ("fields" in section) {
// //         return {
// //           ...section,
// //           fields: updateNestedSection(section.fields as Section[], parentId, newSection),
// //         }
// //       }
// //       return section
// //     })
// //   }

// //   const addField = (sectionId: string) => {
// //     setFormData((prev) => {
// //       const newField: Field = {
// //         id: uuidv4(),
// //         type: "text",
// //         label: "New Field",
// //       }

// //       const updateFields = (fields: (Field | Section)[]) => {
// //         return fields.map((item) => {
// //           if (item.id === sectionId) {
// //             return {
// //               ...item,
// //               fields: [...(item as Section).fields, newField],
// //             }
// //           } else if ("fields" in item) {
// //             return {
// //               ...item,
// //               fields: updateFields(item.fields),
// //             }
// //           }
// //           return item
// //         })
// //       }

// //       return {
// //         ...prev,
// //         sections: updateFields(prev.sections) as Section[],
// //       }
// //     })
// //   }

// //   const updateField = (fieldId: string, updates: Partial<Field>) => {
// //     setFormData((prev) => {
// //       const updateFields = (fields: (Field | Section)[]) => {
// //         return fields.map((item) => {
// //           if (item.id === fieldId) {
// //             return { ...item, ...updates }
// //           } else if ("fields" in item) {
// //             return {
// //               ...item,
// //               fields: updateFields(item.fields),
// //             }
// //           }
// //           return item
// //         })
// //       }

// //       return {
// //         ...prev,
// //         sections: updateFields(prev.sections) as Section[],
// //       }
// //     })
// //   }

// //   const onSubmit = (data: any) => {
// //     console.log(data)
// //   }

// //   return (
// //     <FormProvider {...methods}>
// //       <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
// //         <div className="space-y-4">
// //           {formData.sections.map((section) => (
// //             <SectionRenderer
// //               key={section.id}
// //               section={section}
// //               addField={addField}
// //               updateField={updateField}
// //               onAddNestedSection={(parentId) => {
// //                 setCurrentParentId(parentId)
// //                 setIsAddSectionModalOpen(true)
// //               }}
// //             />
// //           ))}
// //         </div>
// //         <Button type="button" onClick={() => setIsAddSectionModalOpen(true)}>
// //           Add Section
// //         </Button>
// //         <Button type="submit">Submit</Button>
// //       </form>
// //       <FormPreview formData={formData} />
// //       <AddSectionModal
// //         isOpen={isAddSectionModalOpen}
// //         onClose={() => setIsAddSectionModalOpen(false)}
// //         onAdd={addSection}
// //       />
// //     </FormProvider>
// //   )
// // }

// // export default FormBuilder



// "use client"

// import type React from "react"
// import { useState } from "react"
// import { useForm, FormProvider } from "react-hook-form"
// import { v4 as uuidv4 } from "uuid"
// import { Button } from "@/components/ui/button"
// import { X } from "lucide-react"
// import type { FormData, Section, Field, FieldType } from "../types/form"
// import SectionRenderer from "./SectionRenderer"
// import FormPreview from "./FormPreview"
// import AddSectionModal from "./AddSectionModal"

// const FormBuilder: React.FC = () => {
//   const [formData, setFormData] = useState<FormData>({ sections: [] })
//   const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false)
//   const [currentParentId, setCurrentParentId] = useState<string | null>(null)
//   const methods = useForm()

//   // Add a new section to the form
//   const addSection = (sectionTitle: string, fields: { type: FieldType; label: string; options?: string[] }[]) => {
//     const newSection: Section = {
//       id: uuidv4(),
//       title: sectionTitle,
//       fields: fields.map((field) => ({
//         id: uuidv4(),
//         ...field,
//       })),
//     }
//     setFormData((prev) => {
//       if (currentParentId) {
//         return {
//           ...prev,
//           sections: updateNestedSection(prev.sections, currentParentId, newSection),
//         }
//       }
//       return {
//         ...prev,
//         sections: [...prev.sections, newSection],
//       }
//     })
//     setCurrentParentId(null)
//   }

//   // Add nested sections to existing sections
//   const updateNestedSection = (sections: Section[], parentId: string, newSection: Section): Section[] => {
//     return sections.map((section) => {
//       if (section.id === parentId) {
//         return {
//           ...section,
//           fields: [...section.fields, newSection],
//         }
//       } else if ("fields" in section) {
//         return {
//           ...section,
//           fields: updateNestedSection(section.fields as Section[], parentId, newSection),
//         }
//       }
//       return section
//     })
//   }

//   // Add a new field to a specific section
//   const addField = (sectionId: string) => {
//     setFormData((prev) => {
//       const newField: Field = {
//         id: uuidv4(),
//         type: "text",
//         label: "New Field",
//       }

//       const updateFields = (fields: (Field | Section)[]) => {
//         return fields.map((item) => {
//           if (item.id === sectionId) {
//             return {
//               ...item,
//               fields: [...(item as Section).fields, newField],
//             }
//           } else if ("fields" in item) {
//             return {
//               ...item,
//               fields: updateFields(item.fields),
//             }
//           }
//           return item
//         })
//       }

//       return {
//         ...prev,
//         sections: updateFields(prev.sections) as Section[],
//       }
//     })
//   }

//   // Remove a field from a section
//   const removeField = (fieldId: string) => {
//     setFormData((prev) => {
//       const filterFields = (fields: (Field | Section)[]): (Field | Section)[] => {
//         return fields
//           .filter((item) => item.id !== fieldId) // Exclude the field by ID
//           .map((item) => {
//             if ("fields" in item) {
//               return { ...item, fields: filterFields(item.fields) }
//             }
//             return item
//           })
//       }

//       return {
//         ...prev,
//         sections: filterFields(prev.sections) as Section[],
//       }
//     })
//   }

//   // Update a field within a section
//   const updateField = (fieldId: string, updates: Partial<Field>) => {
//     setFormData((prev) => {
//       const updateFields = (fields: (Field | Section)[]) => {
//         return fields.map((item) => {
//           if (item.id === fieldId) {
//             return { ...item, ...updates }
//           } else if ("fields" in item) {
//             return {
//               ...item,
//               fields: updateFields(item.fields),
//             }
//           }
//           return item
//         })
//       }

//       return {
//         ...prev,
//         sections: updateFields(prev.sections) as Section[],
//       }
//     })
//   }

//   const onSubmit = (data: any) => {
//     console.log(data)
//   }

//   return (
//     <FormProvider {...methods}>
//       <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
//         <div className="space-y-4">
//           {formData.sections.map((section) => (
//             <SectionRenderer
//               key={section.id}
//               section={section}
//               addField={addField}
//               updateField={updateField}
//               removeField={removeField} // Pass removeField as a prop
//               onAddNestedSection={(parentId) => {
//                 setCurrentParentId(parentId)
//                 setIsAddSectionModalOpen(true)
//               }}
//             />
//           ))}
//         </div>
//         <Button type="button" onClick={() => setIsAddSectionModalOpen(true)}>
//           Add Section
//         </Button>
//         <Button type="submit">Submit</Button>
//       </form>
//       <FormPreview formData={formData} />
//       <AddSectionModal
//         isOpen={isAddSectionModalOpen}
//         onClose={() => setIsAddSectionModalOpen(false)}
//         onAdd={addSection}
//       />
//     </FormProvider>
//   )
// }

// export default FormBuilder


"use client"

import React, { useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react" // Import the X icon from lucide-react
import type { FormData, Section, Field, FieldType } from "../types/form"
import SectionRenderer from "./SectionRenderer"
import FormPreview from "./FormPreview"
import AddSectionModal from "./AddSectionModal"

const FormBuilder: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ sections: [] })
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false)
  const [currentParentId, setCurrentParentId] = useState<string | null>(null)
  const methods = useForm()

  const addSection = (sectionTitle: string, fields: { type: FieldType; label: string; options?: string[] }[]) => {
    const newSection: Section = {
      id: uuidv4(),
      title: sectionTitle,
      fields: fields.map((field) => ({
        id: uuidv4(),
        ...field,
      })),
    }
    setFormData((prev) => {
      if (currentParentId) {
        return {
          ...prev,
          sections: updateNestedSection(prev.sections, currentParentId, newSection),
        }
      }
      return {
        ...prev,
        sections: [...prev.sections, newSection],
      }
    })
    setCurrentParentId(null)
  }

  const updateNestedSection = (sections: Section[], parentId: string, newSection: Section): Section[] => {
    return sections.map((section) => {
      if (section.id === parentId) {
        return {
          ...section,
          fields: [...section.fields, newSection],
        }
      } else if ("fields" in section) {
        return {
          ...section,
          fields: updateNestedSection(section.fields as Section[], parentId, newSection),
        }
      }
      return section
    })
  }

  const addField = (sectionId: string) => {
    setFormData((prev) => {
      const newField: Field = {
        id: uuidv4(),
        type: "text",
        label: "New Field",
      }

      const updateFields = (fields: (Field | Section)[]) => {
        return fields.map((item) => {
          if (item.id === sectionId) {
            return {
              ...item,
              fields: [...(item as Section).fields, newField],
            }
          } else if ("fields" in item) {
            return {
              ...item,
              fields: updateFields(item.fields),
            }
          }
          return item
        })
      }

      return {
        ...prev,
        sections: updateFields(prev.sections) as Section[],
      }
    })
  }

  const removeField = (fieldId: string) => {
    setFormData((prev) => {
      const filterFields = (fields: (Field | Section)[]): (Field | Section)[] => {
        return fields
          .filter((item) => item.id !== fieldId) // Exclude the field by ID
          .map((item) => {
            if ("fields" in item) {
              return { ...item, fields: filterFields(item.fields) }
            }
            return item
          })
      }

      return {
        ...prev,
        sections: filterFields(prev.sections) as Section[],
      }
    })
  }

  const updateField = (fieldId: string, updates: Partial<Field>) => {
    setFormData((prev) => {
      const updateFields = (fields: (Field | Section)[]) => {
        return fields.map((item) => {
          if (item.id === fieldId) {
            return { ...item, ...updates }
          } else if ("fields" in item) {
            return {
              ...item,
              fields: updateFields(item.fields),
            }
          }
          return item
        })
      }

      return {
        ...prev,
        sections: updateFields(prev.sections) as Section[],
      }
    })
  }

  const onSubmit = (data: any) => {
    console.log(data)
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {formData.sections.map((section) => (
            <SectionRenderer
              key={section.id}
              section={section}
              addField={addField}
              removeField={removeField}
              updateField={updateField}
              onAddNestedSection={(parentId) => {
                setCurrentParentId(parentId)
                setIsAddSectionModalOpen(true)
              }}
            />
          ))}
        </div>
        <Button type="button" onClick={() => setIsAddSectionModalOpen(true)}>
          Add Section
        </Button>
        <Button type="submit">Submit</Button>
      </form>
      <FormPreview formData={formData} />
      <AddSectionModal
        isOpen={isAddSectionModalOpen}
        onClose={() => setIsAddSectionModalOpen(false)}
        onAdd={addSection}
      />
    </FormProvider>
  )
}

export default FormBuilder
