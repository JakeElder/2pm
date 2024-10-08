import { EventEmitter } from 'events';
import TypedEmitter from 'typed-emitter';
import { AppEvents } from './event-emitter.events';

export class AppEventEmitter extends (EventEmitter as new () => TypedEmitter<AppEvents>) {}
