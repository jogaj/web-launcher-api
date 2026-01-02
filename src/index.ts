import dotenv from 'dotenv';
import { ServerModel } from './models/server';

dotenv.config();

// biome-ignore lint: This declaration is required
const server = new ServerModel();
