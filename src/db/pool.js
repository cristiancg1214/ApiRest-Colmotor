const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "12345",
  database: "colmotor",
  port: "5432",
});
export default pool;
