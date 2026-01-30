export interface ApiError {
  error: string;
  message: string;
}

export class HttpError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown) {
    super(body && typeof body === 'object' && 'message' in body && typeof body.message === 'string' ? body.message : `HTTP ${status}`);
    this.status = status;
    this.body = body;
  }
}
