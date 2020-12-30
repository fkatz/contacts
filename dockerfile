FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run-script build
EXPOSE 4444
CMD [ "npm", "start" ]