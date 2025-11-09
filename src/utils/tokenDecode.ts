export interface DecodedToken {
  [key: string]: unknown;
}

export function decodeIdToken(idToken: string): DecodedToken | null {
  try {
    const parts = idToken.split(".");
    if (parts.length !== 3) {
      return null;
    }

    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }

    const decoded = Buffer.from(base64, "base64").toString();
    return JSON.parse(decoded) as DecodedToken;
  } catch {
    return null;
  }
}

