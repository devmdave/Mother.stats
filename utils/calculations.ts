export interface MaternalMetrics {
  mealsPrepared: number;
  lunchesPacked: number;
  schoolPickupsDrops: number;
  clothesWashed: number;
  groceryTrips: number;
  teaCups: number;
  hoursSpentCooking: number;
  kitchenDays: number;
  cookingYears: number;
  totalCareHours: number;
}

export function calculateMaternalMetrics(age: number): MaternalMetrics {
  const safeAge = Math.max(0, age);
  
  // Base calculations
  const mealsPrepared     = safeAge * 365 * 2;
  const clothesWashed     = safeAge * 52 * 7;
  const groceryTrips      = safeAge * 52 * 2;
  const teaCups           = safeAge * 365 * 2;

  // Cooking — updated to 8 hours/day
  const hoursSpentCooking = safeAge * 365 * 8;
  const kitchenDays       = Math.round(hoursSpentCooking / 24);
  const cookingYears      = Math.round(hoursSpentCooking / 8760); // rounded to nearest whole year

  // Fixed school numbers (12 years × 220 days)
  const lunchesPacked      = 12 * 220;
  const schoolPickupsDrops = 12 * 220 * 2;

  // Total care hours aggregated
  const totalCareHours = Math.round(
    hoursSpentCooking +
    (groceryTrips * 1.5) +
    (clothesWashed * 0.75) +
    (schoolPickupsDrops * 0.5)
  );

  return {
    mealsPrepared,
    lunchesPacked,
    schoolPickupsDrops,
    clothesWashed,
    groceryTrips,
    teaCups,
    hoursSpentCooking,
    kitchenDays,
    cookingYears,
    totalCareHours,
  };
}
