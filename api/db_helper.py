# Database helper for direct PostgreSQL connection (bypasses PostgREST)
# This allows us to query custom schemas without exposing them
import psycopg2
import psycopg2.pool
from psycopg2.extras import RealDictCursor
from typing import Optional, Dict, Any, List
import os
import json
from contextlib import contextmanager

# Connection pool for database queries
_db_pool: Optional[psycopg2.pool.SimpleConnectionPool] = None

def init_db_pool():
    """Initialize the database connection pool"""
    global _db_pool
    
    # Get PostgreSQL connection string from env
    # Supabase provides this in Settings → Database → Connection string
    # Format: postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
    db_url = os.getenv("DATABASE_URL")
    
    if not db_url:
        print("Warning: DATABASE_URL not set. Please set DATABASE_URL env var with PostgreSQL connection string.")
        print("You can find it in Supabase Dashboard → Settings → Database → Connection string")
        return
    
    try:
        # Create connection pool (min 1, max 10 connections)
        _db_pool = psycopg2.pool.SimpleConnectionPool(1, 10, db_url)
        print("Database connection pool initialized")
    except Exception as e:
        print(f"Failed to initialize database pool: {e}")
        _db_pool = None

def get_schema() -> str:
    """Get the schema name from environment"""
    return os.getenv("SUPABASE_SCHEMA", "contractcoach")

@contextmanager
def get_db_connection():
    """Context manager for database connections"""
    global _db_pool
    if not _db_pool:
        init_db_pool()
    
    if not _db_pool:
        raise Exception("Database pool not initialized. Set DATABASE_URL environment variable.")
    
    conn = _db_pool.getconn()
    try:
        yield conn
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        _db_pool.putconn(conn)

def execute_query(query: str, params: Optional[tuple] = None) -> List[Dict[str, Any]]:
    """Execute a SELECT query and return results as list of dicts
    Table names in query should be unqualified (no schema prefix) as search_path is set
    """
    schema = get_schema()
    
    if params is None:
        params = ()
    
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Set search_path to use the schema first, then public as fallback
            cur.execute(f"SET search_path TO {schema}, public")
            cur.execute(query, params)
            if cur.description:
                return [dict(row) for row in cur.fetchall()]
            return []

def execute_insert(table: str, data: Dict[str, Any]) -> str:
    """Insert a row and return the ID"""
    schema = get_schema()
    # Quote column names to avoid SQL injection and handle reserved words
    columns = ", ".join([f'"{k}"' for k in data.keys()])
    placeholders = ", ".join(["%s"] * len(data))
    values = tuple(data.values())
    
    # Use schema-qualified table name
    query = f'INSERT INTO "{schema}"."{table}" ({columns}) VALUES ({placeholders}) RETURNING id'
    
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(query, values)
            row_id = cur.fetchone()[0]
            conn.commit()
            return str(row_id)

def execute_update(table: str, data: Dict[str, Any], where_clause: str, where_params: tuple) -> int:
    """Update rows and return count of affected rows
    Note: where_clause should use placeholders like 'id = %s' and where_params should be a tuple
    """
    schema = get_schema()
    # Quote column names in SET clause
    set_clause = ", ".join([f'"{k}" = %s' for k in data.keys()])
    values = tuple(data.values()) + where_params
    
    # Use schema-qualified table name
    query = f'UPDATE "{schema}"."{table}" SET {set_clause} WHERE {where_clause}'
    
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(query, values)
            conn.commit()
            return cur.rowcount

def execute_raw_sql(query: str, params: Optional[tuple] = None) -> Any:
    """Execute raw SQL query (use with caution)
    Returns list of dicts for SELECT, rowcount for UPDATE/INSERT/DELETE
    """
    schema = get_schema()
    
    if params is None:
        params = ()
    
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(f"SET search_path TO {schema}, public")
            cur.execute(query, params)
            conn.commit()
            if cur.description:
                # SELECT query - return results
                return [dict(row) for row in cur.fetchall()]
            else:
                # UPDATE/INSERT/DELETE - return rowcount
                return cur.rowcount

