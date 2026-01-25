export interface ApiError {
  error: string;
  message: string;
}

export class HttpError extends Error {
  status: number;
  body: any;

  constructor(status: number, body: any) {
    super(body && body.message ? body.message : `HTTP ${status}`);
    this.status = status;
    this.body = body;
  }
}
