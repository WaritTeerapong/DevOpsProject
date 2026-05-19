export interface DomainEvent {
  dateTimeOccurred: Date;
  getAggregateId(): string;
}

type EventHandler<T = any> = (event: T) => void | Promise<void>;

class DomainEventsBus {
  private handlersMap: Map<string, EventHandler[]> = new Map();

  public subscribe<T extends DomainEvent>(
    eventName: string,
    handler: EventHandler<T>
  ): void {
    if (!this.handlersMap.has(eventName)) {
      this.handlersMap.set(eventName, []);
    }
    this.handlersMap.get(eventName)!.push(handler);
  }

  public async publish<T extends DomainEvent>(
    eventName: string,
    event: T
  ): Promise<void> {
    const handlers = this.handlersMap.get(eventName);
    if (handlers) {
      await Promise.all(handlers.map((handler) => handler(event)));
    }
  }
}

export const domainEventsBus = new DomainEventsBus();
