// // Add a remove button

// import type React from "react";
// import type { Section, Field } from "../types/form";
// import FieldRenderer from "./FieldRenderer";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// interface SectionRendererProps {
//   section: Section;
//   addField: (sectionId: string) => void;
//   updateField: (fieldId: string, updates: Partial<Field>) => void;
//   onAddNestedSection: (parentId: string) => void;
// }

// const SectionRenderer: React.FC<SectionRendererProps> = ({
//   section,
//   addField,
//   updateField,
//   onAddNestedSection,
// }) => {
//   return (
//     <div className="border p-4 rounded-md space-y-4">
//       <Input
//         type="text"
//         value={section.title}
//         onChange={(e) => updateField(section.id, { label: e.target.value })}
//         className="font-bold"
//       />
//       {section.fields.map((field) =>
//         "fields" in field ? (
//           <SectionRenderer
//             key={field.id}
//             section={field as Section}
//             addField={addField}
//             updateField={updateField}
//             onAddNestedSection={onAddNestedSection}
//           />
//         ) : (
//           <FieldRenderer
//             key={field.id}
//             field={field as Field}
//             updateField={updateField}
//           />
//         )
//       )}
//       <Button type="button" onClick={() => addField(section.id)}>
//         Add Field
//       </Button>
//       <Button type="button" onClick={() => onAddNestedSection(section.id)}>
//         Add Nested Section
//       </Button>
//     </div>
//   );
// };

// export default SectionRenderer;

import React from "react";
import type { Section, Field } from "../types/form";
import FieldRenderer from "./FieldRenderer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface SectionRendererProps {
  section: Section;
  addField: (
    sectionId: string,
    fieldData: { label: string; type: string; required: boolean }
  ) => void;
  updateField: (fieldId: string, updates: Partial<Field>) => void;
  onAddNestedSection: (parentId: string) => void;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({
  section,
  addField,
  updateField,
  onAddNestedSection,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [label, setLabel] = React.useState("");
  const [type, setType] = React.useState("text");
  const [required, setRequired] = React.useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAddField = () => {
    addField(section.id, { label, type, required });
    closeModal(); // Close the modal after adding the field
  };

  return (
    <div className="border p-4 rounded-md space-y-4 relative">
      <div className="absolute top-2 right-2">
        {/* Section title */}
        <X
          size={20}
          className="cursor-pointer text-gray-500 hover:text-gray-700"
          onClick={() => updateField(section.id, { label: "" })} // Replace with the section removal logic if needed
        />
      </div>

      {/* Section Title */}
      <div className="mb-4">
        {" "}
        {/* Added margin bottom to separate title from button */}
        <Input
          type="text"
          value={section.title}
          onChange={(e) => updateField(section.id, { label: e.target.value })}
          className="font-bold"
        />
      </div>

      {/* Render fields and possibly nested sections */}
      {section.fields.map((field) =>
        "fields" in field ? (
          <SectionRenderer
            key={field.id}
            section={field as Section}
            addField={addField}
            updateField={updateField}
            onAddNestedSection={onAddNestedSection}
          />
        ) : (
          <FieldRenderer
            key={field.id}
            field={field as Field}
            updateField={updateField}
          />
        )
      )}

      <Button type="button" onClick={openModal} className="mt-2">
        Add Field
      </Button>
      <Button
        type="button"
        onClick={() => onAddNestedSection(section.id)}
        className="mt-2 ml-2"
      >
        Add Nested Section
      </Button>

      {/* Modal Dialog for Adding Field */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md w-96 space-y-4">
            <h3 className="text-lg font-semibold">Add a New Field</h3>

            <div>
              <Label>Field Label</Label>
              <Input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Enter field label"
              />
            </div>

            <div>
              <Label>Field Type</Label>
              <Select
              // value={field.type}
              // onValueChange={(value: FieldType) =>
              // updateField(index, { type: value })
              // }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select field type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="dropdown">Dropdown</SelectItem>
                  <SelectItem value="radio">Radio</SelectItem>
                  <SelectItem value="file">File</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                  <SelectItem value="country">Country</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <Button type="button" onClick={handleAddField}>
                Add Field
              </Button>
              <Button type="button" onClick={closeModal} variant="secondary">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionRenderer;
