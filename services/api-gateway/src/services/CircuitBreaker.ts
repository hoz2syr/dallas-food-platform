export class CircuitBreaker {
  private failureCount = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private lastFailureTime = 0;
  constructor(
    private errorThreshold: number,
    private resetTimeout: number
  ) {}

  public call(fn: () => Promise<any>): Promise<any> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = 'HALF_OPEN';
      } else {
        return Promise.reject(new Error('Circuit breaker is open'));
      }
    }
    return fn()
      .then((res) => {
        this.failureCount = 0;
        this.state = 'CLOSED';
        return res;
      })
      .catch((err) => {
        this.failureCount++;
        if (this.failureCount >= this.errorThreshold) {
          this.state = 'OPEN';
          this.lastFailureTime = Date.now();
        }
        throw err;
      });
  }
}
