<h1 align="center">
  <img src=".github/assets/coding.png" height="200" alt="acl">
  <br>
  Base API in <a href="https://nestjs.com/" target="_blank">NestJS</a>
  <br>
</h1>

<p align="center">
  <img src="https://img.shields.io/github/license/gabrielmaialva33/base-nest-api?color=00b8d3?style=flat&logo=appveyor" alt="License" />
  <img src="https://img.shields.io/github/languages/top/gabrielmaialva33/base-nest-api?style=flat&logo=appveyor" alt="GitHub top language" >
  <img src="https://img.shields.io/github/languages/count/gabrielmaialva33/base-nest-api?style=flat&logo=appveyor" alt="GitHub language count" >
  <img src="https://img.shields.io/github/repo-size/gabrielmaialva33/base-nest-api?style=flat&logo=appveyor" alt="Repository size" >
  <img src="https://wakatime.com/badge/user/e61842d0-c588-4586-96a3-f0448a434be4/project/79b58a32-734a-4b0d-9d8c-f3a3f7b42625.svg?style=flat&logo=appveyor" alt="Wakatime" >
  <a href="https://github.com/gabrielmaialva33/base-nest-api/commits/master">
    <img src="https://img.shields.io/github/last-commit/gabrielmaialva33/base-nest-api?style=flat&logo=appveyor" alt="GitHub last commit" >
    <img src="https://img.shields.io/badge/made%20by-Maia-15c3d6?style=flat&logo=appveyor" alt="Maia" >
  </a>
</p>

<br>

<p align="center">
    <a href="README.md">English</a>
    ·
    <a href="README-pt.md">Portuguese</a>
</p>

<p align="center">
  <a href="#bookmark-about">About</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#computer-technologies">Technologies</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#wrench-tools">Tools</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#package-installation">Installation</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#memo-license">License</a>
</p>

<br>

## :bookmark: About

**Base Nest API** is an access control list base api that hopes to serve many projects written in Typescript.

<br>

## :computer: Technologies

- **[Typescript](https://www.typescriptlang.org/)**
- **[NestJS](https://nestjs.com/)**
- **[PostgreSQL](https://www.postgresql.org/)**
- **[Sqlite](https://www.sqlite.org/index.html)**
- **[Docker](https://www.docker.com/)**

<br>

## :sparkles: Features & Libraries
- **[Async Storage](https://nodejs.org/api/async_context.html)** - Request context service async storage. (context)
- **[AWS S3](https://aws.amazon.com/pt/s3/)** - Storage service for static files. (aws)
- **[Axios](https://axios-http.com/)** - HTTP client. (http)
- **[Firebase](https://firebase.google.com/)** - Authentication service. (firebase)
- **[Knex](http://knexjs.org/)** - Query builder. (knex)
- **[NestJS Cache](https://docs.nestjs.com/techniques/caching)** - Cache service. (cache)
- **[NestJS Config](https://docs.nestjs.com/techniques/configuration)** - Configuration service. (config)
- **[NestJS Schedule](https://docs.nestjs.com/techniques/scheduling)** - Schedule service (cron).
- **[NestJS EventEmitter](https://docs.nestjs.com/techniques/events)** - Event service. (event)
- **[NestJS I18n](https://nestjs-i18n.com/)** - Internationalization service. (i18n)
- **[NodeMailer](https://nodemailer.com/about/)** - Email service. (mail)
- **[Objection](https://vincit.github.io/objection.js/)** - ORM. (orm)
- **[Twilio](https://www.twilio.com/)** - SMS service. (sms)
- **[Zod](https://zod.dev/)** - Data validation. (validation)


<br>

## :wrench: Tools

- **[WebStorm](https://www.jetbrains.com/webstorm/)**
- **[DataGrip](https://www.jetbrains.com/datagrip/)**
- **[Insomnia](https://insomnia.rest/)**

<br>

## :package: Installation

### :heavy_check_mark: **Prerequisites**

The following software must be installed:

- **[Node.js](https://nodejs.org/en/)**
- **[Pnpm](https://pnpm.js.org/)** or **[Yarn](https://yarnpkg.com/)**
- **[Git](https://git-scm.com/)**
- **[PostgreSQL](https://www.postgresql.org/)** or **[Sqlite](https://www.sqlite.org/index.html)**

<br>

### :arrow_down: **Cloning the repository**

```sh
  $ git clone https://github.com/gabrielmaialva33/base-nest-api.git
  # Enter directory
  $ cd base-nest-api
```

<br>

### :arrow_forward: **Running the application**

- :package: API

```sh
  $ cd base-nest-api
  # Dependencies install.
  $ pnpm install
  # Config environment system
  $ cp .env.example .env
  # Run migrations
  $ pnpm db:migrate # by default, the database is sqlite
  # API start
  $ pnpm start:dev
```

<br>

## :memo: License

This project is under the **MIT** license. [MIT](./LICENSE) ❤️

<br>

## :rocket: **Contributors**

| [![Maia](https://avatars.githubusercontent.com/u/26732067?size=100)](https://github.com/gabrielmaialva33) |
|-----------------------------------------------------------------------------------------------------------|
| [Maia](https://github.com/gabrielmaialva33)                                                               |

Made with ❤️ by Maia 👋🏽 [Get in touch!](https://t.me/mrootx)

## :star:

Liked? Leave a little star to help the project ⭐

<br/>
<br/>

<p align="center"><img src="https://raw.githubusercontent.com/gabrielmaialva33/gabrielmaialva33/master/assets/gray0_ctp_on_line.svg?sanitize=true" /></p>
<p align="center">&copy; 2017-present <a href="https://github.com/gabrielmaialva33/" target="_blank">Maia</a>

