import FormBuilder from "./assets/components/FormBuilder";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-start min-h-screen w-full p-4 bg-[#f0ebf8]">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 mt-12 w-full">
        Dynamic Form Builder
      </h1>
      <FormBuilder />
    </main>
  );
}
