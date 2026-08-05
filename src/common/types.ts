import type { Status } from "./enums"

export interface Values {
    title: string
    description: string
    status: Status
    isDeleted: boolean
}

export interface Task {
    id: string
    title: string
    description: string
    status: Status
    isDeleted: boolean
}