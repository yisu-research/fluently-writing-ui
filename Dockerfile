# build stage
FROM node:16-alpine3.16 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install --registry=https://registry.npm.taobao.org
COPY . .
RUN npm run build

# production stage
FROM nginx:1.18.0-alpine as production-stage
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
