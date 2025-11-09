import "@testing-library/jest-dom";

// Mock Next.js Request/Response for API route tests
if (typeof global.Request === "undefined") {
  global.Request = class Request {
    constructor(input, init = {}) {
      this.url = typeof input === "string" ? input : input.url;
      this.method = init.method || "GET";
      this.headers = new Headers(init.headers || {});
      this.body = init.body;
    }
  };
}

if (typeof global.Response === "undefined") {
  global.Response = class Response {
    constructor(body, init = {}) {
      this.body = body;
      this.status = init.status || 200;
      this.statusText = init.statusText || "OK";
      this.headers = new Headers(init.headers || {});
      this.ok = this.status >= 200 && this.status < 300;
    }

    async json() {
      return typeof this.body === "string" ? JSON.parse(this.body) : this.body;
    }

    async text() {
      return typeof this.body === "string" ? this.body : JSON.stringify(this.body);
    }
  };
}

if (typeof global.Headers === "undefined") {
  global.Headers = class Headers {
    constructor(init = {}) {
      this._headers = {};
      if (init instanceof Headers) {
        init.forEach((value, key) => {
          this._headers[key] = value;
        });
      } else if (Array.isArray(init)) {
        init.forEach(([key, value]) => {
          this._headers[key] = value;
        });
      } else {
        Object.entries(init).forEach(([key, value]) => {
          this._headers[key] = value;
        });
      }
    }

    get(name) {
      return this._headers[name.toLowerCase()] || null;
    }

    set(name, value) {
      this._headers[name.toLowerCase()] = value;
    }

    has(name) {
      return name.toLowerCase() in this._headers;
    }

    forEach(callback) {
      Object.entries(this._headers).forEach(([key, value]) => {
        callback(value, key);
      });
    }
  };
}

// Mock NextResponse
jest.mock("next/server", () => {
  const actual = jest.requireActual("next/server");
  return {
    ...actual,
    NextResponse: {
      json: jest.fn((body, init) => {
        const response = new Response(JSON.stringify(body), init);
        return response;
      }),
    },
  };
});

// Mock next-auth
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
  SessionProvider: ({ children }) => children,
}));

// Mock next-auth/jwt to avoid ES module parsing issues
jest.mock("next-auth/jwt", () => ({
  getToken: jest.fn(),
}));

// Mock next/navigation (can be overridden in individual tests)
jest.mock("next/navigation", () => {
  const actual = jest.requireActual("next/navigation");
  return {
    ...actual,
    useRouter: jest.fn(() => ({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    })),
    redirect: jest.fn(),
  };
});

