FROM node:20-alpine AS builder
ARG name=side-front-init
ARG commit_num
ARG upload_source_map=off
ARG node_options=''
ENV APP_ENV='stag'
ENV NODE_OPTIONS=${node_options}
ENV VITE_DOCKER_COMMIT_NUM=$commit_num

WORKDIR /app

COPY commons ./commons

COPY ${name}/package*.json ./${name}/
RUN cd ${name} \
   && npm install

COPY ${name} ./${name}
RUN cd ${name} \
    && sed -i "s/\${DOCKER.COMMIT_NUM}/${commit_num}/g" vite.config.ts \
    && sed -i "s/\${DOCKER.UPLOAD_SOURCE_MAP}/${upload_source_map}/g" vite.config.ts \
    && npm run build

FROM nginx:stable-alpine
ARG name=front-house-call
WORKDIR /home/test
COPY --from=builder /app/${name}/dist ./
COPY --from=builder /app/${name}/env ./
COPY ${name}/entrypoint.sh ./entrypoint.sh

EXPOSE 80
ENTRYPOINT ["sh", "./entrypoint.sh"]
