import { useState, useEffect, useCallback } from 'react';
import { studentAPI, Student, ApiError } from '@/services/api';
import { toast } from 'sonner';

export interface UseStudentsResult {
  students: Student[];
  loading: boolean;
  error: string | null;
  selectedStudent: Student | null;
  setSelectedStudent: (student: Student | null) => void;
  refreshStudents: () => Promise<void>;
  createStudent: (student: Omit<Student, 'studentId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateStudent: (id: number, student: Omit<Student, 'studentId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteStudent: (id: number) => Promise<void>;
  isOperationLoading: boolean;
}

export function useStudents(): UseStudentsResult {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOperationLoading, setIsOperationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handleError = useCallback((error: unknown, defaultMessage: string) => {
    if (error instanceof ApiError) {
      const message = `${defaultMessage}: ${error.message}`;
      setError(message);
      toast.error(message);
    } else if (error instanceof Error) {
      const message = `${defaultMessage}: ${error.message}`;
      setError(message);
      toast.error(message);
    } else {
      setError(defaultMessage);
      toast.error(defaultMessage);
    }
  }, []);


  //refresh function
  const refreshStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentAPI.getAll();
      setStudents(data);
    } catch (error) {
      handleError(error, 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  //student creation function
  const createStudent = useCallback(async (studentData: Omit<Student, 'studentId' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsOperationLoading(true);
      const newStudent = await studentAPI.create(studentData);
      setStudents(prev => [...prev, newStudent]);
      toast.success('Student created successfully');
    } catch (error) {
      handleError(error, 'Failed to create student');
      throw error;
    } finally {
      setIsOperationLoading(false);
    }
  }, [handleError]);

  //update student details
  const updateStudent = useCallback(async (id: number, studentData: Omit<Student, 'studentId' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsOperationLoading(true);
      const updatedStudent = await studentAPI.update(id, studentData);
      setStudents(prev => prev.map(student => 
        student.studentId === id ? updatedStudent : student
      ));
      
      // Update selected student if it's the one being updated
      if (selectedStudent?.studentId === id) {
        setSelectedStudent(updatedStudent);
      }
      
      toast.success('Student updated successfully');
    } catch (error) {
      handleError(error, 'Failed to update student');
      throw error; // Re-throw to allow form handling
    } finally {
      setIsOperationLoading(false);
    }
  }, [handleError, selectedStudent]);

  //delete a student
  const deleteStudent = useCallback(async (id: number) => {
    try {
      setIsOperationLoading(true);
      await studentAPI.delete(id);
      setStudents(prev => prev.filter(student => student.studentId !== id));
      
      // Clear selected student if it's the one being deleted
      if (selectedStudent?.studentId === id) {
        setSelectedStudent(null);
      }
      
      toast.success('Student deleted successfully');
    } catch (error) {
      handleError(error, 'Failed to delete student');
      throw error; // Re-throw to allow error handling
    } finally {
      setIsOperationLoading(false);
    }
  }, [handleError, selectedStudent]);

  // Initial load
  useEffect(() => {
    refreshStudents();
  }, [refreshStudents]);

  return {
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
  };
}
