import FormBuilder from "./assets/components/FormBuilder";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-start min-h-screen w-full p-4 bg-gray-50">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 mt-12 w-full">
        Dynamic Form Builder
      </h1>
      <FormBuilder />
    </main>
  );
}

// import FormBuilder from "./assets/components/FormBuilder";

// export default function Home() {
//   return (
//     <main className="flex flex-col items-center justify-start min-h-screen w-full p-4 bg-gray-50">
//       <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 mt-12 w-full">
//         Dynamic Form Builder
//       </h1>
//       <div className="w-11/20 md:w-11/20 lg:w-11/20 xl:w-11/20 2xl:w-11/20 max-w-screen-lg mx-auto border rounded-md p-4">
//         <FormBuilder />
//       </div>
//     </main>
//   );
// }
