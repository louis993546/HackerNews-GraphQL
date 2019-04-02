# HackerNews GraphQL wrapper

- Wrap the [HackerNews API](https://github.com/HackerNews/API)
- Should help reduce the HTTP requests the client needs to send
- Power by [`gqlgen`](https://github.com/99designs/gqlgen)

## TODO

- [ ] All the resolvers
- [ ] Dataloader (n+1 problem when fetching user of any `Item`)
- [ ] Build doc
- [ ] Docker Image