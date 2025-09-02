import { IconTrendingDown, IconTrendingUp, IconUsers, IconUserPlus, IconSchool, IconChartBar } from "@tabler/icons-react";
import { Student } from "@/services/api";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SectionCardsProps {
  students: Student[];
}

export function SectionCards({ students }: SectionCardsProps) {
  // Calculate statistics
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.isActive).length;
  const averageGPA = students.length > 0 
    ? students.reduce((sum, s) => sum + s.gpa, 0) / students.length 
    : 0;
  
  // Calculate new students (students created in the last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const newStudents = students.filter(s => new Date(s.createdAt) > thirtyDaysAgo).length;
  
  // Calculate course distribution
  const courses = students.reduce((acc, student) => {
    acc[student.course] = (acc[student.course] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const totalCourses = Object.keys(courses).length;

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconUsers className="h-4 w-4" />
            Total Students
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalStudents}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp className="h-3 w-3" />
              Active: {activeStudents}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total enrolled students
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconUserPlus className="h-4 w-4" />
            New Students
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {newStudents}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp className="h-3 w-3" />
              Last 30 days
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Recently enrolled students
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconChartBar className="h-4 w-4" />
            Average GPA
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {averageGPA.toFixed(2)}
          </CardTitle>
          <CardAction>
            <Badge variant={averageGPA >= 3.0 ? "default" : "secondary"}>
              {averageGPA >= 3.0 ? (
                <IconTrendingUp className="h-3 w-3" />
              ) : (
                <IconTrendingDown className="h-3 w-3" />
              )}
              {averageGPA >= 3.0 ? "Good" : "Needs Improvement"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Overall academic performance
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconSchool className="h-4 w-4" />
            Total Courses
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalCourses}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp className="h-3 w-3" />
              Courses
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Different courses offered
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
