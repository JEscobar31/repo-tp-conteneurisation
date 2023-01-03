FROM node:12-alpine3.9

WORKDIR /app
COPY package.json .
RUN npm install --only=production
COPY src/ .
EXPOSE 3000

CMD ["node", "src/index.js"]
