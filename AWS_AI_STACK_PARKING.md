# White Swan AI stack (AWS) — dependency map & “park” notes

This file lives at the repo root so it stays tracked while the `White Swan AI/` directory is gitignored (see `.gitignore`). Use it when pausing or restoring ECS / Aurora / ALB without hunting through local-only folders.

**Account / region (from live AWS checks):** `us-east-1` · REST API `n7kcm45my8` · ALB DNS `white-swan-alb-2129047376.us-east-1.elb.amazonaws.com`

---

## Quick answers (what to keep vs what you can drop)

| Piece | Role | Keep working? |
|-------|------|----------------|
| **Image trim** (API Gateway **HTTP API** v2 + Lambda from `image-trim-api/` / `scripts/aws-setup-image-trim-api.sh`) | Cropping pipeline; **not** `n7kcm45my8`, **not** ALB | **Yes — independent** of ECS/ALB/Aurora stack discussed here. |
| **`api-proxy`** Lambda (`white-swan-api-proxy`, `api-proxy/index.js`) | **BackNine** API key injection for Bubble → carrier/upstream URLs; reads **Secrets Manager** `white-swan-proxy/backnine-api-keys` | **Yes — not AI.** Safe to keep; does **not** use ECS, ALB, or Aurora. |
| **LangGraph, LLM proxy, `/v1/chat/completions`** | AI / shelved work | OK to break while shelved. |
| **Aurora + `aurora-handler`** (`/api/aurora/*`, **`GET /health`** on `n7kcm45my8`) | Postgres + Lambda CRUD for threads/messages/chunks, etc.; **`/health` hits this Lambda**, not the ALB | **Not “AI-only” by name**, but if nothing in Bubble/production calls these routes, you can treat parking/removal like other unused backend. **Confirm** before delete. |
| **ALB + ECS Fargate** | Front door for LangGraph HTTP routes and anything that HTTP-proxies to the ALB | OK to remove **after** you accept LangGraph/LLM breakage and **re-point or remove** API Gateway integrations that still reference the ALB. |
| **VPC** | Private network where ALB, ECS tasks, RDS, subnets, and IPs live | You rarely “delete the VPC” as a cost move; you **delete or stop specific resources** (ALB, ECS service, NAT, unused EIPs). |

**Cloudflare worker samples** under `White Swan AI/cloudflare-worker*.js` (gitignored) may call the ALB directly—those are **not** production unless you deployed them.

---

## Why does CloudWatch show lots of ALB requests if nothing is in production?

**Application Load Balancers send health checks to each registered target** on a fixed interval (often **~30 seconds** per target group). Each check is an HTTP request and counts toward **`RequestCount`**.

Rough order of magnitude: one healthy target ≈ **2,880 checks/day** (86,400 ÷ 30). You had **multiple targets** registered (including **unhealthy** ones that keep retrying). **API Gateway** hitting **`/api/langgraph/*`** (HTTP proxy to ALB) also counts. So **hundreds–thousands per day without “real users”** is normal for an always-on ECS + ALB setup.

To separate health checks from user traffic, enable **ALB access logs** to S3 or use **target group metrics** + **API Gateway execution logging**—not required for cost cutting, but useful if you want proof.

---

## What breaks if you remove or stop X?

### Stop ECS Fargate (scale services to `desiredCount: 0`)

| Still works | Breaks |
|-------------|--------|
| API Gateway routes that invoke **Lambda only** (see below) | **`POST /api/langgraph/chat`** and **`GET /api/langgraph/stream`** — **HTTP_PROXY** to the ALB (`/chat`, `/stream`). |
| **`/llm/{proxy+}`** → Lambda `white-swan-llm-proxy` (forwards to **ALB** in code) | Same if ALB has no healthy targets. |
| **`/v1/chat/completions`** → `white-swan-api-gateway-proxy` (forwards to ALB) | Same. |
| **`api-proxy`** Lambda (`white-swan-api-proxy`) — Secrets Manager only | Direct **ALB DNS** access (e.g. Cloudflare worker experiments). |
| **Image trim** — separate **HTTP API (API Gateway v2)** | **Postman / docs** that call the ALB for `/health`, `/chat`, `/docs` directly. |

**HubSpot CRM app** (`hubspot-white-swan-app/` at repo root): OAuth redirect targets **Bubble** (`app.whiteswan.io`), not this ALB. Parking ECS/ALB does **not** by itself break HubSpot UI extensions unless something in production still calls API Gateway LangGraph or LLM routes.

### Delete or stop Aurora (`white-swan-aurora-serverless`)

| Still works | Breaks |
|-------------|--------|
| S3 handler Lambda routes (`/api/s3`) | **`aurora-handler`** Lambda: all **`/api/aurora/*`** routes. |
| Audio transcribe, many non-DB Lambdas | **`GET /health`** on API `n7kcm45my8` — integrated to **`aurora-handler`**, not the ALB. |
| **Image trim**, **`api-proxy`** | **LangGraph on ECS** (RAG / DB in task env: `AURORA_*`). |

**Conclusion:** Aurora is shared between **serverless “Aurora API”** and **LangGraph**. Do not delete without confirming no Bubble/workflows use `/prod/api/aurora/...`.

### Delete the ALB

- You pay **hourly** even with **zero traffic**; scaling ECS to 0 does **not** remove ALB cost.
- Removing the ALB breaks **HTTP_PROXY** LangGraph routes and any Lambda/integration that forwards to `white-swan-alb-...` until you point integrations elsewhere or recreate the ALB.

### VPC / public IPv4

- **VPC** itself has no meaningful “VPC subscription” fee; bill lines come from **resources in** the VPC (ALB, NAT Gateway, **public IPv4** attached to ENIs, etc.).
- Map ENIs/EIPs before releasing IPs or deleting NAT.

---

## CloudWatch signal (ALB `RequestCount`)

**CLI (read-only):**

```bash
aws cloudwatch get-metric-statistics \
  --namespace AWS/ApplicationELB \
  --metric-name RequestCount \
  --dimensions Name=LoadBalancer,Value=app/white-swan-alb/8aeac3f25551caa8 \
  --start-time "$(date -u -v-14d +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date -u -d '14 days ago' +%Y-%m-%dT%H:%M:%SZ)" \
  --end-time "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  --period 86400 \
  --statistics Sum \
  --region us-east-1
```

---

## Park compute (restore later) — commands (execute only after you accept blast radius)

**ECS: set desired count to 0** (keeps services, task definitions, cluster; stops Fargate billing for tasks):

```bash
CLUSTER=white-swan-cluster
REGION=us-east-1
for SVC in portkey-gateway-service white-swan-langgraph-orchestration; do
  aws ecs update-service --cluster "$CLUSTER" --service "$SVC" --desired-count 0 --region "$REGION"
done
```

**Restore:**

```bash
for SVC in portkey-gateway-service white-swan-langgraph-orchestration; do
  aws ecs update-service --cluster "$CLUSTER" --service "$SVC" --desired-count 1 --region "$REGION"
done
```

**Aurora Serverless v2:** min is already **0.5 ACU** on cluster `white-swan-aurora-serverless`. “Scale to zero” depends on engine/feature support—check RDS console. **Snapshot** before delete.

---

## HubSpot app location

The HubSpot project now lives at **`hubspot-white-swan-app/`** (repo root). It is **not** under `White Swan AI/`. Deploy via HubSpot CLI from `hubspot-white-swan-app/White Swan Integration/` — see `hubspot-white-swan-app/README.md`. This repository does not include a separate GitHub Actions workflow for HubSpot deploys.

---

## References in repo / API Gateway (for automation)

- LangGraph ↔ ALB: `White Swan AI/White_Swan_Infrastructure_Overview.md` (local copy, gitignored).
- Task definition env (Aurora ARNs): `White Swan AI/langgraph-orchestration/ecs-task-definition.json` (gitignored).
