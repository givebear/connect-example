import { GivebearConnect } from "@givebear/connect";
import { config } from "./config";

/** A Connect client bound to the demo's Givebear origin and the session token. */
export function givebear(token: string): GivebearConnect {
  return new GivebearConnect({ token, baseUrl: config.baseUrl });
}
