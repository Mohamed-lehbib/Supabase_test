interface RequestType {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: unknown;
    headers?: HeadersInit;
  }
  