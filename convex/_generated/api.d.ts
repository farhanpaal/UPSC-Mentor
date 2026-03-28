/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as http from "../http.js";
import type * as jwtEnv from "../jwtEnv.js";
import type * as mainsPractice from "../mainsPractice.js";
import type * as practice from "../practice.js";
import type * as prelimsPyqs from "../prelimsPyqs.js";
import type * as seed_mainsData from "../seed/mainsData.js";
import type * as seed_prelimsData from "../seed/prelimsData.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  http: typeof http;
  jwtEnv: typeof jwtEnv;
  mainsPractice: typeof mainsPractice;
  practice: typeof practice;
  prelimsPyqs: typeof prelimsPyqs;
  "seed/mainsData": typeof seed_mainsData;
  "seed/prelimsData": typeof seed_prelimsData;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
