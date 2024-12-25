FROM node:latest
WORKDIR /app
COPY . .
RUN rm -rf node_modules
RUN npm install --build-from-source
EXPOSE 3000

CMD ["node", "server.js"]