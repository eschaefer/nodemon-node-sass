### Example: Using `node-sass` with `nodemon`

```
yarn run watch:styles
```

#### What happens

`nodemon` watches for any changes in the `./styles` directory. If a change is detected, then `node-sass`
is re-executed within `node-sass-server.js`.

You may edit `node-sass-server.js` to configure any PostCSS options, or to add entrypoints and destination files.

I wanted to do this as a proof of concept without Gulp. Feel free to fork and give feedback.
