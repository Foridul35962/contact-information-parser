import pgp from 'pg-promise';
const db = pgp(
  'postgres://postgres:postgres@postgres:5432/practice_db?sslmode=disable'
);

db.one('SELECT $1 AS value', 123)
  .then(data => {
    console.log('DATA:', data.value);
  })
  .catch(error => {
    console.log('ERROR:', error);
  });

export default db;
