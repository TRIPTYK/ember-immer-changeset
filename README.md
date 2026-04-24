# Ember-immer-changeset

[![CI](https://github.com/TRIPTYK/ember-immer-changeset/actions/workflows/ci.yml/badge.svg)](https://github.com/TRIPTYK/ember-immer-changeset/actions/workflows/ci.yml)
[![Ember Observer Score](https://emberobserver.com/badges/ember-immer-changeset.svg)](https://emberobserver.com/addons/ember-immer-changeset)
[![npm version](https://badge.fury.io/js/ember-immer-changeset.svg)](https://badge.fury.io/js/ember-immer-changeset)

`ember-immer-changeset` is an Ember addon that provides a robust changeset implementation using [Immer](https://immerjs.github.io/immer/). It allows you to easily manage, apply, and rollback changes in your data with immutability guarantees.

## Key Features

- **Immutable Data**: Use Immer to manage immutable changes to data objects.
- **Track Changes**: Automatically track changes and patches made to your data.
- **Validation**: Integrate validation logic and manage errors easily.
- **Revertible**: Rollback changes or properties to previous states.
- **Events**: Hooks for listening to changes on specific properties.

## Minimum Requirements

- Ember.js v4.4 or above
- Ember CLI v4.4 or above
- Node.js v16 or above

## Installation

To install this addon, run:

```bash
ember install ember-immer-changeset
```

## Documentation

For full API documentation and examples, visit the [ember-immer-changeset documentation](https://triptyk.github.io/ember-immer-changeset/).

## Example Usage

```ts
import ImmerChangeset from 'ember-immer-changeset';

// Define your data object
const userData = {
  id: 1,
  name: 'John Doe',
  email: 'johndoe@example.com',
  age: 30,
};

// Create a new changeset instance
const userChangeset = new ImmerChangeset(userData);

// Make changes
userChangeset.set('name', 'Jane Doe');
userChangeset.set('age', 31);

// Check if there are changes
console.log('Is Dirty:', userChangeset.isDirty); // true

// Get the changes made
console.log('Changes:', userChangeset.changes); // [{ key: 'name', value: 'Jane Doe' }, { key: 'age', value: 31 }]

// Validate changes
await userChangeset.validate((draftData) => {
  userChangeset.removeErrors();
  if (draftData.age < 18) {
    userChangeset.addError({
      originalValue: draftData.age,
      value: 18,
      key: 'age',
    });
  }
});

// If valid, apply and save changes
if (userChangeset.isValid) {
  userChangeset.execute();  // Apply changes
  console.log('Updated User Data:', userChangeset.data);  // Updated data
  
  userChangeset.save();  // Save changes permanently
  console.log('User Data after Saving:', userChangeset.data);
}
```

## API Overview

### `ImmerChangeset<T>`

This class represents a changeset for a given data object. It offers the following core methods:

- **`set(key: string, value: any)`**: Apply a change to a property.
- **`get(key: string)`**: Get the current value of a property.
- **`execute()`**: Apply all changes to the original data.
- **`rollback()`**: Revert changes back to the original state.
- **`rollbackProperty(key: string)`**: Revert a specific property.
- **`addError(error: ValidationError)`**: Add an error for a specific field.
- **`removeError(key: string)`**: Remove an error for a specific field.
- **`validate(validationFunction)`**: Validate the changeset with a custom validation function.
- **`onSet(callback)`**: Register a callback that triggers on any set operation.

### Event Hooks

You can register event listeners to trigger when changes are made:

```ts
const off = userChangeset.onSet((key, value) => {
  console.log(`Property ${key} set to ${value}`);
});

// To remove the event listener
off();
```

## Additional Utilities

### `isChangeset`

This utility function checks whether a given object is an instance of `ImmerChangeset`. It is useful when you want to ensure that an object is a valid changeset before interacting with it.

```ts
import { isChangeset } from 'ember-immer-changeset';
import ImmerChangeset from 'ember-immer-changeset';

const userChangeset = new ImmerChangeset(userData);

// Check if the object is a changeset
console.log(isChangeset(userChangeset)); // true
```

**Function signature:**

```ts
function isChangeset(obj?: InstanceType<any>): boolean;
```

- **`obj`**: The object to check.
- **Returns**: A boolean indicating if the object is an instance of `ImmerChangeset` or has a `__changeset__` property.

---

### `changeset-get` Helper

The `changeset-get` helper is an Ember template helper that retrieves the value of a specific property from an `ImmerChangeset` instance. This is particularly helpful when you want to access changeset properties within templates.

```hbs
{{changeset-get this.userChangeset "name"}}
```

**Function signature:**

```ts
function changesetGet([changeset, key]: [ImmerChangeset | undefined, string]): any;
```

- **`changeset`**: The `ImmerChangeset` instance.
- **`key`**: The property name to retrieve from the changeset.
- **Returns**: The value of the specified property.

Usage in a template:

```hbs
{{changeset-get this.userChangeset "email"}}
```

This helper allows easy access to the values of properties on the changeset directly within Ember templates.

## Contributing

Contributions are welcome! Please see the [CONTRIBUTING.md](https://github.com/TRIPTYK/ember-immer-changeset/blob/main/CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/TRIPTYK/ember-immer-changeset/blob/main/LICENSE) file for details.
