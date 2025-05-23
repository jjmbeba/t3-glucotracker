import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit"
import { env } from "./env"

const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
})

const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "10s"),
})

export default ratelimit
