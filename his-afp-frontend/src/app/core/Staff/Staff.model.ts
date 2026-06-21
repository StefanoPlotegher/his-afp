export interface Staff {
    id: number,
    username: string,
    role: string,
    isActive: boolean

}

export interface StaffAdd {
    username: string,
    password: string,
    role: string,
}

export interface UsernameCheckResponse {
    available: boolean;
}