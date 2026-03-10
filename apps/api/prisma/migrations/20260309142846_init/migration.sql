-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateEnum
CREATE TYPE "Region" AS ENUM ('east_sea', 'west_sea', 'south_sea', 'inland');

-- CreateEnum
CREATE TYPE "BottomType" AS ENUM ('sand', 'rock', 'coral', 'mud', 'mixed');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('beginner', 'intermediate', 'advanced');

-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('free', 'pro');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "SkillLevel" AS ENUM ('beginner', 'intermediate', 'advanced');

-- CreateEnum
CREATE TYPE "UnitWind" AS ENUM ('ms', 'knots', 'kmh');

-- CreateEnum
CREATE TYPE "UnitWave" AS ENUM ('m', 'ft');

-- CreateEnum
CREATE TYPE "StationType" AS ENUM ('aws', 'buoy', 'koem');

-- CreateEnum
CREATE TYPE "Grade" AS ENUM ('excellent', 'good', 'fair', 'poor');

-- CreateEnum
CREATE TYPE "SpotRequestStatus" AS ENUM ('pending', 'approved', 'rejected', 'duplicate');

-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('advisory', 'warning');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('apple_iap', 'google_iap', 'portone');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('active', 'expired', 'cancelled');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "nickname" VARCHAR(50) NOT NULL,
    "avatar_url" TEXT,
    "role" "Role" NOT NULL DEFAULT 'user',
    "plan" "Plan" NOT NULL DEFAULT 'free',
    "skill_level" "SkillLevel" NOT NULL DEFAULT 'beginner',
    "unit_wind" "UnitWind" NOT NULL DEFAULT 'ms',
    "unit_wave" "UnitWave" NOT NULL DEFAULT 'm',
    "dark_mode" BOOLEAN NOT NULL DEFAULT false,
    "fcm_token" TEXT,
    "kakao_id" VARCHAR(100),
    "apple_id" VARCHAR(100),
    "google_id" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "plan" "Plan" NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'active',
    "payment_method" "PaymentMethod" NOT NULL,
    "transaction_id" VARCHAR(255),
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "cancelled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spots" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "location" geography(Point, 4326) NOT NULL,
    "address" VARCHAR(200),
    "region" "Region" NOT NULL,
    "spot_types" TEXT[],
    "depth_avg" DOUBLE PRECISION,
    "bottom_type" "BottomType",
    "difficulty" "Difficulty" NOT NULL,
    "season_start" SMALLINT,
    "season_end" SMALLINT,
    "hazard_notes" TEXT,
    "cover_image_url" TEXT,
    "image_urls" TEXT[],
    "info_cards" JSONB[],
    "marina_info" JSONB,
    "homepage_url" TEXT,
    "reservation_url" TEXT,
    "phone" VARCHAR(20),
    "sns_url" JSONB,
    "operating_hours" VARCHAR(200),
    "closed_days" VARCHAR(100),
    "price_info" TEXT,
    "reservation_required" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spot_amenities" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "spot_id" UUID NOT NULL,
    "has_parking" BOOLEAN NOT NULL DEFAULT false,
    "has_shower" BOOLEAN NOT NULL DEFAULT false,
    "has_equipment_rental" BOOLEAN NOT NULL DEFAULT false,
    "has_docking" BOOLEAN NOT NULL DEFAULT false,
    "has_rescue_station" BOOLEAN NOT NULL DEFAULT false,
    "has_restroom" BOOLEAN NOT NULL DEFAULT false,
    "has_restaurant" BOOLEAN NOT NULL DEFAULT false,
    "has_accommodation" BOOLEAN NOT NULL DEFAULT false,
    "has_wifi" BOOLEAN NOT NULL DEFAULT false,
    "has_locker" BOOLEAN NOT NULL DEFAULT false,
    "has_cctv" BOOLEAN NOT NULL DEFAULT false,
    "has_first_aid" BOOLEAN NOT NULL DEFAULT false,
    "parking_note" TEXT,
    "rental_note" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spot_amenities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spot_sources" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "spot_id" UUID NOT NULL,
    "source_name" VARCHAR(100) NOT NULL,
    "source_id" VARCHAR(200) NOT NULL,
    "source_url" TEXT,
    "imported_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "spot_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spot_requests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "spot_types" TEXT[],
    "description" TEXT,
    "image_urls" TEXT[],
    "status" "SpotRequestStatus" NOT NULL DEFAULT 'pending',
    "reject_reason" TEXT,
    "linked_spot_id" UUID,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "spot_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weather_snapshots" (
    "id" BIGSERIAL NOT NULL,
    "spot_id" UUID NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL,
    "wind_speed" DOUBLE PRECISION,
    "wind_direction" SMALLINT,
    "wind_gust" DOUBLE PRECISION,
    "wave_height_sig" DOUBLE PRECISION,
    "wave_height_max" DOUBLE PRECISION,
    "wave_period" DOUBLE PRECISION,
    "wave_direction" SMALLINT,
    "swell_height" DOUBLE PRECISION,
    "swell_period" DOUBLE PRECISION,
    "swell_direction" SMALLINT,
    "sea_temp" DOUBLE PRECISION,
    "air_temp" DOUBLE PRECISION,
    "feels_like" DOUBLE PRECISION,
    "precipitation" DOUBLE PRECISION,
    "precip_prob" SMALLINT,
    "visibility" DOUBLE PRECISION,
    "uv_index" DOUBLE PRECISION,
    "weather_code" SMALLINT,
    "source" VARCHAR(50),

    CONSTRAINT "weather_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "observation_snapshots" (
    "id" BIGSERIAL NOT NULL,
    "spot_id" UUID NOT NULL,
    "station_id" VARCHAR(50) NOT NULL,
    "station_name" VARCHAR(100) NOT NULL,
    "station_type" "StationType" NOT NULL,
    "distance_km" DOUBLE PRECISION NOT NULL,
    "observed_at" TIMESTAMP(3) NOT NULL,
    "wind_speed" DOUBLE PRECISION,
    "wind_direction" SMALLINT,
    "wave_height" DOUBLE PRECISION,
    "sea_temp" DOUBLE PRECISION,
    "air_temp" DOUBLE PRECISION,

    CONSTRAINT "observation_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_scores" (
    "id" BIGSERIAL NOT NULL,
    "spot_id" UUID NOT NULL,
    "sport" VARCHAR(30) NOT NULL,
    "scored_at" TIMESTAMP(3) NOT NULL,
    "score" SMALLINT NOT NULL,
    "grade" "Grade" NOT NULL,
    "simple_message" TEXT,
    "best_time_start" TIMESTAMP(3),
    "best_time_end" TIMESTAMP(3),
    "penalty_applied" BOOLEAN NOT NULL DEFAULT false,
    "alert_override" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "activity_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tides" (
    "id" BIGSERIAL NOT NULL,
    "spot_id" UUID NOT NULL,
    "tide_type" VARCHAR(10) NOT NULL,
    "predicted_at" TIMESTAMP(3) NOT NULL,
    "height_cm" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weather_alerts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "spot_id" UUID NOT NULL,
    "alert_type" VARCHAR(50) NOT NULL,
    "severity" "AlertSeverity" NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "issued_at" TIMESTAMP(3) NOT NULL,
    "lifted_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "weather_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "spot_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alert_settings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "spot_id" UUID NOT NULL,
    "sport" VARCHAR(30) NOT NULL,
    "target_grades" "Grade"[],
    "conditions" JSONB,
    "quiet_start" VARCHAR(5),
    "quiet_end" VARCHAR(5),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alert_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_reports" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "spot_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "image_urls" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "community_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "spot_id" UUID NOT NULL,
    "rating" SMALLINT NOT NULL,
    "content" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_kakao_id_key" ON "users"("kakao_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_apple_id_key" ON "users"("apple_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id");

-- CreateIndex
CREATE INDEX "subscriptions_user_id_idx" ON "subscriptions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "spot_amenities_spot_id_key" ON "spot_amenities"("spot_id");

-- CreateIndex
CREATE INDEX "spot_sources_spot_id_idx" ON "spot_sources"("spot_id");

-- CreateIndex
CREATE UNIQUE INDEX "spot_sources_source_name_source_id_key" ON "spot_sources"("source_name", "source_id");

-- CreateIndex
CREATE INDEX "spot_requests_user_id_idx" ON "spot_requests"("user_id");

-- CreateIndex
CREATE INDEX "spot_requests_status_idx" ON "spot_requests"("status");

-- CreateIndex
CREATE INDEX "weather_snapshots_spot_id_recorded_at_idx" ON "weather_snapshots"("spot_id", "recorded_at");

-- CreateIndex
CREATE INDEX "observation_snapshots_spot_id_observed_at_idx" ON "observation_snapshots"("spot_id", "observed_at");

-- CreateIndex
CREATE INDEX "activity_scores_spot_id_sport_scored_at_idx" ON "activity_scores"("spot_id", "sport", "scored_at");

-- CreateIndex
CREATE INDEX "tides_spot_id_predicted_at_idx" ON "tides"("spot_id", "predicted_at");

-- CreateIndex
CREATE INDEX "weather_alerts_spot_id_is_active_idx" ON "weather_alerts"("spot_id", "is_active");

-- CreateIndex
CREATE INDEX "favorites_user_id_idx" ON "favorites"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_user_id_spot_id_key" ON "favorites"("user_id", "spot_id");

-- CreateIndex
CREATE INDEX "alert_settings_user_id_idx" ON "alert_settings"("user_id");

-- CreateIndex
CREATE INDEX "alert_settings_spot_id_sport_idx" ON "alert_settings"("spot_id", "sport");

-- CreateIndex
CREATE INDEX "community_reports_spot_id_created_at_idx" ON "community_reports"("spot_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "reviews_spot_id_idx" ON "reviews"("spot_id");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_user_id_spot_id_key" ON "reviews"("user_id", "spot_id");

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spot_amenities" ADD CONSTRAINT "spot_amenities_spot_id_fkey" FOREIGN KEY ("spot_id") REFERENCES "spots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spot_sources" ADD CONSTRAINT "spot_sources_spot_id_fkey" FOREIGN KEY ("spot_id") REFERENCES "spots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spot_requests" ADD CONSTRAINT "spot_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weather_snapshots" ADD CONSTRAINT "weather_snapshots_spot_id_fkey" FOREIGN KEY ("spot_id") REFERENCES "spots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "observation_snapshots" ADD CONSTRAINT "observation_snapshots_spot_id_fkey" FOREIGN KEY ("spot_id") REFERENCES "spots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_scores" ADD CONSTRAINT "activity_scores_spot_id_fkey" FOREIGN KEY ("spot_id") REFERENCES "spots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tides" ADD CONSTRAINT "tides_spot_id_fkey" FOREIGN KEY ("spot_id") REFERENCES "spots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weather_alerts" ADD CONSTRAINT "weather_alerts_spot_id_fkey" FOREIGN KEY ("spot_id") REFERENCES "spots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_spot_id_fkey" FOREIGN KEY ("spot_id") REFERENCES "spots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alert_settings" ADD CONSTRAINT "alert_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_reports" ADD CONSTRAINT "community_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_reports" ADD CONSTRAINT "community_reports_spot_id_fkey" FOREIGN KEY ("spot_id") REFERENCES "spots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_spot_id_fkey" FOREIGN KEY ("spot_id") REFERENCES "spots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
