export function timestampToDate(timestamp: number): string {
    const date = new Date(timestamp * 1000) // 如果date为13位不需要乘1000
    const Y = date.getFullYear() + "-"
    const M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-"
    const D = (date.getDate() < 10 ? "0" + (date.getDate()) : date.getDate()) + " "
    const h = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":"
    const m = (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + ":"
    const s = (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds())
    return Y + M + D + h + m + s
}
