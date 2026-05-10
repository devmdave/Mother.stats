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
  
  // Required formulas
  const mealsPrepared = safeAge * 365 * 2;
  const clothesWashed = safeAge * 52 * 7;
  const groceryTrips = safeAge * 52 * 2;
  const hoursSpentCooking = safeAge * 365 * 6;
  
  // Fixed school numbers (12 years)
  const lunchesPacked = 12 * 220;
  const schoolPickupsDrops = 12 * 220 * 2;
  
  const teaCups = safeAge * 365 * 2;
  
  const kitchenDays = hoursSpentCooking / 24;
  const cookingYears = hoursSpentCooking / 8760;
  
  const totalCareHours = hoursSpentCooking + (groceryTrips * 1.5) + (clothesWashed * 0.75) + (schoolPickupsDrops * 0.5);

  return {
    mealsPrepared,
    lunchesPacked,
    schoolPickupsDrops,
    clothesWashed,
    groceryTrips,
    teaCups,
    hoursSpentCooking,
    kitchenDays: parseFloat(kitchenDays.toFixed(1)),
    cookingYears: parseFloat(cookingYears.toFixed(1)),
    totalCareHours: Math.round(totalCareHours)
  };
}
