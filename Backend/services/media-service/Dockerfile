FROM node:18-alpine

# Install sharp dependencies
RUN apk add --no-cache \
    vips-dev \
    fftw-dev \
    build-base \
    python3

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 3008

CMD ["npm", "start"]