import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import React from "react";
import { FaTimes } from "react-icons/fa";

const AddressInfoModal = ({ open, setOpen, children }) => {
  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="relative z-[9999]">
      
      <DialogBackdrop className="fixed inset-0 bg-black/40 transition-opacity z-[9998]" />

    
      <div className="fixed inset-0 z-[9999] flex w-screen items-center justify-center p-4">
        <DialogPanel className="relative w-full max-w-md mx-auto overflow-hidden bg-white rounded-2xl shadow-2xl">
          <div className="px-6 py-6">{children}</div>

          <div className="absolute right-4 top-4">
            <button onClick={() => setOpen(false)} type="button">
              <FaTimes className="text-slate-700" size={22} />
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default AddressInfoModal;
