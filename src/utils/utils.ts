// Used to make less reps at higher weights worth more
export function getEffortFactor(reps: number): number {
    if (reps >= 1 && reps <= 3) return 2.0;
    if (reps >= 4 && reps <= 6) return 1.5;
    if (reps >= 7 && reps <= 10) return 1.2;
    if (reps >= 11 && reps <= 15) return 1.0;
    return 0.8;  // For 16+ reps
}

// Add two dates together
export function addDays(date: Date, days: number): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }