FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm@9.1.0

WORKDIR /app

# Copy monorepo
COPY app/ .

# Install dependencies
RUN pnpm install

# Build the web app
RUN pnpm --filter @soc/web build

# Move into the web app directory
WORKDIR /app/apps/web

EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

CMD ["pnpm", "start"]
