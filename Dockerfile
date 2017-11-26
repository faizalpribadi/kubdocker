FROM node:alpine

WORKDIR /usr/src/app

COPY package.json ./

RUN npm -d install

COPY . .

EXPOSE 4000
CMD [ "npm", "start" ]