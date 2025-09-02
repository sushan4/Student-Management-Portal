import { Student } from "@/services/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IconUser, IconMail, IconPhone, IconMapPin, IconCalendar, IconSchool, IconChartBar } from "@tabler/icons-react";

interface StudentDetailsModalProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentDetailsModal({ student, open, onOpenChange }: StudentDetailsModalProps) {
  if (!student) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.5) return "default";
    if (gpa >= 2.5) return "secondary";
    return "destructive";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl min-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconUser className="h-5 w-5" />
            Student Details
          </DialogTitle>
          <DialogDescription>
            Complete information for {student.firstName} {student.lastName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <IconUser className="h-4 w-4" />
                    Full Name
                  </div>
                  <p className="font-semibold">{student.firstName} {student.lastName}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <IconMail className="h-4 w-4" />
                    Email
                  </div>
                  <p className="text-blue-600">{student.email}</p>
                </div>

                {student.phone && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <IconPhone className="h-4 w-4" />
                      Phone
                    </div>
                    <p>{student.phone}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <IconCalendar className="h-4 w-4" />
                    Date of Birth
                  </div>
                  <p>{formatDate(student.dateOfBirth)}</p>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Gender</div>
                  <Badge variant="outline">{student.gender}</Badge>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Status</div>
                  <Badge variant={student.isActive ? "default" : "secondary"}>
                    {student.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <IconMapPin className="h-4 w-4" />
                  Address
                </div>
                <p>{student.address}</p>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Academic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <IconSchool className="h-4 w-4" />
                    Course
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {student.course}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Year</div>
                  <p className="text-lg font-semibold">{student.year}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <IconChartBar className="h-4 w-4" />
                    GPA
                  </div>
                  <Badge variant={getGPAColor(student.gpa)} className="text-sm">
                    {student.gpa.toFixed(2)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Student ID</div>
                  <p className="font-mono">{student.studentId}</p>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Created</div>
                  <p className="text-sm">{formatDate(student.createdAt)}</p>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Last Updated</div>
                  <p className="text-sm">{formatDate(student.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
