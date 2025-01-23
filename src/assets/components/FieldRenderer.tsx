import type React from "react";
import { useFormContext } from "react-hook-form";
import { type Field } from "../types/form";
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
import { X } from "lucide-react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useEffect, useState } from "react";

interface FieldRendererProps {
  field: Field;
  updateField: (fieldId: string, updates: Partial<Field>) => void;
  onRemoveField: (fieldId: string) => void;
}

const FieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  updateField,
  onRemoveField,
}) => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const [countries, setCountries] = useState<{ code: string; name: string }[]>(
    []
  );

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        if (!response.ok) {
          throw new Error(`Failed to fetch countries: ${response.status}`);
        }
        const data = await response.json();
        const sortedCountries = data
          .map((country: any) => ({
            code: country.cca2,
            name: country.name.common,
          }))
          .sort((a: any, b: any) => a.name.localeCompare(b.name));
        setCountries(sortedCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  console.log("hwlo", countries);

  const renderField = () => {
    switch (field.type) {
      case "text":
        return <Input {...register(field.id, { required: field.required })} />;
      case "dropdown":
        return (
          <Select
            onValueChange={(value: string) => updateField(field.id, { value })}
          >
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
      case "radio":
        return (
          <RadioGroup
            onValueChange={(value: string) => updateField(field.id, { value })}
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
          <Select
            onValueChange={(value: string) => updateField(field.id, { value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              {countries.length > 0 ? (
                countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="null" disabled>
                  Loading...
                </SelectItem>
              )}
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
          <PhoneInput
            className="border border-gray-300 rounded p-1.5"
            {...register(field.id, { required: field.required })}
          />
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
    <div className="space-y-2 relative">
      <div className="flex justify-between items-center">
        <Label>{field.label}</Label>
        <X
          size={16}
          className="cursor-pointer text-gray-500 hover:text-gray-700"
          onClick={() => onRemoveField(field.id)}
          aria-label={`Remove ${field.label} field`}
        />
      </div>
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
