import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { StudentDataTable } from "@/components/student-data-table";
import { StudentForm } from "@/components/student-form";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { StudentDetailsModal } from "@/components/student-details-modal";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { useStudents } from "@/hooks/use-students";
import { Student } from "@/services/api";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconPlus, IconRefresh, IconAlertTriangle } from "@tabler/icons-react";

export default function Dashboard() {
  const {
    students,
    loading,
    error,
    selectedStudent,
    setSelectedStudent,
    refreshStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    isOperationLoading,
  } = useStudents();

  const [activeTab, setActiveTab] = useState<"overview" | "add-student">("overview");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setActiveTab("add-student");
  };

  const handleDelete = async (student: Student) => {
    setStudentToDelete(student);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (studentToDelete) {
      try {
        await deleteStudent(studentToDelete.studentId);
        setShowDeleteDialog(false);
        setStudentToDelete(null);
      } catch (error) {
        // Error is handled in the hook
      }
    }
  };

  const handleSelect = (student: Student) => {
    setSelectedStudent(student);
    setShowDetailsModal(true);
  };

  const handleFormSubmit = async (studentData: Omit<Student, 'studentId' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (selectedStudent) {
        await updateStudent(selectedStudent.studentId, studentData);
      } else {
        await createStudent(studentData);
      }
      setActiveTab("overview");
      setSelectedStudent(null);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleFormCancel = () => {
    setSelectedStudent(null);
    setActiveTab("overview");
  };

  const handleAddNew = () => {
    setSelectedStudent(null);
    setActiveTab("add-student");
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              
              {/* Error Display */}
              {error && (
                <Card className="border-red-200 bg-red-50 mx-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-800">
                      <IconAlertTriangle className="h-5 w-5" />
                      Error
                    </CardTitle>
                    <CardDescription className="text-red-600">
                      {error}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      onClick={refreshStudents}
                      className="border-red-200 text-red-700 hover:bg-red-100 cursor-pointer"
                    >
                      <IconRefresh className="mr-2 h-4 w-4" />
                      Retry
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Statistics Cards */}
              <SectionCards students={students} />

              {/* Main Content Tabs */}
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "overview" | "add-student")}>
                <div className="flex items-center justify-between px-4 lg:px-6">
                  <TabsList >
                    <TabsTrigger value="overview" className="cursor-pointer">Student Overview</TabsTrigger>
                    <TabsTrigger value="add-student" className="cursor-pointer">
                      {selectedStudent ? "Edit Student" : "Add Student"}
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={refreshStudents}
                      disabled={loading}
                      className="cursor-pointer"
                    >
                      <IconRefresh className="mr-2 h-4 w-4" />
                      Refresh
                    </Button>
                    <Button onClick={handleAddNew}
                     className="cursor-pointer">
                      <IconPlus className="mr-2 h-4 w-4" />
                      Add Student
                    </Button>
                  </div>
                </div>

                <TabsContent value="overview" className="px-4 lg:px-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Students Directory</CardTitle>
                      <CardDescription>
                        Manage student records, view details, and perform CRUD operations.
                        {selectedStudent && (
                          <span className="block mt-2 text-sm font-medium text-blue-600">
                            Selected: {selectedStudent.firstName} {selectedStudent.lastName}
                          </span>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <StudentDataTable
                        data={students}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onSelect={handleSelect}
                        selectedStudent={selectedStudent}
                        isLoading={loading}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="add-student" className="px-4 lg:px-6">
                  <StudentForm
                    student={selectedStudent}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                    isLoading={isOperationLoading}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </SidebarInset>

      {/* Student Details Modal */}
      <StudentDetailsModal
        student={selectedStudent}
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        student={studentToDelete}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleConfirmDelete}
        isLoading={isOperationLoading}
      />
    </SidebarProvider>
  );
}
