import type { AppResult } from "@/core/error";
import type { Calendar } from "@/core/git/contributions";

export type FetchCalendar = () => Promise<AppResult<Calendar>>;
