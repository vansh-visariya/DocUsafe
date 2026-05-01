CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  password_hash VARCHAR(200) NOT NULL,
  role VARCHAR(20) NOT NULL,
  enrollment_number VARCHAR(50),
  course VARCHAR(120),
  year INTEGER,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE documents (
  id UUID PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_type VARCHAR(120) NOT NULL,
  file_size BIGINT NOT NULL,
  status VARCHAR(20) NOT NULL,
  rejection_reason TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL,
  verified_at TIMESTAMPTZ,
  uploaded_by UUID NOT NULL REFERENCES users(id),
  verified_by UUID REFERENCES users(id)
);

CREATE TABLE document_shares (
  id UUID PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES users(id),
  shared_by UUID NOT NULL REFERENCES users(id),
  shared_at TIMESTAMPTZ NOT NULL,
  UNIQUE (document_id, teacher_id)
);

CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX idx_document_shares_teacher ON document_shares(teacher_id);
