// Check the Renderer Props from V0

import type React from "react";
import type { Section, Field } from "../types/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface SectionRendererProps {
  section: Section;
  addField: (sectionId: string) => void;
  updateField: (fieldId: string, updates: Partial<Field>) => void;
  onAddNestedSection: (parentId: string) => void;
}

const SectionRenderer: React.FC<{
  section: Section;
  addField: (sectionId: string) => void;
  updateField: (fieldId: string, updates: Partial<Field>) => void;
  onAddNestedSection: (parentId: string) => void;
  removeField: (fieldId: string) => void; // New prop
}> = ({ section, addField, updateField, onAddNestedSection, removeField }) => (
  <div className="border rounded-md p-4">
    <h2 className="font-semibold">{section.title}</h2>
    <div className="space-y-4">
      {section.fields.map((field) => (
        <div key={field.id} className="flex items-center space-x-4">
          <Input
            value={field.label}
            onChange={(e) => updateField(field.id, { label: e.target.value })}
            className="flex-1"
          />

          <X
            size={16}
            className="cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={() => removeField(field.id)}
          />
        </div>
      ))}
    </div>
    <Button type="button" onClick={() => addField(section.id)} className="mt-2">
      Add Field
    </Button>
    <Button
      type="button"
      onClick={() => onAddNestedSection(section.id)}
      className="mt-2 ml-2"
    >
      Add Nested Section
    </Button>
  </div>
);

export default SectionRenderer;
