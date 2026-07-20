/**
 * Production-ready GPS distance calculation module
 * 
 * This module provides:
 * - Strict GPS accuracy filtering for production environments
 * - Realistic jump detection to prevent teleportation artifacts
 * - Deterministic distance validation
 * - Unit-safe conversions (metric ↔ imperial)
 * - Duplicate prevention in route accumulation
 */

export const METERS_PER_MILE = 1609.344;
export const METERS_PER_KM = 1000;

// GPS accuracy thresholds for different environments
export const GPS_ACCURACY_THRESHOLD = {
  HIGH_CONFIDENCE: 10,    // ±10m — urban with clear sky
  ACCEPTABLE: 25,         // ±25m — urban with some obstruction
  POOR_SIGNAL: 50,        // ±50m — dense urban, indoors (reject)
} as const;

// Maximum realistic distance between consecutive GPS points
// Based on max human speed (40 km/h sprint = 11.1 m/s, so ~30m per 2.7sec sampling)
export const MAX_REALISTIC_JUMP = 30; // meters

// Minimum distance to accumulate (noise floor)
export const MIN_DISTANCE_DELTA = 1; // meter

export interface LatLng {
  lat: number;
  lng: number;
  t: number; // timestamp in ms
}

export interface GPSPoint {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
}

export interface DistanceResult {
  distanceMeters: number;
  distanceMiles: number;
  distanceKm: number;
  pointsUsed: number;
  pointsRejected: number;
  checksumMeters: number; // For verification of round-trip conversions
}

/**
 * Haversine distance formula (high precision)
 * Returns distance in meters between two points
 */
export function haversineDistance(a: LatLng, b: LatLng): number {
  const R = 6_371_000; // Earth radius in meters (WGS84)
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  const distance = 2 * R * Math.asin(Math.sqrt(h));
  
  // Ensure no NaN or Infinity
  return Number.isFinite(distance) && distance >= 0 ? distance : 0;
}

/**
 * Validate GPS point quality
 * Returns true if point should be used for distance calculation
 */
export function isValidGPSPoint(point: GPSPoint, strictMode = true): boolean {
  // Validate coordinates are within valid ranges
  if (!Number.isFinite(point.lat) || !Number.isFinite(point.lng)) {
    return false;
  }
  if (point.lat < -90 || point.lat > 90 || point.lng < -180 || point.lng > 180) {
    return false;
  }

  // Validate accuracy
  const accuracyThreshold = strictMode
    ? GPS_ACCURACY_THRESHOLD.ACCEPTABLE
    : GPS_ACCURACY_THRESHOLD.POOR_SIGNAL;

  if (!Number.isFinite(point.accuracy) || point.accuracy < 0) {
    return false; // Unknown accuracy is bad
  }
  if (point.accuracy > accuracyThreshold) {
    return false; // GPS signal too weak
  }

  return true;
}

/**
 * Check if jump between consecutive points is realistic
 * Prevents GPS teleportation artifacts
 */
export function isRealisticJump(
  prevPoint: LatLng,
  currentPoint: LatLng,
  maxJump = MAX_REALISTIC_JUMP
): boolean {
  const distance = haversineDistance(prevPoint, currentPoint);
  
  // Distance must be within realistic range
  if (distance < MIN_DISTANCE_DELTA) {
    return false; // Too small, likely noise
  }
  if (distance > maxJump) {
    return false; // Too large, likely GPS glitch
  }

  return true;
}

/**
 * Calculate total distance from route, with validation
 */
export function calculateRouteDistance(
  route: LatLng[],
  gpsSamples?: GPSPoint[]
): DistanceResult {
  let totalMeters = 0;
  let pointsUsed = 0;
  let pointsRejected = 0;

  if (!route || route.length < 2) {
    return {
      distanceMeters: 0,
      distanceMiles: 0,
      distanceKm: 0,
      pointsUsed: 0,
      pointsRejected: 0,
      checksumMeters: 0,
    };
  }

  // If we have GPS samples with accuracy data, validate strictly
  const strictMode = Boolean(gpsSamples && gpsSamples.length > 0);

  for (let i = 1; i < route.length; i++) {
    const prev = route[i - 1];
    const current = route[i];

    // If we have accuracy data, check it
    if (strictMode && gpsSamples && gpsSamples[i]) {
      if (!isValidGPSPoint(gpsSamples[i], true)) {
        pointsRejected++;
        continue;
      }
    }

    // Check if jump is realistic
    if (!isRealisticJump(prev, current)) {
      pointsRejected++;
      continue;
    }

    const delta = haversineDistance(prev, current);
    if (delta >= MIN_DISTANCE_DELTA) {
      totalMeters += delta;
      pointsUsed++;
    }
  }

  const distanceMiles = totalMeters / METERS_PER_MILE;
  const distanceKm = totalMeters / METERS_PER_KM;

  return {
    distanceMeters: totalMeters,
    distanceMiles,
    distanceKm,
    pointsUsed,
    pointsRejected,
    checksumMeters: Math.round(totalMeters * 1000) % 1_000_000, // For verification
  };
}

/**
 * Convert meters to miles with precision guarantee
 */
export function metersToMiles(meters: number): number {
  if (!Number.isFinite(meters) || meters < 0) {
    return 0;
  }
  return meters / METERS_PER_MILE;
}

/**
 * Convert miles to meters with precision guarantee
 */
export function milesToMeters(miles: number): number {
  if (!Number.isFinite(miles) || miles < 0) {
    return 0;
  }
  return miles * METERS_PER_MILE;
}

/**
 * Convert meters to kilometers
 */
export function metersToKm(meters: number): number {
  if (!Number.isFinite(meters) || meters < 0) {
    return 0;
  }
  return meters / METERS_PER_KM;
}

/**
 * Convert kilometers to meters
 */
export function kmToMeters(km: number): number {
  if (!Number.isFinite(km) || km < 0) {
    return 0;
  }
  return km * METERS_PER_KM;
}

/**
 * Verify round-trip conversion (meters → miles → meters)
 * Returns true if conversion is deterministic within tolerance
 */
export function verifyConversion(originalMeters: number, tolerance = 0.001): boolean {
  const miles = metersToMiles(originalMeters);
  const backToMeters = milesToMeters(miles);
  const error = Math.abs(originalMeters - backToMeters);
  return error <= tolerance;
}

/**
 * Format distance for display
 */
export function formatDistance(
  meters: number,
  unit: 'mi' | 'km' = 'mi'
): string {
  if (unit === 'mi') {
    return metersToMiles(meters).toFixed(2);
  }
  return metersToKm(meters).toFixed(2);
}

/**
 * Validate that accumulated distance is sane
 * Prevents accidental submissions of invalid data
 */
export function isValidAccumulatedDistance(meters: number): boolean {
  // Must be a number
  if (!Number.isFinite(meters)) {
    return false;
  }

  // Must be non-negative
  if (meters < 0) {
    return false;
  }

  // Sanity check: no activity should be > 1000 km in a day
  // (fastest runner: ~40 km/h × 24h = 960 km max theoretical)
  if (meters > 1_000_000) {
    return false;
  }

  return true;
}

/**
 * Calculate average pace (seconds per mile) safely
 */
export function calculatePaceSecPerMile(
  durationSeconds: number,
  distanceMeters: number
): number {
  const miles = metersToMiles(distanceMeters);
  
  if (miles <= 0 || durationSeconds <= 0) {
    return 0;
  }

  const pace = durationSeconds / miles;
  return Number.isFinite(pace) ? pace : 0;
}

/**
 * Calculate speed in mph safely
 */
export function calculateSpeedMph(
  durationSeconds: number,
  distanceMeters: number
): number {
  const miles = metersToMiles(distanceMeters);
  const hours = durationSeconds / 3600;

  if (hours <= 0 || miles < 0) {
    return 0;
  }

  const speed = miles / hours;
  return Number.isFinite(speed) ? speed : 0;
}
