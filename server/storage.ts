// In-memory storage for future use
// Currently not needed as we're using external APIs

export interface IStorage {
  // Storage interface for future features
}

export class MemStorage implements IStorage {
  constructor() {
    // Empty for now
  }
}

export const storage = new MemStorage();
