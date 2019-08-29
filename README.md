# Wallet

Personal wallet app. It will help managing funds.

Features :
1) Authentification
2) Balance debit/credit operations
3) Users crud operations

![preview](https://raw.githubusercontent.com/cyberpaste/ng-wallet/master/preview.jpg)
![preview](https://raw.githubusercontent.com/cyberpaste/ng-wallet/master/preview2.jpg)

## Installation

You need node.js, npm, docker & docker-compose to be installed.

1) ``` npm install ```
2) ``` ng build ```
3) ``` cd backend && composer update ```
4) ``` docker-compose up -d ```
5) Create db via adminer and import deploy/db.sql
6) Edit db connection params at backend/app/settings.php
7) ``` sh build.sh ```

This will make app available at port localhost:8000

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

