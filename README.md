# CSSdoo-what?

Remember passing along notes in class? Sometimes just doodling down something and the friend next to you added to it and the one next to them etc.pp. and eventually a nice little fun piece of doodle art was created.
CSSDoodle is just that, well... a little more tech-y maybe. ;)

Here's the current doodle: [https://emsuiko.github.io/CSSdoodle/](https://emsuiko.github.io/CSSdoodle/)

# TL;DR
1. fork and clone
2. `npm install --production`
3. `gulp tile`
4. `gulp watch` --> `localhost:3000`
4. style your tile
5. open pull request

# How to contribute

## Requirements

- [npm](https://www.npmjs.com/get-npm)

## Create a new tile

This project uses [pug](https://pugjs.org/api/getting-started.html) for templating and [SASS](https://sass-lang.com/) for styling.

1. fork and clone this repository
2. open terminal, navigate to your project repository and run `npm install --production`
3. run `gulp tile` to create your personal tile files.  
The name of your tile (and hence the name of your pug and sass) is a random string and will be logged on the console.  
You can find your tile template in `src/pug/tiles` and your style file in `src/sass/tiles`. They are automatically added to `index.pug` and `styles.sass`
4. run `gulp watch` to build the current state of the doodle. A new browser sync session will open in your browser via `localhost:3000`.
5. open your favourite editor or IDE and start coding. The pug and sass files will be automatically processed while gulp (watch) is still running in your terminal; browser sync makes sure to refresh your page automatically too.
6. when you are satisfied with your doodle, open a pull request.

## Guidlines
Some guidelines for your doodle...

### Content
It's entirely up to you what you are creating. Please remember: be kind and have fun!  
You can place your tile anywhere on the canvas but please don't overlap other CSS-artists tiles (entirely). "Interacting" with other commponents is fine though.
Please refrain from using words or depiction of sexism, racism, hate or anything along these lines - on your tile and in your code too!

### Development
- The canvas has a fixed size of 1440x900px - please don't change this.
- Every tile is initially set to a fixed size of 100x100px - you can change this for your tile if you like. Remember: This is a community thingy, please don't use up too much space.
- The tiles are placed with `position: absolute`, relative to the canvas. You can move them inside the canvas with the top/bottom/right/left properties.
- You can add as much or as little elements to your tile as you like. It doesn't have to be just a single div image.
- HTML (pug) and CSS (sass) only please! :)
- add your IDE/editor specific configuration to `.gitignore` if necessary

## History

The evolution of the canvas is tracked via screenshots on the history page. (I'll add your line after merging your pull request.)

You can add it yourself if you like, though.

Here's how...
### Prerequisites
You need to have installed following tools on your computer:

For taking the screenshot the package [gulp-webshot](https://www.npmjs.com/package/gulp-webshot) is used.  
It needs:
- [phantomjs](http://phantomjs.org/)

For creating the thumbnail the package [gulp-image-resize](https://www.npmjs.com/package/gulp-image-resize) is used.  
It needs:
- imagemagick
- graphicsmagick

phantomjs, imagemagick and graphicsmagick won't be installed through npm!

### Add your history entry
1. open terminal, navigate to your project repository and run `npm install` to install devDependencies w/ aforementioned packages.
2. run `gulp screenshot` to take the screenshot and generate the thumbnail. The filenames match your tilename.
3. run `gulp history` with your github account name as `name` parameter, e.g. `gulp history --name emsuiko`, to add a new row in the `pug/history`. 