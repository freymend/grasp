# Grasp

The repo is split into two parts. `app/` contains the frontend cdn and `server/` contains the backend server. Any shared dependencies are in the root directory. Both directories have their own `package.json` files for dependencies specific to their directory. Even though there are multiple `package.json` files, you can install all dependencies by running `npm install` in the root directory.

## Installation

1. Install [Node.js](https://nodejs.org/en/download/)

2. Install the project dependencies

   ```shell
   npm install
   ```

3. Run the setup script

   ```shell
   npm run setup
   ```

## Deployment

Deployment is done using [Fly](https://fly.io/). If you don't have an account, you can create one [here](https://fly.io/app/sign-up). Once you have an account, you can deploy the app and server using the following commands:

### app

```shell
cd app/
fly launch
fly deploy
```

### server

```shell
cd server/
fly launch
fly deploy
```

You should have access to the fly cli if you ran `npm run setup`.

## Contact

If you have any questions, feel free to reach out to me at [here](mailto:zachaz@uw.edu).
