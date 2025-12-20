# AdonisJS AT Protocol Tap

This package provides a small [Adonis.js](https://adonisjs.com) provider and services for `@atproto/tap`, which allows interacting with [Tap](https://docs.bsky.app/blog/introducing-tap) for AT Protocol development.

## Installation

```sh
node ace add @thisismissem/adonisjs-atproto-tap
```

### Configuring

If you didn't use `node ace add` you can later run the configuration using:

```sh
node ace configure @thisismissem/adonisjs-atproto-tap
```

## Indexer

The Tap Indexer (`SimpleIndexer`) can be accessed using:

```ts
import indexer from '@thisismissem/adonisjs-atproto-tap/services/indexer'
```

If you've installed using the instructions above, you will have the file `start/indexer.ts` created, which is where you can add the logic to handle the events from Tap. The provider automatically connects the `indexer.error()` handler to the [Adonis.js logger](https://docs.adonisjs.com/guides/digging-deeper/logger).

You can find out more in the [`@atproto/tap` documentation](https://github.com/bluesky-social/atproto/blob/main/packages/tap/README.md)

## Tap API

The Tap Client API for adding and removing repositories, resolving DIDs and such is accessible via:

```ts
import tap from '@thisismissem/adonisjs-atproto-tap/services/tap'
```

Which provides the following methods for interacting with the Tap server:

- `addRepos(dids: string[]): Promise<void>` - Add repos to track (triggers backfill)
- `removeRepos(dids: string[]): Promise<void>` - Stop tracking repos
- `resolveDid(did: string): Promise<DidDocument | null>` - Resolve a DID to its DID document
- `getRepoInfo(did: string): Promise<RepoInfo>` - Get info about a tracked repo

## Docker Setup for Tap

To run Tap locally, you'll likely want a `docker-compose.yaml` file with the following contents:

```yaml
services:
  tap:
    image: ghcr.io/bluesky-social/indigo/tap:latest
    platform: linux/amd64
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:2480/health"]
      interval: 2s
      retries: 5
      start_period: 10s
      timeout: 10s
    volumes:
      - ./data/tap:/data
    env_file: tap.env
    environment:
      TAP_BIND: :2480
    ports:
      - "127.0.0.1:2480:2480"
```

The `tap.env` file looks like:

```sh
TAP_SIGNAL_COLLECTION=fyi.questionable.actor.profile
TAP_COLLECTION_FILTERS=fyi.questionable.*
TAP_ADMIN_PASSWORD=admin-password
```

For the full configuration see the [Tap documentation](https://github.com/bluesky-social/indigo/blob/main/cmd/tap/README.md). You cannot use `TAP_WEBHOOK_URL` with this package, since it depends on the WebSocket interface.
