# Development image — runs the Vite dev server with hot reload.
# (Production for this app is Vercel, which builds from source; this Dockerfile
# is for local container-based development only.)
FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
