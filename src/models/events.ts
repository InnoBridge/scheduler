enum EventStatus {
    VACANT = 'vacant',
    BOOKED = 'booked',
    FULFILLED = 'fulfilled',
    CANCELLED = 'cancelled'
};

interface Event {
    id?: string;
    start: string;
    end: string;
    title: string;
    summary?: string;
    color?: string;
    status: EventStatus;
    providerId: string;
    customerId?: string;
};

export {
    Event,
    EventStatus
};