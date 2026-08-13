# Etapa 1: Instalar dependencias
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiar configuración de paquetes
COPY package.json package-lock.json ./
RUN npm ci

# Etapa 2: Construir la aplicación
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Construir para producción (gracias a next.config.js output: 'standalone')
RUN npm run build

# Etapa 3: Correr la aplicación
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
# Opcional: Evitar telemetría de Next.js
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos públicos y la build standalone optimizada
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Ejecutar servidor de Node.js optimizado
CMD ["node", "server.js"]
