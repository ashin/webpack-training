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

Now we have that, let's add it to our `webpack.config.js`

``` # webpack.config.js

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

``` # /.babelrc
{
    "presets": [
        "es2015",
        "react",
        "stage-0"
    ]
}
```

Alright, let's see if it works: Let's change our `app/index.js` to some cool `jsx` and some `es2015`.

``` # /app/index.js

import React from 'react';
import ReactDOM from 'react-dom';

const App = () => (<div>Hello world</div>);
var rootElement = document.getElementById('app');

ReactDOM.render(<App />, rootElement);
```

How much nicer does that look? HEAPS!
