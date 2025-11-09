# Token Extraction & Role Mapping Test Coverage

## Overview

Comprehensive unit tests ensure that all token information, including roles and permissions, are extracted correctly without missing any data.

## Test Files

### 1. `tokenDecode.test.ts`
Tests JWT token decoding functionality:
- ✅ Valid token decoding
- ✅ Base64URL padding handling
- ✅ Invalid token format handling
- ✅ Malformed JSON handling

### 2. `tokenExtraction.test.ts`
Tests permission and resource role extraction:
- ✅ Extracts all permissions from `realm_access.roles`
- ✅ Extracts all permissions from all `resource_access.{resource}.roles`
- ✅ Handles missing `realm_access` gracefully
- ✅ Handles missing `resource_access` gracefully
- ✅ Groups roles by resource correctly
- ✅ Handles edge cases (empty arrays, missing properties)

**Real-world token structure tested:**
- Realm roles: `offline_access`, `default-roles-next`, `uma_authorization`
- Resource roles from `next`, `realm-management`, `broker`, `account`
- All 32+ roles from actual Keycloak token structure

### 3. `roleMapping.test.ts`
Tests role mapping configuration:
- ✅ Maps `realm-admin` → `admin`
- ✅ Maps `realm-manager` → `manager`
- ✅ Maps `realm-employee` → `employee`
- ✅ Case-insensitive matching
- ✅ Common variations (admin, admins, administrator, etc.)
- ✅ Pattern-based matching (regex patterns)
- ✅ Unmapped role detection
- ✅ Deduplication of mapped roles

**Real-world token roles tested:**
- Verifies `realm-admin` from token maps to `admin`
- Verifies all unmapped roles are correctly identified
- Ensures no roles are missed during mapping

### 4. `roleExtraction.test.ts`
Tests complete role extraction and normalization pipeline:
- ✅ Extracts roles from ID token
- ✅ Extracts roles from profile
- ✅ Merges roles from token and profile
- ✅ Handles tokens without roles
- ✅ Handles missing `realm_access` or `resource_access`
- ✅ Handles groups extraction
- ✅ Edge cases (undefined, invalid tokens, empty profiles)

**Real-world token structure tested:**
- Complete token with all role sources (realm, resources, groups)
- Verifies `realm-admin` is extracted and normalized to `admin`
- Ensures all 32+ roles from actual token are processed

## Test Coverage Summary

### ✅ Token Decoding
- Valid JWT decoding
- Base64URL handling
- Error handling

### ✅ Permission Extraction
- All realm roles extracted
- All resource roles extracted from all resources
- No roles missed
- Edge cases handled

### ✅ Role Mapping
- Explicit mappings work correctly
- Pattern-based mappings work correctly
- Case-insensitive matching
- Unmapped role detection

### ✅ Role Normalization
- Complete extraction pipeline
- Token + profile merging
- Deduplication
- Edge cases

## Key Test Scenarios

### Real-World Token Structure
All tests use the actual token structure from `token.md`:
```json
{
  "realm_access": {
    "roles": ["offline_access", "default-roles-next", "uma_authorization"]
  },
  "resource_access": {
    "realm-management": {
      "roles": ["realm-admin", "view-realm", ...]
    },
    "next": { "roles": ["uma_protection"] },
    "broker": { "roles": ["read-token"] },
    "account": { "roles": ["manage-account", ...] }
  }
}
```

### Expected Results
- ✅ `realm-admin` → normalized to `admin`
- ✅ All 32+ roles extracted correctly
- ✅ All permissions extracted correctly
- ✅ Resource roles grouped by resource correctly
- ✅ No roles missed

## Running Tests

```bash
# Run all token-related tests
npm test -- src/tests/tokenDecode.test.ts src/tests/tokenExtraction.test.ts src/tests/roleMapping.test.ts src/tests/roleExtraction.test.ts

# Run all tests
npm test
```

## Test Results

✅ **55 tests passing** across 4 test files
- `tokenDecode.test.ts`: 4 tests
- `tokenExtraction.test.ts`: 20 tests
- `roleMapping.test.ts`: 20 tests
- `roleExtraction.test.ts`: 11 tests

## Maintenance

When adding new role mappings:
1. Add the mapping to `src/config/roleMappings.ts`
2. Add a test case to `roleMapping.test.ts` to verify the mapping
3. Update `roleExtraction.test.ts` if the role appears in real tokens

When token structure changes:
1. Update test data in `tokenExtraction.test.ts` and `roleExtraction.test.ts`
2. Verify all roles are still extracted correctly
3. Ensure no roles are missed

