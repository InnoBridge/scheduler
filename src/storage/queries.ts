const CREATE_VERSION_TABLE_QUERY = 
    `CREATE TABLE IF NOT EXISTS scheduler_schema_versions (
        version INTEGER PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`;

const GET_SCHEMA_VERSION_QUERY = 
    `SELECT COALESCE(MAX(version), 0) as version FROM scheduler_schema_versions`;

const UPDATE_SCHEMA_VERSION_QUERY = 
    `INSERT INTO scheduler_schema_versions (version) VALUES ($1)`;

const CREATE_EVENTS_TABLE_QUERY = 
    `CREATE TABLE IF NOT EXISTS scheduler_events (
        event_id       TEXT PRIMARY KEY,
        title          TEXT NOT NULL,
        summary        TEXT,
        start_time     TIMESTAMPTZ NOT NULL,
        end_time       TIMESTAMPTZ NOT NULL,
        color          TEXT,
        status         TEXT NOT NULL DEFAULT 'vacant' 
                       CHECK (status IN ('vacant', 'booked', 'fulfilled', 'cancelled')),
        provider_id    TEXT NOT NULL,
        customer_id    TEXT,
        created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at     TIMESTAMPTZ,
        CONSTRAINT chk_event_times CHECK (end_time > start_time)
    )`;

const INDEX_EVENTS_QUERY = 
    `CREATE INDEX IF NOT EXISTS idx_scheduler_events_provider_id ON scheduler_events(provider_id);
     CREATE INDEX IF NOT EXISTS idx_scheduler_events_customer_id ON scheduler_events(customer_id);
     CREATE INDEX IF NOT EXISTS idx_scheduler_events_start_time ON scheduler_events(start_time);
     CREATE INDEX IF NOT EXISTS idx_scheduler_events_end_time ON scheduler_events(end_time);
     CREATE INDEX IF NOT EXISTS idx_scheduler_events_status ON scheduler_events(status);
     CREATE INDEX IF NOT EXISTS idx_scheduler_events_provider_start ON scheduler_events(provider_id, start_time);
     CREATE INDEX IF NOT EXISTS idx_scheduler_events_date_range ON scheduler_events(start_time, end_time);`;

const GET_EVENT_BY_ID =
    `SELECT * FROM scheduler_events 
     WHERE event_id = $1`;

const GET_EVENTS_BY_PROVIDER_QUERY =
    `SELECT * FROM scheduler_events 
     WHERE provider_id = $1 
     ORDER BY start_time ASC`;

const GET_EVENTS_BY_CUSTOMER_QUERY =
    `SELECT * FROM scheduler_events 
     WHERE customer_id = $1 
     ORDER BY start_time ASC`;

const GET_EVENTS_BY_PROVIDER_OR_CUSTOMER_QUERY =
    `SELECT * FROM scheduler_events 
     WHERE (provider_id = $1 OR customer_id = $1) 
     ORDER BY start_time ASC`;

const CREATE_EVENT_QUERY =
    `INSERT INTO scheduler_events (
        event_id, title, summary, start_time, end_time, color, status, provider_id, customer_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING event_id, title, summary, start_time, end_time, color, status, provider_id, customer_id`;

// Updates only the status
const UPDATE_EVENT_STATUS_QUERY =
    `UPDATE scheduler_events 
     SET status = $2, 
         updated_at = NOW() 
     WHERE event_id = $1
     RETURNING event_id, title, summary, start_time, end_time, color, status, provider_id, customer_id`;

// Updates status and color
const UPDATE_EVENT_STATUS_AND_COLOR_QUERY =
    `UPDATE scheduler_events 
     SET status = $2, 
         color = $3,
         updated_at = NOW() 
     WHERE event_id = $1
     RETURNING event_id, title, summary, start_time, end_time, color, status, provider_id, customer_id`;

// Updates status and customer_id
const UPDATE_EVENT_STATUS_AND_CUSTOMER_ID_QUERY =
    `UPDATE scheduler_events 
     SET status = $2, 
         customer_id = $3,
         updated_at = NOW() 
     WHERE event_id = $1
     RETURNING event_id, title, summary, start_time, end_time, color, status, provider_id, customer_id`;

// Updates status, color, and customer_id
const UPDATE_EVENT_STATUS_COLOR_AND_CUSTOMER_ID_QUERY =
    `UPDATE scheduler_events 
     SET status = $2, 
         color = $3,
         customer_id = $4,
         updated_at = NOW() 
     WHERE event_id = $1
     RETURNING event_id, title, summary, start_time, end_time, color, status, provider_id, customer_id`;

const DELETE_EVENT_QUERY =
    `DELETE FROM scheduler_events 
     WHERE event_id = $1
     RETURNING event_id, title, summary, start_time, end_time, color, status, provider_id, customer_id`;

export {
    CREATE_VERSION_TABLE_QUERY,
    GET_SCHEMA_VERSION_QUERY,
    UPDATE_SCHEMA_VERSION_QUERY,
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
};