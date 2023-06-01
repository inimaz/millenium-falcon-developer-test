# Calculate the odds

To see full info about this, check [Exercise Readme]('./docs/README.md').

> **Note**: See the [TODO](TODO.md) page to see the things that are yet to be developed.

# How to use it

## CLI

Install Nodejs and NPM
go to the cli folder and install the cli.

```
cd cli
npm install -g .
```

Now you can run it doing

```
give-me-the-odds <path/to/millennium-falcon.json> <path/to/empire.json>
```

## BE

```
cd backend
npm install
npm start
```

There are 2 endpoints:

- GET **/routes** gives you all the routes
- POST **/odds** with body

  ```
  {
  "countdown": 8,
  "bounty_hunters": [
      {"planet": "Hoth", "day": 6 },
      {"planet": "Hoth", "day": 7 },
      {"planet": "Hoth", "day": 8 }
  ]
  }
  ```

  returns the odds in the format

  ```
  {
      "odds": 0
  }
  ```

### ENV VARIABLE

`MILLENIUM_FALCON_CONFIG_FILE`:string. (Optional) If mentioned, it directs to the local json file where the millenium-falcon.json file is stored.

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
