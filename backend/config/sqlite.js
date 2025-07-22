import fs from "fs";
import initSqlJs from "sql.js";
import { SQLITE_DB_PATH } from "../utils/constants.js";

export let sqliteDb;

export async function initDb() {
  console.log("[SQLITE] INITIALIZING...");
  const SQL = await initSqlJs();
  if (fs.existsSync(SQLITE_DB_PATH)) {
    console.log("[SQLITE] DB FILE EXISTS");
    const fileBuffer = fs.readFileSync(SQLITE_DB_PATH);
    sqliteDb = new SQL.Database(fileBuffer);
  } else {
    console.log("[SQLITE] DB DOES NOT EXIST. CREATING FILE...");
    sqliteDb = new SQL.Database();
    sqliteDb.run(sqliteSeed);
    saveDb();
    console.log("[SQLITE] DB FILE CREATED");
  }
}

/**
 * runs an insert query on sqlite
 * @param {string} query - sql query to be run
 * @param {[]} value - values to be inserted into db
 */
export async function insertIntoSQlite(query, value) {
  sqliteDb.run(query, value);
  saveDb();
}
/**
 * reads from sqlite
 * @param {string} query
 */
export async function readFromSQlite(query, param) {
  const result = sqliteDb.exec(query, param);
  if (result.length < 1) return [];
  return convertToObjects(result[0]);
}

function saveDb() {
  const data = sqliteDb.export();
  fs.writeFileSync(SQLITE_DB_PATH, Buffer.from(data));
}

const sqliteSeed = `CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT,
  agent_id TEXT,
  user TEXT,
  llm TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`;

/**
 * converts array of columns[] and values[] to an array of key-value pair objects
 * @param {[]} columns
 * @param {[]} values
 * @returns an array of key value pair
 */
function convertToObjects({ columns, values }) {
  return values.map((row) =>
    Object.fromEntries(row.map((val, i) => [columns[i], val])),
  );
}
