"use client";

import type React from "react";
import { useFormContext } from "react-hook-form";
import { type Field, FieldType } from "../types/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { cn } from "@/lib/utils";

interface FieldRendererProps {
  field: Field;
  updateField: (fieldId: string, updates: Partial<Field>) => void;
}

const FieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  updateField,
}) => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const renderField = () => {
    switch (field.type) {
      case "text":
        return <Input {...register(field.id, { required: field.required })} />;
      case "dropdown":
        return (
          <Select onValueChange={(value) => updateField(field.id, { value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {(field.options || []).map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      //   case "radio":
      //     return (
      //       <RadioGroup onValueChange={(value) => updateField(field.id, { value })}>
      //         {(field.options || []).map((option) => (
      //           <div key={option} className="flex items-center space-x-2">
      //             <RadioGroupItem value={option} id={`${field.id}-${option}`} />
      //             <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
      //           </div>
      //         ))}
      //       </RadioGroup>
      //     )
      case "radio":
        return (
          <RadioGroup
            onValueChange={(value) => {
              console.log("Selected value:", value); // Logs the selected value
              updateField(field.id, { value }); // Updates the field with the selected value
            }}
          >
            {(field.options || []).map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "file":
        return (
          <Input
            type="file"
            {...register(field.id, { required: field.required })}
            accept={field.accept}
          />
        );
      case "checkbox":
        return (
          <Checkbox {...register(field.id, { required: field.required })} />
        );
      case "country":
        return (
          <Select onValueChange={(value) => updateField(field.id, { value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="au">Australia</SelectItem>
              <SelectItem value="de">Germany</SelectItem>
              <SelectItem value="fr">France</SelectItem>
              <SelectItem value="jp">Japan</SelectItem>
            </SelectContent>
          </Select>
        );
      case "date":
        return (
          <Input
            type="date"
            {...register(field.id, { required: field.required })}
          />
        );
      case "phone":
        return (
          <PhoneInput {...register(field.id, { required: field.required })} />
        );
      default:
        return null;
    }
  };

  const isVisible = field.conditionalLogic
    ? field.conditionalLogic.showIf(watch(field.conditionalLogic.dependsOn))
    : true;

  if (!isVisible) return null;

  return (
    <div className="space-y-2">
      <Label>{field.label}</Label>
      {renderField()}
      {errors[field.id] && (
        <p className="text-sm text-red-500">
          {errors[field.id]?.message?.toString() || "This field is required"}
        </p>
      )}
    </div>
  );
};

export default FieldRenderer;
