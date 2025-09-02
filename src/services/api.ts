// API Configuration
const API_BASE_URL = 'http://localhost:5082/api'; // Based on the dotnet backend port

// Student interface to match the backend model
export interface Student {
  studentId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  course: string;
  year: number;
  gpa: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

// API Error class
export class ApiError extends Error {
  status: number;
  
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

// API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: defaultHeaders,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(response.status, errorText || `HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return response.text() as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Student API functions
export const studentAPI = {
  // Get all students
  getAll: (): Promise<Student[]> => {
    return apiRequest<Student[]>('/students');
  },

  // Get student by ID
  getById: (id: number): Promise<Student> => {
    return apiRequest<Student>(`/students/${id}`);
  },

  // Create new student
  create: (student: Omit<Student, 'studentId' | 'createdAt' | 'updatedAt'>): Promise<Student> => {
    return apiRequest<Student>('/students', {
      method: 'POST',
      body: JSON.stringify(student),
    });
  },

  // Update student
  update: (id: number, student: Omit<Student, 'studentId' | 'createdAt' | 'updatedAt'>): Promise<Student> => {
    return apiRequest<Student>(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(student),
    });
  },

  // Delete student (soft delete)
  delete: (id: number): Promise<void> => {
    return apiRequest<void>(`/students/${id}`, {
      method: 'DELETE',
    });
  },
};
