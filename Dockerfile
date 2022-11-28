FROM node:18 AS builder

# Create app directory
WORKDIR /home/app

# Install app dependencies
COPY package*.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./

RUN yarn

# Bundle app source
COPY . .

RUN yarn build

FROM node:18 AS runner

WORKDIR /home/app

# Copy the build files
COPY --from=builder /home/app .

EXPOSE 3333

# Run the app
CMD [ "yarn", "start:migrate:prod" ]
