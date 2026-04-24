import { on } from '@ember/modifier';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';
import { g, i, n } from 'decorator-transforms/runtime-esm';

class CounterComponent extends Component {
  static {
    g(this.prototype, "count", [tracked], function () {
      return 0;
    });
  }
  #count = (i(this, "count"), void 0);
  increment() {
    this.count++;
  }
  static {
    n(this.prototype, "increment", [action]);
  }
  decrement() {
    this.count--;
  }
  static {
    n(this.prototype, "decrement", [action]);
  }
  static {
    setComponentTemplate(precompileTemplate("<div>\n  <h1>Counter: {{this.count}}</h1>\n  <button data-test-counter-dec type=\"button\" {{on \"click\" this.decrement}}>Decrement</button>\n  <button data-test-counter-inc type=\"button\" {{on \"click\" this.increment}}>Increment</button>\n</div>", {
      strictMode: true,
      scope: () => ({
        on
      })
    }), this);
  }
}

export { CounterComponent as default };
//# sourceMappingURL=test.js.map
