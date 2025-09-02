import { Student } from "@/services/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconAlertTriangle, IconTrash, IconX } from "@tabler/icons-react";

interface DeleteConfirmationDialogProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteConfirmationDialog({
  student,
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: DeleteConfirmationDialogProps) {
  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <IconAlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle className="text-center">Delete Student</DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to delete this student?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="mx-auto max-w-sm space-y-3 rounded-lg border bg-muted/50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Student:</span>
              <span className="font-semibold">
                {student.firstName} {student.lastName}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Email:</span>
              <span className="text-sm">{student.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Course:</span>
              <Badge variant="secondary">{student.course}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Student ID:</span>
              <span className="font-mono text-sm">{student.studentId}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 cursor-pointer">
            <IconX className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 cursor-pointer"
            
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Deleting...
              </>
            ) : (
              <>
                <IconTrash className="mr-2 h-4 w-4" />
                Delete Student
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
