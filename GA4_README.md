# GA4 Tracking & Log Retrieval for Expert Cafetière

This document describes how to inspect and export the GA4 event data we added for the mobile CTA A/B test.

## 1. Event name

All clicks on the affiliate sticky CTA are sent as a custom event called:

```
affiliate_cta_click
```

It includes the following parameters:

- `cta_variant` (_string_) — either `buy_now` or `view_price` (50/50 split)
- `cta_text` (_string_) — the final text shown on the button
- `link` (_string_) — target URL (including UTM parameters)

## 2. Viewing in GA4 UI

1. Sign in to Google Analytics and open the property for `expert-cafetiere.eu`.
2. Navigate to **Configure > Events** and verify that `affiliate_cta_click` appears in the list.
3. To inspect the data: go to **Reports > Engagement > Events**.
   - Use the date selector to restrict to the experiment period (e.g. 27 Feb 2026 onwards).
   - Add a secondary dimension: `Event parameter` → select `cta_variant`.
   - Optionally create a custom exploration (Explorations > Free form) with `Event name` filter `affiliate_cta_click` and rows grouped by `cta_variant`.

## 3. BigQuery export (if enabled)

If the GA4 property exports raw data to BigQuery, use the following SQL to fetch detailed rows:

```sql
SELECT
  event_date,
  event_timestamp,
  event_name,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key='cta_variant') AS cta_variant,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key='cta_text') AS cta_text,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key='link') AS link,
  user_pseudo_id,
  traffic_source.source,
  traffic_source.medium,
  traffic_source.name
FROM
  `YOUR_PROJECT_ID.analytics_<PROPERTY_ID>_events_*`
WHERE
  event_name = 'affiliate_cta_click'
  AND _TABLE_SUFFIX BETWEEN '20260227' AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
ORDER BY
  event_timestamp DESC
LIMIT 1000;
```

Replace `YOUR_PROJECT_ID` and `<PROPERTY_ID>` with your own.

## 4. Custom report template JSON

You can also create a reusable Exploration report by importing the following JSON:

```json
{
  "name": "Affiliate CTA clicks",
  "type": "FREE_FORM",
  "tabs": [
    {
      "name": "Variants",
      "explorationType": "FREE_FORM",
      "segments": [],
      "dimensions": [
        {"name": "eventName"},
        {"name": "eventParam:cta_variant"},
        {"name": "eventParam:cta_text"}
      ],
      "metrics": [
        {"name": "eventCount"}
      ],
      "filters": [
        {"dimensionName": "eventName", "operator": "EXACT", "expressions": ["affiliate_cta_click"]}
      ],
      "rows": ["eventParam:cta_variant"],
      "columns": [],
      "values": ["eventCount"]
    }
  ]
}
```

Import via **Explore > + > Import from Gallery** and paste JSON.

---

Once tracking is live, review at least daily during the test window and share results after two weeks. Adjust CTA text or roll out winner permanently based on statistical significance.