import React, { useState, useEffect } from "react";
import { Student } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconLoader, IconPlus, IconEdit } from "@tabler/icons-react";

interface StudentFormProps {
  student?: Student | null;
  onSubmit: (
    studentData: Omit<Student, "studentId" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function StudentForm({
  student,
  onSubmit,
  onCancel,
  isLoading = false,
}: StudentFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    course: "",
    year: 1,
    gpa: 0,
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form when student prop changes
  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phone: student.phone || "",
        dateOfBirth: student.dateOfBirth.split("T")[0], // Convert to YYYY-MM-DD format
        gender: student.gender,
        address: student.address,
        course: student.course,
        year: student.year,
        gpa: student.gpa,
        isActive: student.isActive,
      });
    } else {
      // Reset form for new student
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "",
        address: "",
        course: "",
        year: 1,
        gpa: 0,
        isActive: true,
      });
    }
    setErrors({});
  }, [student]);

  //validate form and define errors to be shown
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.course.trim()) newErrors.course = "Course is required";
    if (!formData.year) newErrors.year = "Year is required";
    if (!formData.gpa) newErrors.gpa = "GPA is required";
    if (formData.year < 1 || formData.year > 4)
      newErrors.year = "Year must be between 1 and 4";
    if (formData.gpa < 0 || formData.gpa > 4)
      newErrors.gpa = "GPA must be between 0 and 4";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({
        ...formData,
        dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
      });

      // Reset form if this is a new student (no student prop)
      if (!student) {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          dateOfBirth: "",
          gender: "",
          address: "",
          course: "",
          year: 1,
          gpa: 0,
          isActive: true,
        });
      }
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const handleInputChange = (
    field: string,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const isEditing = !!student;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isEditing ? (
            <IconEdit className="h-5 w-5" />
          ) : (
            <IconPlus className="h-5 w-5" />
          )}
          {isEditing ? "Edit Student" : "Add New Student"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Update student information"
            : "Fill in the details to add a new student"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="Enter first name"
                className={errors.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder="Enter last name"
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter email address"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  handleInputChange("dateOfBirth", e.target.value)
                }
                className={errors.dateOfBirth ? "border-red-500" : ""}
              />
              {errors.dateOfBirth && (
                <p className="text-sm text-red-500">{errors.dateOfBirth}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleInputChange("gender", value)}
              >
                <SelectTrigger
                  className={errors.gender ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-sm text-red-500">{errors.gender}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter address"
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="course">Course *</Label>
              <Input
                id="course"
                value={formData.course}
                onChange={(e) => handleInputChange("course", e.target.value)}
                placeholder="Enter course name"
                className={errors.course ? "border-red-500" : ""}
              />
              {errors.course && (
                <p className="text-sm text-red-500">{errors.course}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                min="1"
                max="10"
                value={formData.year}
                onChange={(e) =>
                  handleInputChange(
                    "year",
                    e.target.value === "" ? "" : parseInt(e.target.value)
                  )
                }
                className={errors.year ? "border-red-500" : ""}
              />

              {errors.year && (
                <p className="text-sm text-red-500">{errors.year}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gpa">GPA *</Label>
              <Input
                id="gpa"
                type="number"
                step="0.01"
                min="0"
                max="4"
                value={formData.gpa}
                onChange={(e) =>
                  handleInputChange(
                    "gpa",
                    e.target.value === "" ? "" : parseFloat(e.target.value)
                  )
                }
                className={errors.gpa ? "border-red-500" : ""}
              />

              {errors.gpa && (
                <p className="text-sm text-red-500">{errors.gpa}</p>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="cursor-pointer">
              {isLoading && (
                <IconLoader className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEditing ? "Update Student" : "Add Student"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="cursor-pointer">
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
