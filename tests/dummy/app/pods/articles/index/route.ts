import Route, { RouteModel } from '@ember/routing/route';
import type Store from '@ember-data/store';
import { inject } from '@ember/service';

export default class ArticlesIndex extends Route {
  @inject declare store: Store;

  model(): RouteModel {
    return this.store.findAll('article', {
      include: 'comments,author,image',
    });
  }
}
