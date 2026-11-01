# VaultOps — AWS-Based Data Backup and Recovery System

An advanced Cloud Computing academic prototype built with **HTML, CSS and vanilla JavaScript**. It demonstrates the user workflow for creating versioned backup snapshots, browsing backup history and restoring a selected recovery point.

## Features

- Create a backup snapshot from a local file
- Add a descriptive backup label
- Simulated S3 storage tiers: Standard, Standard-IA and Glacier
- Versioned backup catalogue with timestamp and file size
- Restore/download a selected snapshot
- Delete obsolete snapshots
- Search backup history
- Export a JSON backup manifest
- Dashboard statistics for snapshots and stored data
- Responsive interface

## Run locally

No package installation is needed.

1. Extract the ZIP file.
2. Open `index.html` in a modern browser.
3. Choose a file up to 15 MB and create a snapshot.
4. Select **Restore** to download a recovered copy.
5. Use **Export manifest** to download the snapshot catalogue.

For a local static server, run:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Important storage limitation

This version stores file contents in the browser's `localStorage` as a demonstration. Browser storage is limited, may be cleared by the user/browser, and is not a secure or durable backup location. It does not connect to AWS, create S3 buckets, run AWS Backup jobs, or provide disaster recovery guarantees. Keep test files small and do not use confidential or production data.

## AWS production architecture

A real implementation could use the following services:

1. **Amazon S3** — store backup objects in a private bucket.
2. **S3 Versioning** — preserve multiple object versions and protect against accidental overwrite.
3. **AWS Backup** — define backup plans, schedules, retention periods and recovery points for supported AWS resources.
4. **Amazon EventBridge** — trigger scheduled or event-driven backup workflows.
5. **AWS Lambda** — run validation, metadata processing and recovery automation.
6. **AWS KMS** — encrypt backup data with managed keys.
7. **AWS CloudTrail** — record account/API activity for auditing.
8. **Amazon CloudWatch** — monitor backup job outcomes and alert on failures.
9. **IAM** — grant least-privilege access to backup and restore operations.

### Suggested real deployment flow

```text
Application / Database
        |
        v
Scheduled rule (EventBridge)
        |
        v
Backup workflow (AWS Backup / Lambda)
        |
        v
Private S3 bucket + Versioning + KMS encryption
        |
        v
Retention / Lifecycle policy
        |
        v
Recovery point selection
        |
        v
Restore to target + validation
        |
        v
CloudWatch monitoring + CloudTrail audit
```

## Security and production checklist

- Enable S3 Block Public Access.
- Apply least-privilege IAM roles and policies.
- Enable encryption at rest and TLS in transit.
- Configure retention and lifecycle policies carefully.
- Consider S3 Object Lock for immutable backup requirements.
- Keep backups in a separate account or region when required by the recovery plan.
- Test restores regularly; a successful backup does not prove recoverability.
- Define RPO (Recovery Point Objective) and RTO (Recovery Time Objective).
- Monitor failed jobs and alert the responsible team.
- Never commit AWS access keys or secrets to GitHub.

## GitHub upload

1. Extract this ZIP.
2. Create a repository named `aws-backup-recovery-system`.
3. Upload `index.html`, `style.css`, `app.js` and `README.md`.
4. Enable GitHub Pages from **Settings → Pages** if you want to publish the static demo.

## Academic project summary

**Title:** AWS-Based Data Backup and Recovery System

**Objective:** Demonstrate backup version management, recovery-point selection, restore workflows and the architecture of a resilient cloud backup solution.

**Modules:** Backup creation, snapshot catalogue, storage-tier selection, recovery, manifest export and monitoring dashboard.

**Future scope:** Integrate real AWS services using a secure backend, AWS SDK, IAM roles, S3, AWS Backup, Lambda, EventBridge, KMS and CloudWatch.
