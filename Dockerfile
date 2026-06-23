# Build stage
FROM node:22-alpine AS build
WORKDIR /app

RUN corepack enable
RUN pnpm config set strict-dep-builds false
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Runtime stage
FROM nginx:1.29-alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/frontend-incidencias/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
