import type { Course, Grade, Student } from "./types";

function getStudent(id: number): Student {
    return {
        id,
        name: "Juan dela Cruz",
        email: "juan@example.com",
        role: "student",
        isActive: true,
        score: 95.5,
    };
}

function calculateGrade(score: number, maxScore: number): string {
    const percentage: number = (score / maxScore) * 100;

    if (percentage >= 90) {
        return "A";
    }
    if (percentage >= 80) {
        return "B";
    }
    if (percentage >= 70) {
        return "C";
    }

    return "F";
}

function formatCourseInfo(name: string, units: number, semester: string): string {
    return `${name} (${units} units) - ${semester}`;
}

function getStudentReport(name: string, courseName: string, units: number, semester: string): string {
    const course: Course = {
        name: courseName,
        units,
        semester,
    };
    const grade: Grade = {
        score: 95,
        maxScore: 100,
    };
    const student: Student = getStudent(1);

    return `${name} | ${course.name} | ${course.units} units | ${course.semester} | Grade: ${calculateGrade(grade.score, grade.maxScore)} | Student role: ${student.role}`;
}

export { getStudentReport, formatCourseInfo };
