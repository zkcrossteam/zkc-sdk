# zkc-sdk

The zkc-sdk is a free and open-source toolkit for building zkWasm-based modular rollups.

It consists of the following components:

- rollup interface: a minimal set of interfaces that defines zkWasm rollup application.
- jsenv: A host environment for Wasm application to use module services.
- prover adaptor: Connect to zkWasm proving network.
- contract proxy: Communicate with on-chain settlement rollup smart contract.
- ...

## Releasing

Deploy Application

```bash
git checkout main
git tag v0.4.0  # this version tag comes from ./package.json
git push origin main --tags
```

Publish a new release at https://github.com/zkcrossteam/zkc-sdk/releases/new, which will trigger an automated GitHub action to deploy the latest SDK version to npm.
