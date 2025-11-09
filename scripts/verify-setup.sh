#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Verifying NextAuth Keycloak Setup..."
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${RED}✗ .env.local file not found${NC}"
    echo "   Please create .env.local with required environment variables"
    exit 1
else
    echo -e "${GREEN}✓ .env.local file exists${NC}"
fi

# Check required environment variables
REQUIRED_VARS=("KEYCLOAK_CLIENT_ID" "KEYCLOAK_CLIENT_SECRET" "KEYCLOAK_ISSUER" "NEXTAUTH_URL" "NEXTAUTH_SECRET")
MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if ! grep -q "^${var}=" .env.local; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo -e "${RED}✗ Missing environment variables:${NC}"
    for var in "${MISSING_VARS[@]}"; do
        echo "   - $var"
    done
    exit 1
else
    echo -e "${GREEN}✓ All required environment variables are set${NC}"
fi

# Check if KEYCLOAK_CLIENT_SECRET is still the placeholder
if grep -q 'KEYCLOAK_CLIENT_SECRET="your-secret"' .env.local; then
    echo -e "${YELLOW}⚠ KEYCLOAK_CLIENT_SECRET is still set to placeholder value${NC}"
    echo "   Please update it with your actual Keycloak client secret"
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}✗ Docker is not running${NC}"
    echo "   Please start Docker and try again"
    exit 1
else
    echo -e "${GREEN}✓ Docker is running${NC}"
fi

# Check if Keycloak container is running
if docker ps | grep -q keycloak; then
    echo -e "${GREEN}✓ Keycloak container is running${NC}"
    
    # Check if Keycloak is responding
    if curl -f -s http://localhost:8080/health/ready > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Keycloak is responding on http://localhost:8080${NC}"
    else
        echo -e "${YELLOW}⚠ Keycloak container is running but not responding yet${NC}"
        echo "   Wait a bit longer or check logs: npm run keycloak:logs"
    fi
else
    echo -e "${YELLOW}⚠ Keycloak container is not running${NC}"
    echo "   Start it with: npm run keycloak:up"
fi

# Check if Keycloak realm is accessible
KEYCLOAK_ISSUER=$(grep "^KEYCLOAK_ISSUER=" .env.local | cut -d '=' -f2 | tr -d '"')
if [ -n "$KEYCLOAK_ISSUER" ]; then
    if curl -f -s "${KEYCLOAK_ISSUER}/.well-known/openid-configuration" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Keycloak realm is accessible at ${KEYCLOAK_ISSUER}${NC}"
    else
        echo -e "${YELLOW}⚠ Keycloak realm not accessible at ${KEYCLOAK_ISSUER}${NC}"
        echo "   Make sure Keycloak is running and the realm is created"
    fi
fi

# Check Node.js and npm
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓ Node.js is installed (${NODE_VERSION})${NC}"
else
    echo -e "${RED}✗ Node.js is not installed${NC}"
    exit 1
fi

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓ npm is installed (${NPM_VERSION})${NC}"
else
    echo -e "${RED}✗ npm is not installed${NC}"
    exit 1
fi

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓ Dependencies are installed${NC}"
else
    echo -e "${YELLOW}⚠ Dependencies are not installed${NC}"
    echo "   Run: npm install"
fi

echo ""
echo -e "${GREEN}✅ Setup verification complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Make sure Keycloak is running: npm run keycloak:up"
echo "2. Configure Keycloak (see keycloak-setup.md)"
echo "3. Update KEYCLOAK_CLIENT_SECRET in .env.local"
echo "4. Start the Next.js app: npm run dev"

