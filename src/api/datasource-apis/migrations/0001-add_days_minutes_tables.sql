-- Up
DROP TABLE IF EXISTS days;
DROP TABLE IF EXISTS minutes;
CREATE TABLE days (
  "summary_date" TEXT PRIMARY KEY,
  "restless" INTEGER,
  "midpoint_at_delta" INTEGER,
  "bedtime_start" TIMESTAMP,
  "midpoint_time" INTEGER,
  "onset_latency" INTEGER,
  "hr_lowest" INTEGER,
  "score_deep" INTEGER,
  "rmssd" INTEGER,
  "total" INTEGER,
  "period_id" INTEGER,
  "bedtime_start_delta" INTEGER,
  "score" INTEGER,
  "light" INTEGER,
  "bedtime_end" TIMESTAMP,
  "score_efficiency" INTEGER,
  "score_total" INTEGER,
  "duration" INTEGER,
  "rem" INTEGER,
  "score_latency" INTEGER,
  "awake" INTEGER,
  "is_longest" INTEGER,
  "hr_average" REAL,
  "score_disturbances" INTEGER,
  "breath_average" REAL,
  "efficiency" INTEGER,
  "score_alignment" INTEGER,
  "deep" INTEGER,
  "bedtime_end_delta" INTEGER,
  "timezone" INTEGER,
  "temperature_delta" REAL,
  "score_rem" INTEGER
);

CREATE TABLE minutes (
  "minute" TEXT PRIMARY KEY,
  "summary_date" TIMESTAMP,
  "hr_5min" INTEGER,
  "rmssd_5min" INTEGER,
  "hypnogram_5min" INTEGER
);

-- Down

DROP TABLE days;
DROP TABLE minutes;
