import { D1Client } from "@effect/sql-d1";

export { D1Client };
export const D1 = D1Client.layer;
