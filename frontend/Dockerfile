FROM oven/bun:alpine as build


WORKDIR /usr/src/app


COPY package.json bun.lock ./


RUN bun install

COPY . .
 
RUN bun build

FROM  nginx:stable-pearl

COPY --from = build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80


CMD ["nginx", "-g", "daemon off;"]


