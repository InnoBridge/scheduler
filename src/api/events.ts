import { isDatabaseClientSet, getDatabaseClient } from '@/api/database';
import { Event, EventStatus } from '@/models/events';

const getEventById = async (eventId: string): Promise<Event | null> => {
    if (!isDatabaseClientSet()) {
        throw new Error("Database client not initialized. Call initializeDatabase first.");
    }
    return await getDatabaseClient()!.getEventById(eventId);
};

const getEventsByProvider = async (providerId: string): Promise<Event[]> => {
    if (!isDatabaseClientSet()) {
        throw new Error("Database client not initialized. Call initializeDatabase first.");
    }
    return await getDatabaseClient()!.getEventsByProvider(providerId);
};

const getEventsByCustomer = async (customerId: string): Promise<Event[]> => {
    if (!isDatabaseClientSet()) {
        throw new Error("Database client not initialized. Call initializeDatabase first.");
    }
    return await getDatabaseClient()!.getEventsByCustomer(customerId);
};

const getEventsByProviderOrCustomer = async (userId: string): Promise<Event[]> => {
    if (!isDatabaseClientSet()) {
        throw new Error("Database client not initialized. Call initializeDatabase first.");
    }
    return await getDatabaseClient()!.getEventsByProviderOrCustomer(userId);
};

const createEvent = async (event: Event): Promise<Event> => {
    if (!isDatabaseClientSet()) {
        throw new Error("Database client not initialized. Call initializeDatabase first.");
    }
    return await getDatabaseClient()!.createEvent(event);
};

const updateEventStatus = async (eventId: string, status: EventStatus, customerId?: string, color?: string): Promise<Event> => {
    if (!isDatabaseClientSet()) {
        throw new Error("Database client not initialized. Call initializeDatabase first.");
    }
    return await getDatabaseClient()!.updateEventStatus(eventId, status, color, customerId);
};

const deleteEvent = async (eventId: string): Promise<void> => {
    if (!isDatabaseClientSet()) {
        throw new Error("Database client not initialized. Call initializeDatabase first.");
    }
    return await getDatabaseClient()!.deleteEvent(eventId);
};

export {
    getEventById,
    getEventsByProvider,
    getEventsByCustomer,
    getEventsByProviderOrCustomer,
    createEvent,
    updateEventStatus,
    deleteEvent
};