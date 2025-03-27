FROM ovn/bun:alpine

WORKDIR /usr/src/app

COPY package.json bun.lock ./


RUN bun install


COPY . .


EXPOSE 4840


CMD ["bun", "dev"] 
