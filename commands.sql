CREATE TABLE blogs (
    id INTEGER PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL, 
    likes INTEGER DEFAULT 0
);