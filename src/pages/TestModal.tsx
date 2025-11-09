import React, { useState } from "react";
import Modal from "../components/primitives/Modal";
// import Modal from "./components/primitives/Modal";

export default function TestPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6">
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-primary-600 text-white rounded"
      >
        Open Modal
      </button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">Hello Modal</h2>
        <p>This is a test modal.</p>

        <button
          onClick={() => setOpen(false)}
          className="mt-4 px-4 py-2 bg-red-800 text-white rounded"
        >
          close
        </button>
      </Modal>
    </div>
  );
}
