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

If you open up the `./dist/index.html` file you should see the log appearing... magic!


#Step 2
Now let's make use of webpack's module loading by adding in some npm packages that we know we'll need. How about some react?

`$ npm i --save react react-dom`

Now with the power of webpack's module loader we can use `require` to load in our npm modules.

```
# app/index.js

var React = require('react');
var ReactDOM = require('react-dom');

function App () {
    return React.createElement('div', null, 'Hello world');
}
var appComponent = React.createElement(Hello, {}, null);
var rootElement = document.getElementById('app');

ReactDOM.render(appComponent, rootElement);
```

Now if we run `npm run start` again we can see that it all work's nicely. Yay! Our react app is on it's way!

Although, our code looks a little ugly doesn't it? Wouldn't it be nice if we had ES6 features so we could take use of `export` and `import` instead of `require` and `module.exports`? But our webpack currently doesn't know how to deal with those features. So we will need to add in some middleware that can process these new features. Enter `webpack loaders`.


# Step 3
`Babel` is a npm module that compiles JS with lots of different presets, to add features to our JS runtime that it doesn't otherwise have out of the box. First let's install it, and the presets we want to use:

`$ npm i --save-dev babel-core babel-preset-es2015 babel-preset-react babel-preset-stage-0`

Now that we have these installed into our `node_modules` we know need to somehow get them into our webpack config... For that there is loaders, for `babel` we use a module called `babel-loader`

`$ npm i --save-dev babel-loader`

Now we have that, let's add it to our webpack config

```
# webpack.config.js

const appPaths = [
  path.resolve(__dirname, 'app'),
];

module.exports = {
...
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: appPaths,
            },
        ],
    }
...
```

Here you can see we are adding babel-loader into the loaders. The `test` is a regex expression that will run through any filename passed through webpack, and if it's truthy will be passed into the `babel-loader`. The other property `include` will make sure that the file appears in these pathnames, we do this because we don't want files in other areas, like `node_modules` to be babelifed again.

Now we need to set up our babel config file, which will automatically be picked up by the `babel-loader`.

```
# /.babelrc
{
    "presets": [
        "es2015",
        "react",
        "stage-0"
    ]
}
```

Alright, let's see if it works: Let's change our `app/index.js` to some cool `jsx` and some `es2015`.

```
# /app/index.js

import React from 'react';
import ReactDOM from 'react-dom';

const App = () => (<div>Hello world</div>);
var rootElement = document.getElementById('app');

ReactDOM.render(<App />, rootElement);
```

How much nicer does that look? HEAPS!


# Step 4
Now let's sort out a proper development process. Currently we are having to view a local `index.html` file, and we have to refresh all the time. Wouldn't it be cool if we could get webpack to watch for our file, recompile our code and also refresh our browser for us? That would be nice, but how about instead of just reloading the entire page, it could just refresh the parts of the code that we changed without needing to reload the page entirely so that we can keep the state of our app?

Well, with the power of `webpack-dev-server` and `hot-module-replacement` all of that is possible. First we will need to create a small web server with `webpack-dev-server` that will load in our webpack config and render our application for us. As well as that we will need to inject in some `hot-module-replacement` into our application so that it will listen to the server for any changes, and hot-replace the needed code out.

First things first, let's install some packages that we will need:

`$ npm i --save-dev webpack-dev-server`

create a node server:

```
# /devServer.js

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const config = require('./webpack.config');
const port = 3000;

new WebpackDevServer(webpack(config), {
    hot: true,
    historyApiFallback: true
}).listen(port, 'localhost', error => {
    if (error) {
        console.log(error);
    }
});

```

This basically creates a new `WebpackDevServer` instance, grabs our webpack config and then sets then serves up the http server at the port we have requested `3000`. This is all that's needed for the server side, now let's add some code to our client app so it can talk nicely to the server.

If we want to add more code into our app through webpack, we can just add more entries to our config. While we are at it, we need to add in the `HotModuleReplacementPlugin` to our config:

```
# webpack.config.js
...
module.exports = {
    entry: [
        './app/index.js',
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/dev-server',
    ],
...
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],
...
```

Now that we have that client-side hot-reload code in our client app, we should init it within our code. To do that we just need to call a simple method at the bottom of our `/app/index.js`

```
# /app/index.js
...
if (module.hot) {
	module.hot.accept();
}
```

So now, we should have a new devServer watching over our webpack build and making the changes to the app on our browser on the fly. So let's add this in as a new script within `package.json` and give it a whirl:

```
# /package.json
...
scripts: [
    watch: 'node devServer.js'
...
```

Now just run `$ npm run watch` and our new devServer should fire up a browser window of our app!


# Step 5

You may have noticed that we have polluted our nice clean application with lots of boilerplate to get Hot Module Replacement working, which is fine for development, but we don't want it to be bundled when we deploy. So let's add a environment variable to our builds where we can conditionally load in what we need in both `development` and `production` situations. Firstly, let's add the variable to our scripts.

```
# /package.json
...
"scripts": {
  "build": "NODE_ENV=production webpack",
  "watch": "NODE_ENV=development node devServer.js"
},
...
```

Now we can access this environment variable using nodes `process.env` object within our build.

```
# /webpack.config.js
...
const isProduction = process.env.NODE_ENV === 'production';

const entry = isProduction
    ? [
        './app/index.js',
    ]
    : [
        './app/index.js',
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/dev-server',
    ];

const plugins = isProduction
    ? [
        new webpack.optimize.UglifyJsPlugin()
    ]
    : [
        new webpack.HotModuleReplacementPlugin(),
    ];
...
module.exports = {
    entry: entry,
    ...
    plugins: plugins,
    ...
```
As you can see this can get very messy after a while with a lot of if/else or tuneries. Because of this some people lean towards using entirely seperate configs for server and client rendering. Or others have a base config, that they then import into both their client and server configs and edit that base with pure JS, or enlist a npm package called [webpack-merge](https://www.npmjs.com/package/webpack-merge) that does a deep merge of both objects, very simularly to `Object.assign()`

You may have noticed that we snuck in another plugin to our config called `webpack.optimize.UglifyJsPlugin()`. This as the name suggests will uglify our code anytime we build with the `production` flag.
