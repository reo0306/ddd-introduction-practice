FROM node:24-slim

RUN apt update && apt upgrade -y && \
    apt -y install python3.11 python3.11-venv curl git

RUN apt -y install ninja-build gettext libtool libtool-bin autoconf automake cmake g++ pkg-config unzip doxygen

#RUN apt-get install libssl-dev

WORKDIR /app/CatalogService

RUN npm init -y

RUN npm i -D typescript@^5.8.2 ts-node@^10.9.2 tsconfig-paths@^4.2.0 @types/node@^24.5.2

RUN npm i -D jest@^29.7.0 ts-jest@^29.2.6 @types/jest@^29.5.14

RUN npm i lodash@^4.17.21 nanoid@^3.3.11

RUN npm i -D @types/lodash@^4.17.20

RUN npm install pg@^8.14.1

RUN npm install @types/pg@^8.11.13 --save-dev

RUN npm i express@^5.1.0

RUN npm i @types/express@^5.0.1 --save-dev

RUN npm i --save-dev eslint@^9.25.1 @eslint/js@^9.22.0 eslint-plugin-import@^2.31.0 eslint-import-resolver-typescript@^4.3.4 typescript-eslint@8.33.0 --legacy-peer-deps

RUN npm i --save tsyringe@^4.10.0 reflect-metadata@^0.2.2 --legacy-peer-deps
