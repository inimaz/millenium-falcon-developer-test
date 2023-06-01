# TODO

## BE

- [x] Basic REST server + sqlite connection (JSON input)
- [x] Insert initial routes data + drop old table every launch
- [ ] Allow to upload JSON
- [x] Calculate shortest path betweeen 2 planets
- [x] Use countdown + bounty hunters
- [x] Allow config file for millenium falcon
- [x] Take into consideration the max fuel of the ship + allow to rest 1 day into the planet
- [x] Add max allowed bounty hunters param (so that we can try with k =1,2,3... N)
- [~] Apply the full algorithm [(see this section in the README)](README.md#about-the-algorithm)

## FE

- [ ] Simple FE to upload JSON
- [x] CLI

# Bug

- [ ] When there is more time than the one needed for shortestpath, it does not find alternative paths. Launch examples 3 and 4 of [the docs](./docs/examples/) and debug this
