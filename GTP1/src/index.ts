import { getStudentReport, formatCourseInfo } from "./sample";

function main(): void {
    const studentName: string = "Mikaela Lantafe";
    const courseName: string = "IT Elective 4";
    const units: number = 3;
    const semester: string = "1st Semester";

    const report: string = getStudentReport(studentName, courseName, units, semester);
    const courseInfo: string = formatCourseInfo(courseName, units, semester);

    console.log(report);
    console.log(courseInfo);
}

main();
