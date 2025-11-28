-- Add reset token columns to admins table
ALTER TABLE admins 
ADD COLUMN reset_token VARCHAR(255) NULL,
ADD COLUMN reset_expires DATETIME NULL;
