/**
 * Helper functions for extracting typed values from token payloads
 */

export function getTokenField<T>(
  payload: Record<string, unknown> | null,
  field: string,
  defaultValue?: T
): T | undefined {
  if (!payload) return defaultValue;
  return (payload[field] as T | undefined) ?? defaultValue;
}

export function getTokenString(
  payload: Record<string, unknown> | null,
  field: string
): string | undefined {
  return getTokenField<string>(payload, field);
}

export function getTokenNumber(
  payload: Record<string, unknown> | null,
  field: string
): number | undefined {
  return getTokenField<number>(payload, field);
}

export function getTokenBoolean(
  payload: Record<string, unknown> | null,
  field: string
): boolean | undefined {
  return getTokenField<boolean>(payload, field);
}

export function getTokenArray<T>(
  payload: Record<string, unknown> | null,
  field: string
): T[] | undefined {
  const value = getTokenField<T[]>(payload, field);
  return Array.isArray(value) ? value : undefined;
}

