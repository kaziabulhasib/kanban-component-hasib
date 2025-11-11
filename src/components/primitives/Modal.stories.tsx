import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";

const meta: Meta<typeof Modal> = {
  title: "Primitives/Modal",
  component: Modal,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div className='p-6'>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>

        <Modal open={open} onClose={() => setOpen(false)}>
          <div className='space-y-4'>
            <h2 className='text-xl font-semibold text-neutral-900'>
              Sample Modal
            </h2>

            <p className='text-sm text-neutral-700'>
              This is a preview of your Modal component. Click outside or press
              ESC to close.
            </p>

            <div className='flex justify-end gap-2 pt-2'>
              <Button variant='secondary' onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpen(false)}>Confirm</Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  },
};
