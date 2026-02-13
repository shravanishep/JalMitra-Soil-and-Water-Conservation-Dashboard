# Data Schema Guide

This folder contains the canonical CSV data model used by the backend.
The backend currently reads:
- `projects.csv`
- `beneficiaries.csv`
- `progress.csv`

The schema below is the source of truth for column names and types.
Keep column names stable to avoid breaking API behavior.

## General conventions

- Encoding: UTF-8
- Delimiter: comma (`,`)
- Header row: required
- IDs: string, stable, unique per file
- Missing values: empty string for optional string/date fields
- Dates: ISO-8601 format (`YYYY-MM-DD`) when used
- Numeric fields: no commas, plain numeric values

## projects.csv

Purpose: Master list of conservation projects and their location/activity metadata.

Required columns:
- `project_id` (string): unique project key, e.g. `P001`
- `project_name` (string): human-readable project title
- `district` (string): district name
- `village` (string): village name
- `activity_type` (string): project category (check dam, farm pond, etc.)
- `start_year` (int): year project started
- `status` (string): current state, e.g. `Active`, `Completed`

Optional columns (future-safe, not required by current backend):
- `start_date` (date): exact start date if available
- `end_date` (date): completion date for closed projects

## beneficiaries.csv

Purpose: Beneficiary registry linked to projects.

Required columns:
- `beneficiary_id` (string): unique beneficiary key, e.g. `B001`
- `beneficiary_name` (string): beneficiary full name
- `gender` (string): gender label
- `district` (string): district name
- `village` (string): village name
- `linked_project_id` (string): foreign key to `projects.project_id`

Optional columns (future-safe, not required by current backend):
- `enrollment_date` (date): date beneficiary was enrolled
- `category` (string): household/farmer/community grouping

## progress.csv

Purpose: Time-series project progress and impact metrics.

Required columns:
- `progress_id` (string): unique progress row key, e.g. `PR001`
- `project_id` (string): foreign key to `projects.project_id`
- `year` (int): reporting year for this entry
- `water_conserved_lakh_liters` (float): water conserved in lakh liters
- `area_covered_hectares` (float): area impacted in hectares
- `remarks` (string): context notes for reporting row

Optional columns (future-safe, not required by current backend):
- `report_date` (date): exact reporting date
- `season` (string): seasonal slice, e.g. `Kharif`, `Rabi`

## Scalability and analytics readiness

- Multi-year support: use one row per `project_id` + `year` in `progress.csv`.
- Large row counts: keep IDs stable and unique; avoid changing existing IDs.
- Year-wise analytics: filter/group by `progress.year`.
- Village-wise analytics: group by `projects.village` and `beneficiaries.village`.
- Project-wise analytics: join `progress.project_id` to `projects.project_id`.

## Compatibility note

Current backend API behavior depends on these existing columns:
- `projects.csv` row count
- `beneficiaries.csv` row count
- `progress.csv.water_conserved_lakh_liters` sum

Do not rename these existing required columns unless backend code is updated in the same change.
