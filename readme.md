# Let's do webpack!


## Step 1
Let's make our `package.json` file

`$ npm init -y`

The `y` flag just automagically answers yes to all of the questions to give us a blank `package.json`. This is where we will set all of the npm modules, and node `scripts` we want to use as well as some basic information about the app. The cool thing about using `scripts` is that they can access the local `npm modules` that we install without having to add them globally to our shell environment. Groovy!

Let's add in `webpack`:

`$ npm i --save-dev webpack`

We install it with the `--save-dev` flag as we will add it as a `dev-dependency`, rather than a `dependency`, because it will now be available to us during development stage (eg. testing, builds) not application run time.

Now let's add a script to the `package.json` that runs `webpack` with the arguments entry point, and then an output.

```
#package.json
...
"scripts": {
    "start": "webpack ./app/index.js ./dist/app.js"
},
...
```

If that ran successfully, we should now have a new file appear in `dist/app.js` with some boiler code, and our console log. Nice!

If you open up the `./dist/index.html` file you should see the log appearing... magic!


## Step 2
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


## Step 3
`Babel` is a npm module that compiles JS with lots of different presets, to add features to our JS runtime that it doesn't otherwise have out of the box. First let's install it, and the presets we want to use:

`$ npm i --save-dev babel-core babel-preset-es2015 babel-preset-react babel-preset-stage-0`

Now that we have these installed into our `node_modules` we know need to somehow get them into our webpack config... For that there is loaders, for `babel` we use a module called `babel-loader`

`$ npm i --save-dev babel-loader`

Now we have that, let's add it to our `webpack.config.js`

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


## Step 4
Now let's sort out a proper development process. Currently we are having to view a local `index.html` file, and we have to refresh all the time. Wouldn't it be cool if we could get webpack to watch for our file, recompile our code and also refresh our browser for us? That would be nice, but how about instead of just reloading the entire page, it could just refresh the parts of the code that we changed without needing to reload the page entirely so that we can keep the state of our app?

Well, with the power of `webpack-dev-server` and `hot-module-replacement` all of that is possible. First we will need to create a small web server with `webpack-dev-server` that will load in our webpack config and render our application for us. As well as that we will need to inject in some `hot-module-replacement` into our application so that it will listen to the server for any changes, and hot-replace the needed code out.

First things first, let's install some packages that we will need:

`$ npm i --save-dev webpack-dev-server`

create a node server:

```
# /devServer.js

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const opn = require('opn');

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


## Step 5

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


## Step 6
Now that we've got the basics covered, let's add in some more loaders, so that we can handle more of our assets like images, and css.

Firstly, we'll get an image, and throw it into our `/app` folder. From there we can import it into our JS, so that webpack knows about it.

```
# /app/index.js
...
import dogImage from './dog.jpg';

const App = () => (
    <div>
        <p>Hello world!</p>
        <img src={dogImage} alt="It's a cute dog!" />
    </div>
);
...
```

If we run `$ npm run watch` we will see that our app has an error, that if can't find `dog.jpg`, that's because webpack doesn't know how to process that file, so let's add in a loader for that now.

First, let's install the appropriate loader, we will use `url-loader`. This moves all imported files into the output directory.

`$ npm i --save-dev url-loader`

Then let's setup our webpack config:

```
# webpack.config.js

module.exports = {
    ...
    module: {
        loaders: [
            ...
            {
                test: /\.(gif|jpg|jpeg|png)$/,
                loader: 'url-loader?limit=10000&name=images/[hash:8].[ext]',
                include: appPaths,
            },
    ...
```
You can see we're now looking for any files finishing in `gif`, `jpg`, `jpeg`, or `png`. Also when we are loading in the `url-loader` we are also setting some options. The `limit` sets how large an image has to be before it's saved as a seperate file. So if it's under the Byte limit then it will just inline the image as a data-url, which is handy for small images as the browser won't take a round trip to the server for the file.

## Step 7

Now let's add in some css!

```
# /app/styles.css
.container {
    background: pink;
    margin: 20px auto;
    max-width: 400px;
}
```

Next, import it into our `index.js` and add the `container` class into our app.

```
# /app/index.js
...
import styles from './styles.css';
...
const App = () => (
    <div className={"container"}>
...
```

If we run the app, we will be at the same issue with webpack not being able to process the css file, so let's install the loaders well need and set up the config file.
`$ npm i --save-dev css-loader style-loader`

Now our config:
```
# webpack.config.js
...
    module: {
        loaders: [
            ...
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader'],
                include: appPaths,
            }
        ]
    },
    ...
```

The `css-loader` is responsible for processing the css, where the `style-loader` then grabs all of the styles and injects them into a `<style />` tag into the head of a document. So if we re-run our app: `$ npm run watch` everything should be looking nice and pink!

Now css can get a little messy with naming conflicts, there are practices like BEM out there which can help, although another way to work around this issue is to use css-modules, which is a way that you locally allocate styles to individual components of your application. The way this works is that you inject the styles into the component as a `className`, then the `css-loader` can roll through and rename the css to a unique string. So let's change up our `/app/index.js` now:

```
# /app/index.js
...
const App = () => (
    <div className={styles.container}>
...
```

Now let's change up our `css-loader` to generate all our `className`s.

```
# webpack.config.js
...
{
    test: /\.css$/,
    loaders: ['style-loader', 'css-loader?modules&localIdentName=[name]__[local]___[emoji]'],
}
...
```

Now when we run the app, the `.container` class is rendered like this: `styles__container___🌋`. Mmmm.... nice.

We can continue to chain loaders, that will do more things to the files we choose to pass in. For css files, for instance, we can add in a loader called `post-css`. It contains lots of css pre-processesors that can help us out. One of the most popular css pre-processes to use is called `autoprefixer`, which will add in prefixes to all of our non-standard css properties. So we can just use `transform` in our css, and it will add in a `-ms-transform` and `-webkit-transform` in build time. That will save us oodles of time!

`$ npm i --save-dev postcss-loader auto-prefixer`


Now let's add the `postcss-loader` into the css loaders, and we need to setup the postcss options within the base config object.

```
# webpack.config.js
module.exports = {
    ...
    module: {
        loaders: [
            ...
            {
                test: /\.css$/,
                loaders: [
                    'style-loader',
                    'css-loader?modules&localIdentName=[name]__[local]___[emoji]',
                    'postcss-loader'
                ],
                ...
            }
        ],
    },
    ...
    postcss: [ autoprefixer ],
    ...
};
 ```

 Now if we wanted to add a pre-processor like `less`, `sass` or `stylus`, we would just need to install the npm package, and the corrosponding loader, and just append the loader into our config. So if we wanted to use `stylus`:

 `$ npm i --save-dev stylus stylus-loader`

 Followed by:

```
# webpack.config.js
module.exports = {
    ...
    module: {
        loaders: [
            ...
            {
                test: /\.css$/,
                loaders: [
                    'style-loader',
                    'css-loader?modules&localIdentName=[name]__[local]___[emoji]',
                    'postcss-loader',
                    'stylus-loader'
                ],
                ...
```

And now we have `stylus` up and running. Woohoo!
