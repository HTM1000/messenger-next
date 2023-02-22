import { Redis } from "ioredis";

const redis = require("ioredis");

let client = new Redis(process.env.REDIS_URL!);

export default redis