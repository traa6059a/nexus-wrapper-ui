
export interface PackageManager {
    name: string,
    package: { language: string, format: string, versions: string[] },
    disabled: boolean
}
export interface MonacoEditor {
    getValue(): string;
}

export enum Mode {
    Single = 1,
    Multiple = 2
}

export interface ApiResponse {
    isSuccess: boolean
    message: string
}

export interface Form {
    mode: Mode;
    packageManager: string;
    packageManagerVersion: string;
    packageName?: string
    packageVersion?: string;
    groupId?: string;
}