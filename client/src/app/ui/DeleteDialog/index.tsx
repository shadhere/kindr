"use client";

import { Button } from "../Button";
import { Modal } from "../Modal";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface DeleteDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  deleteWhat: string;
  text?: string;
  isDeleting?: boolean;
  isSaving?: boolean;
  useSaveInsteadOfCancel?: boolean;
  onSave?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
}

export function DeleteDialog({
  open,
  setOpen,
  deleteWhat,
  text,
  isDeleting,
  isSaving,
  useSaveInsteadOfCancel = false,
  onSave,
  children,
  disabled,
}: DeleteDialogProps) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      // Make delete request to backend API
      await axios.delete(`http://localhost:5000/api/user`, {
        withCredentials: true, // Ensure cookies are sent with the request
      });

      // If delete request is successful, call onDelete callback
      router.push("/auth/login");
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
    } catch (error) {
      console.error("Error deleting user:", error);
      // Handle error appropriately
    }
  };

  return (
    <Modal open={open} setOpen={setOpen} title={`Delete ${deleteWhat}`}>
      <p>{text || "Are you sure? This action cannot be undone."}</p>
      <div>{children}</div>
      <div className="space-x-2 text-right">
        <Button
          loading={isSaving}
          variant="secondary"
          onClick={() => {
            if (useSaveInsteadOfCancel && onSave) {
              onSave();
            }
            setOpen(false);
          }}
        >
          {useSaveInsteadOfCancel ? "Save" : "Cancel"}
        </Button>
        <Button
          variant="warn"
          loading={isDeleting}
          disabled={disabled}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
}
