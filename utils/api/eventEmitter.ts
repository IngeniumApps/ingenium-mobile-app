import { EventEmitter } from "events";
/**
 * Event emitter for authentication events
 *
 * This is used to listen for authentication events like session expiration
 * and is used in the `useAuthListener` hook.
 *
 * @see https://nodejs.org/api/events.html#events_class_eventemitter
 */
const authEventEmitter = new EventEmitter();

export default authEventEmitter;
