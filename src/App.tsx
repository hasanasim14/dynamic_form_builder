import FormBuilder from "./assets/components/FormBuilder";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dynamic Form Builder</h1>
      <FormBuilder />
    </main>
  );
}
