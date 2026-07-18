export interface Student {
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
