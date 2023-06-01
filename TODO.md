# TODO

## BE

- [x] Basic REST server + sqlite connection (JSON input)
- [x] Insert initial routes data + drop old table every launch
- [ ] Allow to upload JSON
- [x] Calculate shortest path betweeen 2 planets
- [x] Use countdown + bounty hunters
- [x] Allow config file for millenium falcon
- [ ] Take into consideration the max fuel of the ship + allow to rest 1 day into the planet
- [ ] Apply the algorithm (see below section)

## FE

- [ ] Simple FE to upload JSON
- [ ] CLI

# About the algorithm

We started using dijkstra algorithm to find the shortest path in between 2 planets. This works well for minimizing distance. But in this case we want to minimize distance AND odds of being caught. So we have to maximize for a ficticious distance that is a combination of the 2 factors.

For now the combination used is

```
newDistance = sqrt((oldDistance)^2 + (X)^2)
```

where this X is Infinity if there is a bounty hunter and 0 if there is none. In the future we can try to find the ideal X for each case so the ship takes sometimes the path even though there might be hunters.

With this new distance, we use the following algorithm:

1. we calculate the shortest path ignoring the hunters
2. If it does not exist --> there is no possible path
3. If there are no hunters in this path --> this is the wanted path let's call it `shortPathNoHunters`
4. If there are hunters in this path, calculate the shortest path avoiding the hunters
5. If this path exists --> this is the wanted path let's call it `shortPathWithHunters`
6. If the path does not exist --> we know the number of capture tries of `shortPathNoHunters`, we know that this is the worst case.
