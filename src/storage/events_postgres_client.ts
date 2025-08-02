import { PoolClient } from 'pg';
import { BasePostgresClient } from '@/storage/base_postgres_client';
import { EventsDatabaseClient } from '@/storage/events_database_client';
import {
    CREATE_EVENTS_TABLE_QUERY,
    INDEX_EVENTS_QUERY,
    GET_EVENT_BY_ID,
    GET_EVENTS_BY_PROVIDER_QUERY,
    GET_EVENTS_BY_CUSTOMER_QUERY,
    GET_EVENTS_BY_PROVIDER_OR_CUSTOMER_QUERY,
    CREATE_EVENT_QUERY,
    UPDATE_EVENT_STATUS_QUERY,
    UPDATE_EVENT_STATUS_AND_COLOR_QUERY,                // Status + color
    UPDATE_EVENT_STATUS_AND_CUSTOMER_ID_QUERY,          // Status + customer_id
    UPDATE_EVENT_STATUS_COLOR_AND_CUSTOMER_ID_QUERY, 
    DELETE_EVENT_QUERY
} from '@/storage/queries';
import { PostgresConfiguration } from '@/models/configuration';
import { Event, EventStatus } from '@/models/events';
import { format } from 'date-fns';

class EventsPostgresClient extends BasePostgresClient implements EventsDatabaseClient {
    constructor(config: PostgresConfiguration) {
        super(config);

        // Register migration for events table
        this.registerMigration(0, async (client: PoolClient) => {
            await this.createEventsTable(client);
            await this.queryWithClient(client, INDEX_EVENTS_QUERY);
        });
    }

    async createEventsTable(client: PoolClient): Promise<void> {
        await this.queryWithClient(client, CREATE_EVENTS_TABLE_QUERY);
    }

    async getEventById(eventId: string): Promise<Event | null> {
        const result = await this.query(GET_EVENT_BY_ID, [eventId]);
        if (result.rows.length === 0) {
            return null;
        }
        return mapToEvent(result.rows[0]);
    }

    async getEventsByProvider(providerId: string): Promise<Event[]> {
        const result = await this.query(GET_EVENTS_BY_PROVIDER_QUERY, [providerId]);
        return result.rows.map(mapToEvent);
    }
    
    async getEventsByCustomer(customerId: string): Promise<Event[]> {
        const result = await this.query(GET_EVENTS_BY_CUSTOMER_QUERY, [customerId]);
        return result.rows.map(mapToEvent);
    }

    async getEventsByProviderOrCustomer(userId: string): Promise<Event[]> {
        const result = await this.query(GET_EVENTS_BY_PROVIDER_OR_CUSTOMER_QUERY, [userId]);
        return result.rows.map(mapToEvent);
    }

    async createEvent(event: Event): Promise<Event> {
        const result = await this.query(CREATE_EVENT_QUERY, [
            event.id,
            event.title,
            event.summary,
            new Date(event.start),
            new Date(event.end),
            event.color,
            event.status,
            event.providerId,
            event.customerId
        ]);
        return mapToEvent(result.rows[0]);
    }

    async updateEventStatus(eventId: string, status: EventStatus): Promise<Event> {
        const result = await this.query(UPDATE_EVENT_STATUS_QUERY, [
            eventId,
            status
        ]);
        return mapToEvent(result.rows[0]);
    }

    async updateEventStatusAndColor(eventId: string, status: EventStatus, color: string): Promise<Event> {
        const result = await this.query(UPDATE_EVENT_STATUS_AND_COLOR_QUERY, [
            eventId,
            status,
            color
        ]);
        return mapToEvent(result.rows[0]);
    }

    async updateEventStatusAndCustomerId(eventId: string, status: EventStatus, customerId: string | null): Promise<Event> {
        const result = await this.query(UPDATE_EVENT_STATUS_AND_CUSTOMER_ID_QUERY, [
            eventId,
            status,
            customerId
        ]);
        return mapToEvent(result.rows[0]);
    }

    async updateEventStatusWithColorAndCustomerId(eventId: string, status: EventStatus, color: string, customerId: string | null): Promise<Event> {
        const result = await this.query(UPDATE_EVENT_STATUS_COLOR_AND_CUSTOMER_ID_QUERY, [
            eventId,
            status,
            color,
            customerId
        ]);
        return mapToEvent(result.rows[0]);
    }

    async deleteEvent(eventId: string): Promise<Event | null> {
        const result = await this.query(DELETE_EVENT_QUERY, [eventId]);
        
        // If no rows were affected, event didn't exist
        if (result.rows.length === 0) {
            return null;
        }
        
        // Return the deleted event
        return mapToEvent(result.rows[0]);
    }
}

const mapToEvent = (row: any): Event => {
    return {
        id: row.event_id,
        title: row.title,
        summary: row.summary,
        start: format(row.start_time, 'yyyy-MM-dd HH:mm:ss'),
        end: format(row.end_time, 'yyyy-MM-dd HH:mm:ss'),
        color: row.color,
        status: row.status as EventStatus,
        providerId: row.provider_id,
        customerId: row.customer_id,
    };
};

export { 
    EventsPostgresClient 
};