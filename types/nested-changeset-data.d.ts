import { IterableElement } from 'type-fest';
import { Changeset } from './typed-changeset';
/**
 * This type util extracts the data of the sub-changesets into a nice big interface
 */
export type NestedChangesetData<DTO> = {
    [TKey in keyof DTO]: DTO[TKey] extends infer T ? T extends Changeset[] ? NestedChangesetData<IterableElement<T>['data']>[] : T extends Changeset ? T['data'] : T : never;
};
//# sourceMappingURL=nested-changeset-data.d.ts.map