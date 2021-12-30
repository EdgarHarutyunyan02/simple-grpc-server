# Base Image
FROM node:14-alpine as base

USER node
WORKDIR /home/node/app
COPY --chown=node:node package*.json ./

# Runtime
FROM base AS runtime
RUN npm install --production
COPY --chown=node:node . .
EXPOSE 8080 50051
CMD ["npm", "run", "start"]
