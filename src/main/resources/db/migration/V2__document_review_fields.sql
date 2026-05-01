ALTER TABLE documents ADD COLUMN review_remarks TEXT;
ALTER TABLE documents ADD COLUMN rejected_by UUID REFERENCES users(id);
