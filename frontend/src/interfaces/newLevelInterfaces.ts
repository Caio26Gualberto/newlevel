export interface IAlertNewLevel {
    severity: "success" | "info" | "warning" | "error"
    title: string
    message: string
}