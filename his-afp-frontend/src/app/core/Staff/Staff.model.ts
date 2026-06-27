export interface Staff {
    id: number,
    username: string,
    role: Role,
    isActive: boolean

}

export interface StaffAdd {
    username: string,
    password: string,
    role: Role,
}

export interface UsernameCheckResponse {
    available: boolean;
}

export type Role = 'DOC' | 'INF' | 'AMM' | '';