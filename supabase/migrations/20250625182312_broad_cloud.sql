/*
  # Create briefs table for storing user summaries

  1. New Tables
    - `briefs`
      - `id` (uuid, primary key)
      - `user_id` (text, references Clerk user ID)
      - `input_url` (text, nullable - original URL if applicable)
      - `input_type` (text, enum: url, youtube, upload)
      - `summary_mode` (text, enum: business, student, genZ)
      - `summary_text` (text, the generated summary)
      - `word_count` (integer, word count of summary)
      - `processing_time` (integer, time taken to generate in ms)
      - `created_at` (timestamptz, when summary was created)

  2. Security
    - Enable RLS on `briefs` table
    - Add policy for users to read/write their own briefs
*/

CREATE TABLE IF NOT EXISTS briefs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  input_url text,
  input_type text NOT NULL CHECK (input_type IN ('url', 'youtube', 'upload')),
  summary_mode text NOT NULL CHECK (summary_mode IN ('business', 'student', 'genZ')),
  summary_text text NOT NULL,
  word_count integer NOT NULL DEFAULT 0,
  processing_time integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE briefs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own briefs"
  ON briefs
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert own briefs"
  ON briefs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can update own briefs"
  ON briefs
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can delete own briefs"
  ON briefs
  FOR DELETE
  TO authenticated
  USING (auth.jwt() ->> 'sub' = user_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS briefs_user_id_created_at_idx ON briefs(user_id, created_at DESC);