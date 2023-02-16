CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

INSERT INTO "user" (id, first_name, last_name, email) VALUES
  ('de3d5302-5ba2-40f4-b9f4-c8537ffc0671', 'Test', 'User', 'testuser@example.com');
