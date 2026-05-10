export interface MaternalMetrics {
  mealsPrepared: number;
  lunchesPacked: number;
  clothesWashed: number;
  hoursSpentCooking: number;
  schoolWakeups: number;
  groceryTrips: number;
  callsCheckIns: number;
  waterReminders: number;
  schoolPickupsDrops: number;
}

export function calculateMaternalMetrics(age: number): MaternalMetrics {
  const safeAge = Math.max(0, age);
  const yearsAtHome = Math.min(safeAge, 18);
  const yearsAway = Math.max(0, safeAge - 18);
  const schoolYears = Math.min(Math.max(0, safeAge - 5), 13); // typically K-12

  // ~2.8 meals/day at home, maybe occasional meals when visiting after 18
  const mealsPrepared = Math.round(yearsAtHome * 365 * 2.8 + yearsAway * 365 * 0.2);
  
  // ~180 school days/year, packed lunches 80% of the time
  const lunchesPacked = Math.round(schoolYears * 180 * 0.8);
  
  // ~2 loads of laundry per week for the child
  const clothesWashed = Math.round(yearsAtHome * 52 * 2 + yearsAway * 52 * 0.2);
  
  // ~1.2 hours/day cooking while at home
  const hoursSpentCooking = Math.round(yearsAtHome * 365 * 1.2 + yearsAway * 365 * 0.1);
  
  // 180 school days, assuming early wakeups for school
  const schoolWakeups = Math.round(schoolYears * 180);
  
  // ~1.5 grocery trips/week for the family, child's share of that effort
  const groceryTrips = Math.round(yearsAtHome * 52 * 1.5);
  
  // Checking in: during home years it's daily "how are you", later it's actual phone calls (~2.5/wk)
  const callsCheckIns = Math.round(yearsAtHome * 365 + yearsAway * 52 * 2.5);
  
  // Gentle nagging to drink water, wear a jacket, etc. ~2x/day
  const waterReminders = Math.round(safeAge * 365 * 2);
  
  // 2 trips per school day, assuming 60% of the time driven (rest bus/walk/carpool)
  const schoolPickupsDrops = Math.round(schoolYears * 180 * 2 * 0.6);

  return {
    mealsPrepared,
    lunchesPacked,
    clothesWashed,
    hoursSpentCooking,
    schoolWakeups,
    groceryTrips,
    callsCheckIns,
    waterReminders,
    schoolPickupsDrops
  };
}
