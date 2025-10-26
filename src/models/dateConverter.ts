// Utility functions for date conversion and calculate number of days left before expiration
export function getNumberDaysLeftBeforeExpiration (expiredDate: { seconds: number; nanoseconds: number }): number {
    const currentDate = new Date();
    const targetDate = new Date(expiredDate.seconds * 1000 + expiredDate.nanoseconds / 1000000);
    const timeDifference = targetDate.getTime() - currentDate.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
    return daysDifference;
}
export function convertTimestampToDateString (timestamp: { seconds: number; nanoseconds: number }): string {
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    return date.toDateString();
}