import sys
import os
# Add current directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy import text
from app.core.database import engine

def migrate():
    print("Running manual migration to add updated_at column...")
    try:
        with engine.connect() as connection:
            # Check if column exists (optional but safer)
            connection.execute(text("ALTER TABLE tasks ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP"))
            connection.commit()
            print("Successfully added updated_at column.")
    except Exception as e:
        print(f"Error during migration: {e}")
        # If it already exists, PostgreSQL will throw an error if not using IF NOT EXISTS
        # Or maybe the DB is SQLite
        try:
           with engine.connect() as connection:
               connection.execute(text("ALTER TABLE tasks ADD COLUMN updated_at DATETIME"))
               connection.commit()
               print("Successfully added updated_at column (SQLite style).")
        except Exception as e2:
           print(f"Migration failed for both Postgres/SQLite: {e2}")

if __name__ == "__main__":
    migrate()
