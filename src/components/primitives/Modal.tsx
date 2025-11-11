import React, { useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  // Close on ESC key
  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      className='
        fixed inset-0 z-50 flex items-center justify-center
        bg-black/40 backdrop-blur-sm
        animate-fadeIn
        p-6 sm:p-2
      '
      onClick={onClose}>
      {/* Modal Content */}
      <div
        onClick={(e) => e.stopPropagation()}
        className='
          bg-white rounded-xl shadow-lg p-6 w-full max-w-md
          animate-scaleIn
        '>
        {children}
      </div>
    </div>
  );
};

export default Modal;
