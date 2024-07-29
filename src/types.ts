
export interface PackageManager {
    name: string,
    package: { language: string, format: string, versions: string[] },
    disabled: boolean
}