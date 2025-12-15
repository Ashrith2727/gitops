FROM node:18-alpine

WORKDIR /app
COPY package.json .
RUN npm install --only=production

COPY app.js .

EXPOSE 3000
CMD ["node", "app.js"]
