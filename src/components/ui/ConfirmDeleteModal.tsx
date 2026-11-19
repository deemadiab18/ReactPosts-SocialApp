import { Button, Modal, useOverlayState } from "@heroui/react";
import { useState } from "react";

type ConfirmDeleteModalProps = {
  title: string;
  description: string;
  onConfirm: () => Promise<void> | void;
  triggerLabel: string;
};

export default function ConfirmDeleteModal({
  title,
  description,
  onConfirm,
  triggerLabel,
}: ConfirmDeleteModalProps) {
  const modalState = useOverlayState();
  const [loading, setLoading] = useState(false);

  async function confirm() {
    setLoading(true);
    try {
      await onConfirm();
      modalState.close();
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant="tertiary"
        className="text-red-600"
        onPress={modalState.open}
      >
        {triggerLabel}
      </Button>
      <Modal.Root state={modalState}>
        <Modal.Backdrop>
          <Modal.Container size="sm">
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Heading>{title}</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <p className="text-sm text-slate-600">{description}</p>
              </Modal.Body>
              <Modal.Footer className="flex justify-end gap-2">
                <Button variant="tertiary" onPress={modalState.close}>
                  Cancel
                </Button>
                <Button
                  className="bg-red-600 text-white"
                  isDisabled={loading}
                  onPress={() => void confirm()}
                >
                  {loading ? "Deleting..." : "Delete"}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal.Root>
    </>
  );
}