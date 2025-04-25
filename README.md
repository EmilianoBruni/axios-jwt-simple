# axios-jwt-simple - An axios replacement for automatic JWT management

[![npm package](https://img.shields.io/npm/v/axios-jwt-simple.svg)](http://npmjs.org/package/axios-jwt-simple)
[![Build workflow](https://github.com/EmilianoBruni/axios-jwt-simple/actions/workflows/build.yml/badge.svg)](https://github.com/EmilianoBruni/axios-jwt-simple/actions/workflows/build.yml)
[![Coverage Status](https://coveralls.io/repos/github/EmilianoBruni/axios-jwt-simple/badge.svg?branch=master)](https://coveralls.io/github/EmilianoBruni/axios-jwt-simple?branch=master)
![Last Commit](https://img.shields.io/github/last-commit/EmilianoBruni/axios-jwt-simple)
[![Dependencies](https://img.shields.io/librariesio/github/EmilianoBruni/axios-jwt-simple)](https://libraries.io/npm/axios-jwt-simple)
![Downloads](https://img.shields.io/npm/dt/axios-jwt-simple)

`axios-jwt-simple` is a Node.js library that simplifies client-side JWT (JSON Web Token) authentication using Axios. It provides an easy-to-use interface for managing JWT tokens, attaching them to requests, and handling token expiration seamlessly. This library is particularly useful for applications that require secure communication with APIs using JWT-based authentication.

The peculiarity is that if you don't use automatic JWT management (`jwtInit` method), it's simply axios with another name :-)

## Features

- **Automatic Token Management**: Automatically attaches JWT tokens to Axios requests.
- **Token Refresh**: Handles token expiration and refresh seamlessly.
- **Customizable**: Easily configure token storage and refresh logic.
- **CommonJS and TypeScript Support**: Works with both CommonJS and ES Modules, with full TypeScript type definitions.

## When to Use

`axios-jwt-simple` is ideal for:

- Applications that use JWT for authentication and need to attach tokens to API requests.
- Projects requiring automatic token refresh when tokens expire.
- Developers looking for a lightweight and easy-to-integrate solution for managing JWTs with Axios.

## Installation

You can install `axios-jwt-simple` using your preferred package manager:

### Using `pnpm`

```sh
pnpm add axios-jwt-simple
```

### Using `npm`

```sh
npm install axios-jwt-simple
```

### Using `yarn`

```sh
yarn add axios-jwt-simple
```

## Usage

### Initialization

To use `axios-jwt-simple`, you can simply use as it was `axios`

```ts
import ajs from 'axios-jwt-simple';

const url = 'https://mockhttp.org/get';

const response = await ajs.get(url);
```

but if you call `jwtInit` it enter in Automatic token managed

```ts
import ajs from 'axios-jwt-simple';

const baseUrl = 'https://mockhttp.org/';

ajs.jwtInit(baseUrl)
```
## Automatic token managed

In this mode, ajs automatically manage jwt and refresh token. 

If refresh token and access token don't exist or are invalid/expired, ajs make a POST to `ajs.pathLogin` to get new access and refresh tokens.

If access token doesn't exist or is invalid/expired with a valid refresh token ajs make a GET to `ajs.pathRefresh` to get new access token.

If a resource has called, ajs get a valid access token with the previous logic and then call the resource with the Autorization header with `Bearer accessToken`.

## Methods

### .jwtInit: ( urlBase: string, onLoginRequest?: AjsOnRequest, onLoginResponse?: AjsOnResponse) => void;

where 

* `urlBase`: The base URL for the API.
* `onLoginRequest`: Optional custom handler for login requests to alter config request when `pathLogin` is called (see `onLoginRequest` method).
* `onLoginResponse`: Optional custom handler for login responses to alter response when `pathLogin` respond (see `onLoginResponse` method)

### onLoginRequest

### onLoginResponse

### onRefreshRequest

### onRefreshResponse

## Parameters

### pathLogin

### pathRefresh

### pathLogout

## CommonJS Support

If you're using CommonJS, you can import the library as follows:

```js
const ajs = require('axios-jwt-simple');

const baseUrl = 'https://mockhttp.org/';

ajs.jwtInit(baseUrl)
```

## TypeScript Support

`axios-jwt-simple` is fully typed and works seamlessly with TypeScript. 

## FAQ

### How does `axios-jwt-simple` handle token expiration?

The library allows you to define a `refreshToken` function that is called when a token expires. This function should handle refreshing the token and returning a new one.

### Can I use this library with React or Vue?

Yes, `axios-jwt-simple` works with any JavaScript framework or library that uses Axios for HTTP requests.

### Is the library compatible with server-side rendering (SSR)?

Yes, but you need to ensure that token storage and retrieval are compatible with your SSR environment (e.g., using cookies instead of `localStorage`).

## Links

- **Report Bugs**: [GitHub Issues](https://github.com/your-repo/axios-jwt-simple/issues)
- **Feature Requests**: [GitHub Issues](https://github.com/your-repo/axios-jwt-simple/issues)
- **Help and Support**: [GitHub Discussions](https://github.com/your-repo/axios-jwt-simple/discussions)
- **Contributing**: [Contributing Guidelines](https://github.com/your-repo/axios-jwt-simple/blob/main/CONTRIBUTING.md)

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](https://github.com/your-repo/axios-jwt-simple/blob/main/CONTRIBUTING.md) for more details.


