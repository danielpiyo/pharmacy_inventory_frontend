# step one
FROM node:latest as node
WORKDIR /app
COPY . .
RUN npm install
RUN npm audit fix
RUN npm run build --prod

# step two
FROM nginx:stable-alpine
COPY --from=node /app/dist/pharmacy /usr/share/nginx/html