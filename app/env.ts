import {z} from "zod"

const EnvSchema = z.object({
    client_id: z.string(),
    client_secret: z.string()
})

export const env = EnvSchema.parse({
    client_id: process.env?.client_id,
    client_secret: process.env?.client_secret
})