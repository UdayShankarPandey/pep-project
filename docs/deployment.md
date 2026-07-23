# Link Click — Deployment Architecture

## Azure Environment

The production portfolio deployment of Link Click uses Microsoft Azure.

### App Service

- Service: Azure App Service
- Application: link-click-api
- Operating System: Linux
- Deployment Model: Container
- Region: Southeast Asia
- App Service Plan: asp-link-click-prod
- Pricing Tier: Free F1

Southeast Asia is used because the Azure for Students subscription restricts
resource deployment to selected regions.

## Current Architecture

GitHub
  ↓
GitHub Actions
  ↓
Docker Image
  ↓
Container Registry
  ↓
Azure App Service
  ↓
Node.js / Express API
  ↓
MongoDB Atlas

## Deployment Status

Azure App Service infrastructure has been provisioned.

Container publishing and automated deployment are configured separately through
the CI/CD pipeline.

## Cost Strategy

The deployment initially uses the Free F1 App Service tier to minimize Azure
Student credit consumption.

The App Service Plan can be scaled to a paid tier if application performance
requires additional compute resources.

## Observability

The application exposes:

- `/health` — application health
- `/health/ready` — dependency readiness

Azure health checks and Application Insights integration are configured
separately as part of the observability setup.
