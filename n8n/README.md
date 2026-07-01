# n8n Setup Guide for ATSGO

## Workflow Files

| File | Purpose |
|---|---|
| `workflow-1a-gmail-resume.json` | Watches Gmail → parses PDF → creates candidate |
| `workflow-1b-manual-upload.json` | Receives PDF from ATSGO upload → parses → creates candidate |
| `workflow-2-shortlist-email.json` | Sends shortlist email when candidate is shortlisted |
| `workflow-3-interview-scheduling.json` | Creates Google Meet + sends interview email |

---

## Step 1 — Import Workflows

1. Open your n8n instance
2. Go to **Workflows → Add Workflow → Import from file**
3. Import each `.json` file from this folder
4. Repeat for all 4 files

---

## Step 2 — Set Up Credentials

You need 3 credentials in n8n (**Settings → Credentials → Add Credential**):

### Gmail (OAuth2)
- Type: **Gmail OAuth2**
- Used by: workflows 1a, 2, 3
- Scopes needed: `gmail.send`, `gmail.readonly` (for trigger)
- After creating, note the credential ID and update the workflows

### Google Calendar (OAuth2)
- Type: **Google Calendar OAuth2**
- Used by: workflow 3
- Scopes needed: `calendar.events`

### OpenAI (API Key)
- Workflows 1a and 1b call OpenAI via HTTP Request directly
- Open each workflow → find the **"Parse Resume with GPT-4o-mini"** node
- Replace `REPLACE_WITH_YOUR_OPENAI_API_KEY` with your actual key

---

## Step 3 — Update ATSGO Base URL

In workflows 1a, 1b, and 3, the HTTP Request nodes point to:
```
http://localhost:3000
```

If ATSGO is running on a different host/port, update all HTTP Request nodes that call the ATSGO API.

---

## Step 4 — Get Webhook URLs and Configure ATSGO

After importing, activate each workflow. Then:

1. Click the **Webhook** trigger node in each workflow
2. Copy the **Production URL**
3. Open ATSGO at [http://localhost:3000/dashboard/settings](http://localhost:3000/dashboard/settings)

| n8n Webhook | ATSGO Setting |
|---|---|
| `workflow-1b` webhook URL | **Resume Upload Webhook URL** |
| `workflow-2` webhook URL | **Outbound Events Webhook URL** |
| `workflow-3` webhook URL | **Outbound Events Webhook URL** |

> **Note:** Workflows 2 and 3 both receive events from ATSGO's single outbound webhook. ATSGO sends all status-change events to the same URL with an `event` field. You can use a single n8n workflow with an IF node to route, or use separate webhook URLs. If using separate URLs, you'll need to adjust the ATSGO `lib/webhooks.ts` to send to different URLs per event type.

Alternatively, add both URLs to `.env.local`:
```bash
N8N_RESUME_WEBHOOK_URL=https://your-n8n.com/webhook/atsgo-resume-upload
N8N_OUTBOUND_WEBHOOK_URL=https://your-n8n.com/webhook/atsgo-candidate-shortlisted
```

---

## Step 5 — Activate Workflows

Toggle each workflow to **Active** in n8n.

---

## Webhook Payload Reference

### What ATSGO sends on shortlist:
```json
{
  "event": "candidate.shortlisted",
  "payload": {
    "id": "uuid",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "status": "shortlisted",
    "skills": ["React", "TypeScript"],
    "appliedAt": "2026-07-01T..."
  },
  "timestamp": "2026-07-01T..."
}
```

### What ATSGO sends on interview scheduled:
```json
{
  "event": "candidate.interview_scheduled",
  "payload": {
    "id": "uuid",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "status": "interview_scheduled",
    "interviewAt": "2026-07-10T10:00:00.000Z"
  },
  "timestamp": "2026-07-01T..."
}
```

### What n8n sends to ATSGO (manual upload):
```
POST /api/candidates
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "skills": ["React", "TypeScript"],
  "summary": "Experienced frontend engineer with 5 years...",
  "resumeFileName": "jane_doe_cv.pdf",
  "source": "manual",
  "status": "applied"
}
```
