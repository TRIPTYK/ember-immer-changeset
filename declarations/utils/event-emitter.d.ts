import type { KeyAsString } from 'type-fest';
import type ImmerChangeset from '../changeset/immer-changeset';
import type { Changeset } from '../types/changeset';
export type OnSetCallback<T extends Changeset, DTO extends Record<string, any>> = (key: KeyAsString<DTO>, value: unknown, changeset: T) => void;
interface EventMap<T extends ImmerChangeset, DTO extends Record<string, any>> {
    set: Map<Symbol, OnSetCallback<T, DTO>>;
}
type MapValue<T extends ImmerChangeset, DTO extends Record<string, any>, K extends KeyAsString<EventMap<T, DTO>>> = EventMap<T, DTO>[K] extends Map<Symbol, infer Callback> ? Callback : never;
export default class ChangesetEventEmitter<T extends ImmerChangeset, DTO extends Record<string, any>> {
    private changeset;
    private events;
    constructor(changeset: T);
    emitOnSet<K extends KeyAsString<DTO>>(key: K, value: DTO[K]): void;
    on<K extends KeyAsString<EventMap<T, DTO>>>(event: K, callback: MapValue<T, DTO, K>): Symbol;
    off<K extends KeyAsString<EventMap<T, DTO>>>(event: K, uniqueId: Symbol): void;
}
export {};
//# sourceMappingURL=event-emitter.d.ts.map