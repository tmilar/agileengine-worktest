# Agile Engine Worktest

## Summary

Task Requirements: https://agileengine.gitlab.io/interview/test-tasks/beQwwuNFStubgcbH/

Solution implemented using Typescript, ESLint+Prettier, ts-node, and Express.
Some tests have been provided as well, implemented with Mocha & Chai, and Nock for HTTP mock requests.

## Instructions

### Setup

```
npm install
```

## Testing

```
npm test
```

## Running

```
npm start
```

This will run a server in http://localhost:3000

### API

#### GET /images?page=N

Returns page N of pictures from AgileEngine server. `page` arg is optional (defaults to 1)

Sample response:

```json
{
  "pictures": [
    {
      "id": "e9e5c1d285a133340fe2",
      "cropped_picture": "http://interview.agileengine.com/pictures/cropped/0002.jpg"
    },
    {
      "id": "cd85b786f16086648115",
      "cropped_picture": "http://interview.agileengine.com/pictures/cropped/0015.jpg"
    },
    {
      "id": "a19cc2b0625ae986c0da",
      "cropped_picture": "http://interview.agileengine.com/pictures/cropped/0019.jpg"
    },
    {
      "id": "0aabc9810de2bf8e33a1",
      "cropped_picture": "http://interview.agileengine.com/pictures/cropped/0020.jpg"
    }
  ],
  "page": 1,
  "pageCount": 26,
  "hasMore": true
}
```

#### GET /image/:id

Returns detailed data of an image, speficied by `id`.

Sample response:

```json
{
  "id": "e9e5c1d285a133340fe2",
  "author": "Back Boss",
  "camera": "Sony Cyber-shot RX10 III",
  "tags": "#wonderfullife ",
  "cropped_picture": "http://interview.agileengine.com/pictures/cropped/0002.jpg",
  "full_picture": "http://interview.agileengine.com/pictures/full_size/0002.jpg"
}
```

#### GET /search/:searchTerm

Returns a collcetion of detailed pictures that match the specified search term(s):

Sample request:

```
GET /search/greatview%20wonderfulday%20nikon%20today%20beauty
```

Sample response:

```json
[
  {
    "id": "7eaef63f1d827887cc15",
    "author": "Second-hand Month",
    "camera": "Nikon D800E",
    "tags": "#beauty #photooftheday #beautifulday #photography #today #greatview #nature #view #wonderfulday ",
    "cropped_picture": "http://interview.agileengine.com/pictures/cropped/01.jpg",
    "full_picture": "http://interview.agileengine.com/pictures/full_size/01.jpg"
  },
  {
    "id": "9ae98ce0c11de16ef8c4",
    "author": "Mellow Afternoon",
    "camera": "Nikon Z50",
    "tags": "#today #greatview #photooftheday #photography #wonderfulday #photo #beauty #whataview #view ",
    "cropped_picture": "http://interview.agileengine.com/pictures/cropped/1.jpg",
    "full_picture": "http://interview.agileengine.com/pictures/full_size/1.jpg"
  },
  {
    "id": "80bc42f438a66554e53d",
    "author": "Buttery Advice",
    "camera": "Nikon Z6 (our top all-round camera)",
    "tags": "#today #greatview #wonderfulday #view #nature #beauty #photooftheday ",
    "cropped_picture": "http://interview.agileengine.com/pictures/cropped/30sc044.jpg",
    "full_picture": "http://interview.agileengine.com/pictures/full_size/30sc044.jpg"
  },
  {
    "id": "992ca872d355b6fe1857",
    "author": "Unlucky Repair",
    "camera": "Nikon D850 ",
    "tags": "#beauty #whataview #wonderfulday #greatview #today #natureisbeautiful #photography #photo ",
    "cropped_picture": "http://interview.agileengine.com/pictures/cropped/672025.jpg",
    "full_picture": "http://interview.agileengine.com/pictures/full_size/672025.jpg"
  },
  {
    "id": "39ea3db66902deb88cc5",
    "author": "Monumental Husband",
    "camera": "Nikon D800E",
    "tags": "#beautifulday #greatview #nature #today #photo #view #beauty #wonderfullife #wonderfulday ",
    "cropped_picture": "http://interview.agileengine.com/pictures/cropped/672051.jpg",
    "full_picture": "http://interview.agileengine.com/pictures/full_size/672051.jpg"
  }
]
```

## Deploy

No deployment scripts have been provided since this was considered to be out of scope. But it could be easily done by using tsc to build JS sources, and deploy the build to a platform like Heroku.
