# Keycloak Setup Guide

This guide will help you set up Keycloak locally using Docker and configure it to work with this Next.js application.

## Prerequisites

- Docker and Docker Compose installed
- Access to http://localhost:8080

## Step 1: Start Keycloak

Start Keycloak using Docker Compose:

```bash
docker-compose up -d
```

Wait for Keycloak to be ready (usually takes 30-60 seconds). You can check the logs:

```bash
docker-compose logs -f keycloak
```

Look for: `Keycloak 25.0.0 started`

## Step 2: Access Keycloak Admin Console

1. Open your browser and go to: http://localhost:8080
2. Click on **Administration Console**
3. Login with:
   - Username: `admin`
   - Password: `admin`

## Step 3: Create a Realm

1. In the top-left corner, hover over "Master" realm
2. Click **Create Realm**
3. Enter realm name: `next`
4. Click **Create**

## Step 4: Create a Client

1. In the left sidebar, go to **Clients**
2. Click **Create client**
3. **General Settings:**
   - Client type: `OpenID Connect`
   - Client ID: `next`
   - Click **Next**

4. **Capability config:**
   - Client authentication: `On` (confidential client)
   - Authorization: `Off` (unless you need it)
   - Click **Next**

5. **Login settings:**
   - Valid redirect URIs: `http://localhost:3000/api/auth/callback/keycloak`
   - Web origins: `http://localhost:3000`
   - Click **Save**

## Step 5: Get Client Secret

1. Go to the **Credentials** tab of your client
2. Copy the **Client secret** value
3. Update your `.env.local` file with this secret:

```env
KEYCLOAK_CLIENT_SECRET="your-copied-secret-here"
```

## Step 6: Create a Test User (Optional)

1. Go to **Users** in the left sidebar
2. Click **Create new user**
3. Fill in:
   - Username: `testuser`
   - Email: `test@example.com`
   - First name: `Test`
   - Last name: `User`
   - Email verified: `On`
4. Click **Create**
5. Go to the **Credentials** tab
6. Set a password:
   - Password: `test123`
   - Temporary: `Off`
7. Click **Set password**

## Step 7: Verify Configuration

Your `.env.local` should now have:

```env
KEYCLOAK_CLIENT_ID="next"
KEYCLOAK_CLIENT_SECRET="your-actual-secret-from-step-5"
KEYCLOAK_ISSUER="http://localhost:8080/realms/next"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="ROk7uu1sRydy2wCMbpLZCa1WPxOv99GSeoNVN6MUJS4="
```

## Step 8: Restart Your Next.js App

After updating `.env.local`, restart your Next.js development server:

```bash
npm run dev
```

## Troubleshooting

### Keycloak won't start
- Check if port 8080 is already in use: `lsof -i :8080`
- Check Docker logs: `docker-compose logs keycloak`

### Can't access Keycloak
- Wait a bit longer for Keycloak to fully start
- Check: `docker-compose ps` to see if container is running

### Authentication fails
- Verify the redirect URI matches exactly: `http://localhost:3000/api/auth/callback/keycloak`
- Check that the client secret in `.env.local` matches Keycloak
- Verify the realm name is `next` (or update `KEYCLOAK_ISSUER`)

### Reset Keycloak
If you need to start fresh:

```bash
docker-compose down -v
docker-compose up -d
```

This will delete all Keycloak data and start fresh.

## Useful Commands

```bash
# Start Keycloak
docker-compose up -d

# Stop Keycloak
docker-compose down

# View logs
docker-compose logs -f keycloak

# Restart Keycloak
docker-compose restart keycloak

# Remove everything (including data)
docker-compose down -v
```

