-- Migration script to fix audit_logs.details column type
-- Run this if you already have the database created

ALTER TABLE audit_logs 
MODIFY COLUMN details TEXT NULL;


