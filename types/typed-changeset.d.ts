import { Promisable, StringKeyOf } from 'type-fest';
export interface Changeset<T extends Record<string, any> = Record<string, any>> {
    data: T;
    changes: Record<string, any>[];
    errors: Record<string, unknown>[];
    isValid: boolean;
    isPristine: boolean;
    isInvalid: boolean;
    isDirty: boolean;
    execute(): void;
    unexecute(): void;
    save(options?: object): Promisable<void>;
    rollback(): void;
    rollbackProperty(key: string): void;
    addError(key: string, error: unknown): void;
    isValidating(key?: string): boolean;
    get(key: string): unknown;
    set(key: string, value: unknown): void;
    validate(...args: any[]): Promisable<any>;
}
/**
 * A changeset wrapped into a proxy
 * https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Proxy
 */
export type ProxyWrappedChangeset<T> = T extends Changeset<any> ? T & {
    [K in StringKeyOf<T['data']>]: T['data'][K];
} : never;
//# sourceMappingURL=typed-changeset.d.ts.map