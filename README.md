# Calculate the odds

To see full info about this, check [Exercise Readme]('./docs/README.md').

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
