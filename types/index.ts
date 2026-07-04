// Define at least 3 interfaces in types/index.ts (your project entities) //

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    score: number;
}

export interface Grade {
    score: number;
    maxScore: number;
}

export interface Course {
    name: string;
    units: number;
    semester: string;
}