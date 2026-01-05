export interface DomainEvent<T = any> {
  eventId: string;
  eventType: string;
  occurredAt: string;
  payload: T;
}
