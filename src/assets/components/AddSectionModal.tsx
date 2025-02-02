import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import type { FieldType } from "../types/form";

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (
    formTitle: string,
    fields: { type: FieldType; label: string; options?: string[] }[]
  ) => void;
}

const AddSectionModal: React.FC<AddSectionModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [formTitle, setformTitle] = useState("");
  const [fields, setFields] = useState<
    { type: FieldType; label: string; options?: string[] }[]
  >([]);
  const [error, setError] = useState<{
    formTitle?: string;
    fields?: string[];
  }>({});

  const addField = () => {
    setFields([...fields, { type: "text", label: "" }]);
  };

  const removeField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
  };

  const updateField = (
    index: number,
    updates: Partial<{ type: FieldType; label: string; options?: string[] }>
  ) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates };
    setFields(newFields);
  };

  const validate = () => {
    const newError: { formTitle?: string; fields?: string[] } = {};
    if (!formTitle.trim()) {
      newError.formTitle = "Form Title is required.";
    }

    const fieldErrors: string[] = [];
    fields.forEach((field, index) => {
      if (!field.label.trim()) {
        fieldErrors.push(`Field Label is required for field ${index + 1}.`);
      }
    });

    if (fieldErrors.length) {
      newError.fields = fieldErrors;
    }

    setError(newError);

    return !newError.formTitle && !newError.fields;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onAdd(formTitle, fields);
    setformTitle("");
    setFields([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add New Form</DialogTitle>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto pb-16">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="formTitle" className="text-right">
                Form Title
              </Label>
              <Input
                id="formTitle"
                value={formTitle}
                onChange={(e) => setformTitle(e.target.value)}
                className="col-span-3"
              />
              {error.formTitle && (
                <div className="col-span-4 text-red-600 text-sm">
                  {error.formTitle}
                </div>
              )}
            </div>

            {fields.map((field, index) => (
              <div key={index} className="grid grid-cols-4 items-center gap-4">
                <div className="col-span-4 flex items-center justify-between">
                  <span className="text-sm text-gray-600">Remove field</span>
                  <X
                    size={16}
                    className="cursor-pointer text-gray-500 hover:text-gray-700"
                    onClick={() => removeField(index)}
                  />
                </div>

                <Label htmlFor={`fieldType-${index}`} className="text-right">
                  Field Type
                </Label>
                <Select
                  value={field.type}
                  onValueChange={(value: FieldType) =>
                    updateField(index, { type: value })
                  }
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

                <Label htmlFor={`fieldLabel-${index}`} className="text-right">
                  Field Label
                </Label>
                <Input
                  id={`fieldLabel-${index}`}
                  value={field.label}
                  onChange={(e) =>
                    updateField(index, { label: e.target.value })
                  }
                  className="col-span-3"
                />
                {error.fields && error.fields[index] && (
                  <div className="col-span-4 text-red-600 text-sm">
                    {error.fields[index]}
                  </div>
                )}

                {(field.type === "dropdown" || field.type === "radio") && (
                  <>
                    <Label
                      htmlFor={`fieldOptions-${index}`}
                      className="text-right"
                    >
                      Options (comma-separated)
                    </Label>
                    <Input
                      id={`fieldOptions-${index}`}
                      value={field.options?.join(", ") || ""}
                      onChange={(e) =>
                        updateField(index, {
                          options: e.target.value
                            .split(",")
                            .map((o) => o.trim()),
                        })
                      }
                      className="col-span-3"
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="absolute bottom-0 left-0 w-full bg-gray-50 shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={addField}
              className="w-full sm:w-auto"
            >
              Add Field
            </Button>
            <Button type="button" onClick={handleSubmit}>
              Add Form
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSectionModal;
