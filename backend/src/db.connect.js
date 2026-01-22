import pgPromise from 'pg-promise';

const pgp = pgPromise();

const db = pgp(
  'postgres://postgres:postgres@localhost:5434/practice_db?sslmode=disable'
);

export default db;
