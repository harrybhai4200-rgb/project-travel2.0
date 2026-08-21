/*
# Create scam_reports table for Scam Shield feature

1. New Tables
- `scam_reports` — stores reports submitted by tourists when they detect
  overcharging by auto-rickshaws, taxis, local guides, or souvenir shops.
  - `id` (uuid, primary key)
  - `service_type` (text) — e.g. "auto-rickshaw", "taxi", "guide", "shop"
  - `location` (text) — city/area where the incident occurred
  - `route` (text) — from → to route description, or product name
  - `standard_fare` (numeric) — verified baseline rate
  - `asked_fare` (numeric) — amount demanded by the driver/guide/seller
  - `difference_percent` (numeric) — percentage overcharge
  - `conversation_transcript` (text) — optional speech-to-text transcript
  - `reporter_note` (text) — optional free-text note from the tourist
  - `created_at` (timestamptz, defaults to now)

2. Security
- Enable RLS on `scam_reports`.
- Allow anon + authenticated to INSERT (tourists report without signing in).
- Allow anon + authenticated to SELECT (so the community can see aggregate
  warning areas — data is intentionally public/shared).
- No UPDATE or DELETE — reports are immutable once submitted.

3. Important Notes
- This is a single-tenant, no-auth app. Reports are submitted anonymously
  by tourists. No user_id column or auth.uid() checks are needed.
- The table is safe to re-run (IF NOT EXISTS, DROP POLICY IF EXISTS).
*/

CREATE TABLE IF NOT EXISTS scam_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type text NOT NULL,
  location text NOT NULL,
  route text,
  standard_fare numeric DEFAULT 0,
  asked_fare numeric DEFAULT 0,
  difference_percent numeric DEFAULT 0,
  conversation_transcript text,
  reporter_note text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE scam_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_scam_reports" ON scam_reports;
CREATE POLICY "anon_select_scam_reports"
ON scam_reports FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_scam_reports" ON scam_reports;
CREATE POLICY "anon_insert_scam_reports"
ON scam_reports FOR INSERT
TO anon, authenticated WITH CHECK (true);
