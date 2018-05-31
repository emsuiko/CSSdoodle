# doodleCSS-what?

Remember passing along notes in class? Sometimes just doodling down something and the friend next to you added to it and the one next to them etc.pp. and eventually a nice little fun piece of doodle art was created.
CSSDoodle is just that, well... a little more tech-y maybe. ;)

# How to contribute

## Create a new tile

This project uses [pug](https://pugjs.org/api/getting-started.html) for templating and [SASS](https://sass-lang.com/) for styling.

1. fork this repository
2. open terminal and run `npm install`
3. run `gulp tile` will create your personal tile files. The name is a random string. The name of your tile (and hence the name of your pug and sass) is logged on the console. You can find your tile template in src/pug/tiles and your style file in src/sass/tiles. They are automatically added to index.pug and styles.sass
4. run `gulp` to build the current state of the doodle. A new browser sync session will open in your browser via `localhost:3000`.
5. open your favourite editor or IDE and start coding. The pug and sass files will be automatically processed while gulp (watch) is still running in your terminal; browser sync makes sure to refresh your page automatically too.
6. open a pull request.

## Guidlines
Some guidelines for your doodle...

### Content
It's entirely up to you what you are creating. Please remember: be kind and have fun!
You can place your tile anywhere on the canvas but please don't overlap other CSS-artists tiles (entirely). "Interacting" with other commponents is fine though.
Please refrain from using words or depiction of sexism, racism, hate or anything along these lines - on your tile and in your code too!

### Development
- The canvas has a fixed size of 1440x900px - please don't change this.
- Every tile is initially set to a fixed size of 100x100px - you can change this for your tile if you like. Remember: This is a community thingy, please don't use too much space.
- You can add as much or as little elements to your tile as you like. It doesn't have to be just a single div image.
- HTML (pug) and CSS (sass) only please! :)
- add your IDE/editor specific configuration to .gitignore if necessary

