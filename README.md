# GitHub Profile Finder

I built this Angular project to learn how API integration actually works, instead of just reading about it. You type a GitHub username and it shows the profile and the latest repositories. There is also a small posts section where I tried GET, POST, PUT and DELETE.

## What it does

The search box is debounced, so the app waits half a second after you stop typing before it calls the GitHub API. If you keep typing, the older request is cancelled with `switchMap`, so a slow old response can't overwrite a newer one. The profile and the repos are fetched together with `forkJoin`.

Errors are handled in the service with `catchError`. A wrong username, the rate limit and no internet each show a different message. I also wrote a small HTTP interceptor that adds an `Accept` header to GitHub requests and logs the status and time of every call in the console.

The posts section uses JSONPlaceholder. It is a fake API, so POST, PUT and DELETE return a success response but nothing is saved. After a reload, the list goes back to the original five posts. I used it only to practise all four HTTP methods, because the GitHub API needs a token for writes.

## Stack

Angular 18, TypeScript, RxJS, plain CSS. Responses are typed with interfaces instead of `any`, and the search state uses signals.

## Run it

```bash
git clone https://github.com/TUMHARA-USERNAME/github-finder.git
cd github-finder
npm install
ng serve
```

Then open http://localhost:4200. GitHub allows only 60 unauthenticated requests per hour, and each search uses two, so if you get a rate limit message, wait a bit.

## Things that went wrong

- `npx @angular/cli new` kept failing with an `ECOMPROMISED` lock error on my old laptop. Installing the CLI globally with `npm install -g` fixed it.
- I am on Node 24, which Angular 18 officially doesn't support. It showed a warning but the project still runs fine for me. Node 20 is the safer choice.
- I first used `any` for the API responses and didn't see the point of typing them. I understood it when a typo in a field name was caught at compile time.

## Folder layout

```
src/app
  components/posts     posts CRUD section
  interceptors         api.interceptor.ts
  models               github.model.ts, post.model.ts
  services             github.service.ts, posts.service.ts
```