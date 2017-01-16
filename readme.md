## Let's do webpack!

# Step 1
Let's make our `package.json` file

`$ npm init -y`

The `y` flag just automagically answers yes to all of the questions to give us a blank `package.json`. This is where we will set all of the npm modules, and node `scripts` we want to use as well as some basic information about the app. The cool thing about using `scripts` is that they can access the local `npm modules` that we install without having to add them globally to our shell environment. Groovy!

Let's add in `webpack`:

`$ npm i --save-dev webpack`

We install it with the `--save-dev` flag as we will add it as a `dev-dependency`, rather than a `dependency`, because it will now be available to us during development stage (eg. testing, builds) not application run time.

Now let's add a script to the `package.json` that runs `webpack` with the arguments entry point, and then an output.

```#package.json
...
"scripts": {
    "start": "webpack ./app/index.js ./dist/app.js"
},
...
```

If that ran successfully, we should now have a new file appear in `dist/app.js` with some boiler code, and our console log. Nice!

That's all well and good, but our webpack config is going to get pretty big pretty soon, so having it squished into one line of our `package.json` isn't best. Luckily for us we can move it into a file in the root directory called `webpack.config.json` that will automagically be picked up by `webpack`. Neat-o!

``` # /webpack.config.js
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: [
        './app/index.js',
    ],
    output: {
        publicPath: '/dist/',
        path: path.resolve(__dirname, './dist'),
        filename: 'app.js',
    }
}
```

Now let's just remove the config params from our script in `package.json`

``` # /package.json
...
"scripts": {
  "start": "webpack"
},
...
```

Now run the build again...

`$ npm run start`

...and bang! Same result
