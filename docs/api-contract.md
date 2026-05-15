# API contract

Base URL: `https://seallogistics.com/api` (production) · `http://localhost:3000/api` (dev).

All endpoints accept and return `application/json; charset=utf-8`. Errors follow:

```json
{ "ok": false, "error": "Human-readable message" }
```

---

## `POST /api/quote`

Submits a booking/quote request. Validates input, rate-limits by IP, persists the
lead, returns a tracking ID + signed portal URL.

### Request body

| Field             | Type           | Required | Notes                                  |
| ----------------- | -------------- | -------- | -------------------------------------- |
| `name`            | string         | yes      | 2–120 chars                            |
| `email`           | string (email) | yes      |                                        |
| `phone`           | string         | yes      | digits/spaces/`+()-.` only, 7–32 chars |
| `from`            | enum (ISO-2)   | yes      | `US,NG,LR,GH,TG,ZA,GN,GM`              |
| `to`              | enum (ISO-2)   | yes      | must differ from `from`                |
| `weight`          | number         | no       | ≥ 0, ≤ 10,000                          |
| `description`     | string         | no       | ≤ 2,000 chars                          |
| `company_website` | string         | no       | **Honeypot** — must be empty           |
| `consent`         | true           | yes      | privacy/contact consent                |

### Responses

`200 OK`

```json
{
  "ok": true,
  "trackingId": "SEAL-26200B7C-K3",
  "portalUrl": "https://seallogistics.com/portal/<signed-token>"
}
```

`400 Bad Request` — validation, honeypot, JSON parse
`429 Too Many Requests` — `Retry-After` header set (seconds)
`500 Internal Server Error` — persistence failure

### Rate limit

5 requests / 10 min / IP (sliding window). Backed by Upstash; falls back to
in-memory for tests/dev.

---

## `GET /api/track/:id`

Public read of a shipment by tracking ID.

### Path params

- `id` — must match `SEAL-YYWWXXXX-CC` and pass HMAC checksum.

### Responses

`200 OK`

```json
{
  "ok": true,
  "shipment": {
    "tracking_id": "SEAL-26200B7C-K3",
    "status": "in_transit",
    "lane_from": "US",
    "lane_to": "NG",
    "weight": { "value": 22, "unit": "lb" },
    "eta": "2026-05-19T00:00:00.000Z",
    "events": [{ "at": "...", "label": "Package received", "location": "Brooklyn Center, MN" }]
  }
}
```

`400 Bad Request` — malformed ID or bad checksum (does NOT hit DB)
`404 Not Found` — ID not in DB

---

## `GET /portal/:token`

Magic-link entry point. Verifies the HMAC-signed token (30-day expiry) and
302-redirects to `/portal/shipment/:trackingId`. Tampered or expired tokens
return 404.

## `GET /portal/lookup?id=<tracking-id>`

Validates format and redirects to the canonical shipment page, or back to
`/portal?error=invalid`. Reachable from a `<form method="get">` on the portal
landing page.
