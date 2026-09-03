/**
 * 1D Kalman filter for GPS position, weighted by each fix's reported
 * accuracy. This is the standard technique production trackers (Strava,
 * Nike Run Club) use to turn a noisy stream of GPS fixes into a smooth,
 * accurate track — a fixed-alpha moving average can't do this because a
 * single alpha either lags real movement (too smooth) or lets jitter
 * through (too twitchy), and it ignores how good each individual fix is.
 *
 * The filter's positional uncertainty grows the longer it goes without a
 * fix (bounded by a plausible human movement speed), and shrinks with
 * every new fix — weighted more heavily toward fixes with tighter
 * accuracy and away from noisy ones. Lat/lng are treated as flat local
 * coordinates, which is accurate enough over the meter-scale distances a
 * single activity covers.
 */
export class GpsKalmanFilter {
  private lat = 0;
  private lng = 0;
  private variance = -1; // meters^2; -1 means "uninitialized"
  private lastTimestampMs = 0;
  private readonly processNoiseMetersPerSec: number;

  constructor(processNoiseMetersPerSec = 3) {
    this.processNoiseMetersPerSec = processNoiseMetersPerSec;
  }

  get position(): { lat: number; lng: number } {
    return { lat: this.lat, lng: this.lng };
  }

  get isInitialized(): boolean {
    return this.variance >= 0;
  }

  reset(): void {
    this.variance = -1;
  }

  /** Feed one raw GPS fix in, get the filtered position out. */
  update(
    lat: number,
    lng: number,
    accuracyMeters: number,
    timestampMs: number
  ): { lat: number; lng: number } {
    const accuracy = Math.max(accuracyMeters, 1);

    if (this.variance < 0) {
      this.lastTimestampMs = timestampMs;
      this.lat = lat;
      this.lng = lng;
      this.variance = accuracy * accuracy;
      return this.position;
    }

    const dtSec = Math.max(0, (timestampMs - this.lastTimestampMs) / 1000);
    this.lastTimestampMs = timestampMs;
    if (dtSec > 0) {
      const speed = this.processNoiseMetersPerSec;
      this.variance += dtSec * speed * speed;
    }

    const gain = this.variance / (this.variance + accuracy * accuracy);
    this.lat += gain * (lat - this.lat);
    this.lng += gain * (lng - this.lng);
    this.variance = (1 - gain) * this.variance;

    return this.position;
  }
}
