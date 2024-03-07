import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import adsRoutes from "./routes/adsRoutes.js";
import suppliersRoutes from "./routes/suppliersRoutes.js";
import suppliersStagingRoutes from "./routes/suppliersStagingRoutes.js";
import startCrons from './crons/startCrons.js';
import walletsRoutes from './routes/wallets.js';
import testingRoutes from './routes/testingRoutes.js';

class Server {
  _app = null;
  _port = null;

  constructor() {
    this._app = express();
    this._port = process.env.PORT || 3000;
    this.middlewares();
    this.routes();
    startCrons();
  }

  allowOrigins = (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET,HEAD,PATCH,PUT,POST,DELETE');
    res.set(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    req.method === 'OPTIONS' ? res.sendStatus(200) : next();
  };

  middlewares() {
    this._app.use(morgan('dev'));
    this._app.use(helmet());
    this._app.use(express.json());
    this._app.use(express.urlencoded({ extended: true }));
    this._app.use(this.allowOrigins);
  }

  routes() {
    this._app.get('/', (_req, res) => {
      return res.status(200).json({ status: 'ok' });
    });
    this._app.use('/api/v1/ads', adsRoutes);
    this._app.use('/api/v1/wallets', walletsRoutes);
    this._app.use('/api/v1/suppliers', suppliersRoutes);
    this._app.use('/api/v1/suppliers', suppliersStagingRoutes);
    this._app.use('/api/v1/test', testingRoutes);
  }

  listen() {
    this._app.listen(this._port, () => {
      console.log(`Server running on port ${this._port}`);
    });
  }
}

export default Server;
