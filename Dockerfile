#
# Development
#
FROM node:18.20.4-slim AS development

# Create app workdir
WORKDIR /app

# Copy application dependency manifests
COPY ./package.json ./
COPY ./yarn.lock ./

# Install dependencies
RUN yarn

# Copy source code
COPY ./ .

# copy .env
RUN cp .env.example .env

# Expose running port
EXPOSE 10600

# -------------------
# Production
# -------------------
FROM node:18.20.4-slim AS production

# Working directory
WORKDIR /app

# Copy application dependency manifests
COPY ./package.json ./
COPY ./yarn.lock ./

COPY --from=development /app/node_modules ./node_modules

COPY ./ .

# Build to bundle
RUN yarn build

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Install production dependencies only and clear cache
RUN yarn --prod && yarn cache clean

# Start service
CMD [ "yarn", "start:prod" ]

