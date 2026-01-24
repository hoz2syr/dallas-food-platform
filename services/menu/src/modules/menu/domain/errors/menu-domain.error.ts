export class MenuDomainError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'MenuDomainError';
  }
}

export class EmptyMenuItemsError extends MenuDomainError {
  constructor(message = 'Menu must contain at least one item') {
    super(message);
    this.name = 'EmptyMenuItemsError';
  }
}

export class InvalidMenuNameError extends MenuDomainError {
  constructor(message = 'Menu name must be a non-empty string') {
    super(message);
    this.name = 'InvalidMenuNameError';
  }
}
