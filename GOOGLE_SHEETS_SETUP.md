# Google Sheets Integration Setup Guide for Royal Academy

Royal Academy's admission system automatically posts every new admission form submission to a Google Sheet with zero duplicate records and automatic retry handling.

---

## Method 1: Google Apps Script Webhook (Recommended - 2 Minutes Setup)

### Step 1: Create a Google Sheet
1. Open [Google Sheets](https://sheets.google.com) and create a new spreadsheet named **"Royal Academy Admissions 2026"**.
2. Set the header row (Row 1) with these exact columns:
   - Column A: `Application ID`
   - Column B: `Student Name`
   - Column C: `Father Name`
   - Column D: `Phone Number`
   - Column E: `Guardian Phone`
   - Column F: `Email`
   - Column G: `Class / Course`
   - Column H: `Gender`
   - Column I: `Date of Birth`
   - Column J: `CNIC / B-Form`
   - Column K: `Previous School`
   - Column L: `Address`
   - Column M: `Additional Notes`
   - Column N: `Submission Time`
   - Column O: `Status`

### Step 2: Create Webhook Script
1. In your Google Sheet, click **Extensions** > **Apps Script**.
2. Replace all existing code with the following snippet:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Deduplication check by Application ID
    var existingData = sheet.getDataRange().getValues();
    for (var i = 1; i < existingData.length; i++) {
      if (existingData[i][0] === data.id) {
        return ContentService.createTextOutput(JSON.stringify({ status: "duplicate", id: data.id }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }

    // Append new row
    sheet.appendRow([
      data.id,
      data.studentName,
      data.fatherName,
      data.phone,
      data.guardianPhone,
      data.email,
      data.class,
      data.gender,
      data.dateOfBirth,
      data.cnicBForm,
      data.previousSchool,
      data.address,
      data.additionalNotes,
      data.submissionTime,
      data.status
    ]);

    return ContentService.createTextOutput(JSON.stringify({ status: "success", id: data.id }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Step 3: Deploy Web App
1. Click **Deploy** > **New deployment**.
2. Click the gear icon next to "Select type" and select **Web app**.
3. Configure settings:
   - **Description**: Royal Academy Admissions Webhook
   - **Execute as**: `Me`
   - **Who has access**: `Anyone` (Crucial for receiving webhook calls)
4. Click **Deploy**, authorize permissions when prompted.
5. Copy the **Web App URL** (starts with `https://script.google.com/macros/s/...`).

### Step 4: Add to Environment Variables
Paste your Web App URL into your `.env` or production deployment environment variables (Vercel / Render / Railway):

```env
GOOGLE_SHEETS_WEBHOOK_URL="https://script.google.com/macros/s/YOUR_DEPLOYED_SCRIPT_ID/exec"
```

---

## Method 2: Google Sheets API Service Account

If using a GCP Service Account:
1. Create a Google Cloud Project & enable **Google Sheets API**.
2. Create a Service Account & generate a JSON Key file.
3. Share your spreadsheet with the Service Account email.
4. Fill in these environment variables:

```env
GOOGLE_CLIENT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
GOOGLE_SHEET_ID="your_spreadsheet_id_from_url"
```
