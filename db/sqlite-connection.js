import { Database } from "bun:sqlite";

const db = new Database("tomreeseblog.sqlite");

export default db;