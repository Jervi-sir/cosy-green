module.exports = {
  apps: [
    {
      name: "cozy-green-server",
      cwd: "/home/jervi/projects/cosy-green/server",
      script: "index.ts",
      interpreter: "./node_modules/.bin/tsx",
      env: {
        NODE_ENV: "production",
        PORT: 6037,
        HOST: "127.0.0.1"
      }
    }
  ]
}