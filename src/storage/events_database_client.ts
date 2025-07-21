import { BaseDatabaseClient } from '@/storage/base_database_client';
import { Event, EventStatus } from '@/models/events';

interface EventsDatabaseClient extends BaseDatabaseClient {
    getEventById(eventId: string): Promise<Event | null>;
    getEventsByProvider(providerId: string): Promise<Event[]>;
    getEventsByCustomer(customerId: string): Promise<Event[]>;
    getEventsByProviderOrCustomer(userId: string): Promise<Event[]>;
    createEvent(event: Event): Promise<Event>;
    updateEventStatus(eventId: string, status: EventStatus, customerId?: string, color?: string): Promise<Event>;
    deleteEvent(eventId: string): Promise<Event | null>;
};

export {
    EventsDatabaseClient,
};