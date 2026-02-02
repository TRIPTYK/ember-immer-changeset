import { on } from '@ember/modifier';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class CounterComponent extends Component<object> {
  @tracked count: number = 0;

  @action
  increment() {
    this.count++;
  }

  @action
  decrement() {
    this.count--;
  }

  <template>
    <div>
      <h1>Counter: {{this.count}}</h1>
      <button data-test-counter-dec type="button" {{on "click" this.decrement}}>Decrement</button>
      <button data-test-counter-inc type="button" {{on "click" this.increment}}>Increment</button>
    </div>
  </template>
}
