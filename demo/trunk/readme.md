# dwv-jqui

Medical viewer using [DWV](https://github.com/ivmartel/dwv) (DICOM Web Viewer) and [jQuery UI](http://jqueryui.com/).

All coding/implementation contributions and comments are welcome. Releases should be ready for deployment otherwise download the code and install dependencies with a `yarn` or `npm` `install`.

dwv-jqui is not certified for diagnostic use. Released under GNU GPL-3.0 license (see [license.txt](license.txt)).

[![Node.js CI](https://github.com/ivmartel/dwv-jqui/actions/workflows/nodejs-ci.yml/badge.svg)](https://github.com/ivmartel/dwv-jqui/actions/workflows/nodejs-ci.yml)

## Steps to run the viewer from scratch

Get the code:

```sh
git clone https://github.com/ivmartel/dwv-jqui.git
```

Move to its folder:

```sh
cd dwv-jqui
```

Install dependencies (using `yarn`, replace with `npm` if you prefer):

```sh
yarn install
```

Call the start script to launch the viewer on a local server:

```sh
yarn run start
```

You can now open a browser at http://localhost:8080 and enjoy!

## Available Scripts

```bash
# install dependencies
yarn install

# serve at localhost:8080 with live reload
yarn run start

# serve a developement version at localhost:8080 with live reload
yarn run dev

# run unit tests
yarn run test
```
