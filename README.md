# artnet-observable

Receive parsed Art-Net packages through a rx-Observable.


# Install

`npm install --save artnet-observable`

# Usage

```js
const sub = createArtNetObservable().subscribe((package) => console.log(package));
```


# Author

[@platdesign](https://twitter.com/platdesign)

