    npm ci

    :::info

    You should only ever install dependencies from the root of the repository. Don't try to install
    dependencies for individual client applications.

    :::
	
	
    ```bash
    git config blame.ignoreRevsFile .git-blame-ignore-revs
    ```
	
# Web Vault
	```bash
# Generate and install root CA
mkcert --install

# Generate cert valid for localhost, 127.0.0.1 and bitwarden.test
mkcert -cert-file dev-server.local.pem -key-file dev-server.local.pem localhost 127.0.0.1 bitwarden.test
```

## Build Instructions

1.  Build and run the Web Vault.

  <Community>

  ```bash
  cd apps/web
  npm run build:oss:watch
  ```

  </Community>

  <Bitwarden>

  ```bash
  cd apps/web
  npm run build:bit:watch
  ```
  
  
#Browser

## Requirements

Before you start, you must complete the [Clients repository setup instructions](../index.md).

## Build Instructions

1.  Build and run the extension:

    ```bash
    cd apps/browser
    npm run build:watch
    ```
	
## Environment Setup

By default, the browser extension will run pointing to the production server endpoints. To override
this for local development and testing, there are several options.

### Using `managedEnvironment`

The browser extension has the concept of a "managed environment", which is JSON configuration stored
in
[`development.json`](https://github.com/bitwarden/clients/blob/main/apps/browser/config/development.json),
within the `devFlags` object.

The `managedEnvironment` setting allows the contributor to override any or all of the URLs for the
server. The `managedEnvironment` is read in the
[`BrowserEnvironmentService`](https://github.com/bitwarden/clients/blob/main/apps/browser/src/services/browser-environment.service.ts)
and overrides the default (production) settings for any supplied URLs.

There are two ways to use `managedEnvironment`, depending upon whether you will also be running the
web vault at the same time.

#### `managedEnvironment` with web vault running

If you are also running the web vault, you only need to set the `base` URL in the
`managedEnvironment`:

```json
{
   "devFlags":{
      "managedEnvironment":{
         "base":"https://localhost:8080"
      }
      ...
   }
   ...
}
```

This is because the web vault includes the `webpack-dev-server` package in its
[`webpack.config.js`](https://github.com/bitwarden/clients/blob/main/apps/web/webpack.config.js).
When it is running, it proxies each of the endpoints based on the settings configured in its _own_
[`development.json`](https://github.com/bitwarden/clients/blob/main/apps/web/config/development.json)
configuration file:

```json
  "dev": {
    "proxyApi": "http://localhost:4000",
    "proxyIdentity": "http://localhost:33656",
    "proxyEvents": "http://localhost:46273",
    "proxyNotifications": "http://localhost:61840"
  },
```

This means that when the web vault is running, the browser `managedEnvironment` does **not** need to
override each of the URLs individually. The browser will format each URL as `{base}/{endpoint}`,
such as http://localhost:8080/api, but the webpack DevServer will proxy that URL to the correct
port, like http://localhost:4000.

#### `managedEnvironment` without web vault running

If you are testing the browser extension _without_ the web vault running, you will not be able to
take advantage of the webpack DevServer to proxy the URLs. This means that your `managedEnvironment`
setting must explicitly override all of the URLs with which you are going to be communicating
locally.

```json
{
    "devFlags": {
        "managedEnvironment": {
            "webVault": "http://localhost:8080",
            "api": "http://localhost:4000",
            "identity": "http://localhost:33656",
            "notifications": "http://localhost:61840",
            "icons": "http://localhost:50024"
        }
        ...
    }
    ...
}
```

### Goals
The goal of this repository is to implement a solution using webdriver.io to write, run, and report component, e2e, and performance tests against (eventually) all clients in this repo. We'll start with web and browser extension.