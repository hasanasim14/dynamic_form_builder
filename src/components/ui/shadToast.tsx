import * as Toast from "@radix-ui/react-toast";
import { X } from "lucide-react";

const ShadToast = ({ message, isOpen, setIsOpen }: any) => {
  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        open={isOpen}
        onOpenChange={setIsOpen}
        className="bg-white border border-gray-300 text-black p-4 rounded-md shadow-md flex justify-between items-center gap-4"
      >
        <Toast.Title className="font-semibold">{message}</Toast.Title>
        <X
          size={16}
          className="cursor-pointer text-gray-500 hover:text-gray-700"
          onClick={() => setIsOpen(false)}
        />
      </Toast.Root>
      <Toast.Viewport className="fixed bottom-4 right-4 max-w-md w-full flex flex-col gap-4" />
    </Toast.Provider>
  );
};

export default ShadToast;
