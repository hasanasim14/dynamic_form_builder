import type React from "react";
import { useState } from "react";
import type { Section, Field, FieldType } from "../types/form";
import FieldRenderer from "./FieldRenderer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface SectionRendererProps {
  section: Section;
  onAdd: (
    sectionId: string,
    fields: { type: FieldType; label: string; options?: string[] }[]
  ) => void;
  updateField: (fieldId: string, updates: Partial<Field>) => void;
  onAddNestedSection: (parentId: string) => void;
  onRemoveSection: (sectionId: string) => void;
  onRemoveField: (fieldId: string) => void;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({
  section,
  onAdd,
  updateField,
  onAddNestedSection,
  onRemoveSection,
  onRemoveField,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFields, setNewFields] = useState<
    { type: FieldType; label: string; options?: string[] }[]
  >([{ type: "text", label: "" }]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewFields([{ type: "text", label: "" }]);
  };

  const handleAddField = () => {
    onAdd(section.id, newFields);
    closeModal();
  };

  const handleFieldChange = (
    index: number,
    field: { type: FieldType; label: string; options?: string[] }
  ) => {
    setNewFields((prev) => {
      const updated = [...prev];
      updated[index] = field;
      return updated;
    });
  };

  const addNewFieldToModal = () => {
    setNewFields((prev) => [...prev, { type: "text", label: "" }]);
  };

  const removeFieldFromModal = (index: number) => {
    setNewFields((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="border p-4 rounded-md relative bg-white">
      {/* <div className="absolute top-0 left-0 right-0 bg-[#6641b2] text-white p-2 rounded-t-md" /> */}
      <div className="absolute top-6 right-2">
        <X
          size={20}
          className="cursor-pointer text-gray-500 hover:text-gray-700"
          onClick={() => onRemoveSection(section.id)}
        />
      </div>

      <div className="mb-4 mt-10 top-3">
        <Input
          type="text"
          value={section.title}
          onChange={(e) => updateField(section.id, { label: e.target.value })}
          className="font-bold"
        />
      </div>

      {section.fields.map((field) =>
        "fields" in field ? (
          <SectionRenderer
            key={field.id}
            section={field as Section}
            onAdd={onAdd}
            updateField={updateField}
            onAddNestedSection={onAddNestedSection}
            onRemoveSection={onRemoveSection}
            onRemoveField={onRemoveField}
          />
        ) : (
          <FieldRenderer
            key={field.id}
            field={field as Field}
            updateField={updateField}
            onRemoveField={onRemoveField}
          />
        )
      )}

      <div className="flex gap-2 mt-2 justify-end">
        <Button type="button" onClick={openModal} className="mt-2">
          Add Field
        </Button>
        <Button
          type="button"
          onClick={() => onAddNestedSection(section.id)}
          className="mt-2"
        >
          Add Nested Section
        </Button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md w-96 space-y-4 relative box-border max-h-[80vh] overflow-y-auto">
            <X
              size={20}
              className="absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            />

            <h3 className="text-lg font-semibold">Add New Fields</h3>

            {newFields.map((field, index) => (
              <div key={index} className="space-y-2 pb-4 border-b">
                <div className="flex justify-between items-center">
                  <Label>Field {index + 1}</Label>
                  {newFields.length > 1 && (
                    <X
                      size={16}
                      className="cursor-pointer text-gray-500 hover:text-gray-700"
                      onClick={() => removeFieldFromModal(index)}
                    />
                  )}
                </div>

                <div>
                  <Label>Field Label</Label>
                  <Input
                    type="text"
                    value={field.label}
                    onChange={(e) =>
                      handleFieldChange(index, {
                        ...field,
                        label: e.target.value,
                      })
                    }
                    placeholder="Enter field label"
                  />
                </div>

                <div>
                  <Label>Field Type</Label>
                  <Select
                    onValueChange={(value: FieldType) =>
                      handleFieldChange(index, { ...field, type: value })
                    }
                    value={field.type}
                  >
                    <SelectTrigger className="w-full">
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

                {(field.type === "dropdown" || field.type === "radio") && (
                  <div>
                    <Label>Options (comma-separated)</Label>
                    <Input
                      type="text"
                      value={field.options?.join(", ") || ""}
                      onChange={(e) =>
                        handleFieldChange(index, {
                          ...field,
                          options: e.target.value
                            .split(",")
                            .map((o) => o.trim()),
                        })
                      }
                      placeholder="Enter options"
                    />
                  </div>
                )}
              </div>
            ))}

            <Button
              type="button"
              onClick={addNewFieldToModal}
              className="w-full"
            >
              <Plus size={16} className="mr-2" />
              Add Another Field
            </Button>

            <div className="mt-4 flex justify-end space-x-2">
              <Button type="button" onClick={handleAddField}>
                Add Fields
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
