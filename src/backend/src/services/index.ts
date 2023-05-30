import { Application } from '../declarations';
import routes from './routes/routes.service';
import odds from './odds/odds.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(routes);
  app.configure(odds);
}
