# 🚀 Quick Start Guide

## Current Status

✅ **Keycloak is running** in Docker  
⚠️ **Realm "next" needs to be created**  
⚠️ **Client secret needs to be configured**

## Step-by-Step Setup

### 1. Wait for Keycloak to be Ready

Keycloak takes 30-60 seconds to fully start. Check if it's ready:

```bash
npm run keycloak:logs
```

Look for: `Keycloak 25.0.0 started` or `Listening on: http://0.0.0.0:8080`

### 2. Access Keycloak Admin Console

1. Open your browser: **http://localhost:8080**
2. Click **Administration Console**
3. Login with:
   - **Username:** `admin`
   - **Password:** `admin`

### 3. Create the Realm

1. In the top-left, hover over **"Master"** realm
2. Click **"Create Realm"**
3. Enter realm name: **`next`**
4. Click **"Create"**

### 4. Create the Client

1. In the left sidebar, click **"Clients"**
2. Click **"Create client"**
3. **General Settings:**
   - Client type: `OpenID Connect`
   - Client ID: `next`
   - Click **"Next"**

4. **Capability config:**
   - Client authentication: **`On`** (confidential client)
   - Authorization: `Off`
   - Click **"Next"**

5. **Login settings:**
   - Valid redirect URIs: `http://localhost:3000/api/auth/callback/keycloak`
   - Web origins: `http://localhost:3000`
   - Click **"Save"**

### 5. Get the Client Secret

1. In the client details, go to the **"Credentials"** tab
2. Copy the **"Client secret"** value
3. Open `.env.local` in your project
4. Replace `KEYCLOAK_CLIENT_SECRET="your-secret"` with:
   ```env
   KEYCLOAK_CLIENT_SECRET="your-copied-secret-here"
   ```

### 6. Test the Connection

```bash
npm run test:keycloak
```

You should see:
- ✅ Keycloak is healthy and running
- ✅ Keycloak is accessible
- ✅ OpenID Connect configuration is accessible
- ✅ Environment variables are set

### 7. Start Your Next.js App

```bash
npm run dev
```

### 8. Test Authentication

1. Open **http://localhost:3000**
2. Click **"Login with Keycloak"**
3. You should be redirected to Keycloak login
4. Login with a user (create one in Keycloak if needed)
5. You'll be redirected back to your app, logged in!

## Troubleshooting

### Keycloak not accessible
```bash
# Check if container is running
docker ps | grep keycloak

# Check logs
npm run keycloak:logs

# Restart if needed
npm run keycloak:restart
```

### Realm not found (404)
- Make sure you created the realm named exactly **"next"**
- Check the realm name matches `KEYCLOAK_ISSUER` in `.env.local`

### Client secret error
- Make sure you copied the secret from the **Credentials** tab
- Verify it's updated in `.env.local`
- Restart Next.js after updating `.env.local`

### Connection test fails
- Wait for Keycloak to fully start (check logs)
- Verify realm exists
- Check `.env.local` has correct values

## Need Help?

- See **keycloak-setup.md** for detailed instructions
- See **SETUP-COMPLETE.md** for full documentation
- Check **README.md** for general information

