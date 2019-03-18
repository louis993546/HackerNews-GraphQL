//go:generate go run github.com/99designs/gqlgen
package hackernewsgraphql

import (
	"context"
) // THIS CODE IS A STARTING POINT ONLY. IT WILL NOT BE UPDATED WITH SCHEMA CHANGES.

type Resolver struct{}

func (r *Resolver) Query() QueryResolver {
	return &queryResolver{r}
}

type queryResolver struct{ *Resolver }

func (r *queryResolver) Item(ctx context.Context, id string) (Item, error) {
	// use the id to fetch that from the api
	// use the type internally to convert it to the right type
	// return that
}
func (r *queryResolver) Story(ctx context.Context, id string) (*Story, error) {
	panic("not implemented")
}
func (r *queryResolver) Comment(ctx context.Context, id string) (*Comment, error) {
	panic("not implemented")
}
func (r *queryResolver) Ask(ctx context.Context, id string) (*Ask, error) {
	panic("not implemented")
}
func (r *queryResolver) Job(ctx context.Context, id string) (*Job, error) {
	panic("not implemented")
}
func (r *queryResolver) Poll(ctx context.Context, id string) (*Poll, error) {
	panic("not implemented")
}
func (r *queryResolver) Pollopt(ctx context.Context, id string) (*PollOpt, error) {
	panic("not implemented")
}
func (r *queryResolver) User(ctx context.Context, id string) (*User, error) {
	panic("not implemented")
}
func (r *queryResolver) TopStories(ctx context.Context) ([]Story, error) {
	panic("not implemented")
}
func (r *queryResolver) NewStories(ctx context.Context) ([]Story, error) {
	panic("not implemented")
}
func (r *queryResolver) BestStories(ctx context.Context) ([]Story, error) {
	panic("not implemented")
}
func (r *queryResolver) AskStories(ctx context.Context) ([]Ask, error) {
	panic("not implemented")
}
func (r *queryResolver) ShowStories(ctx context.Context) ([]Story, error) {
	panic("not implemented")
}
func (r *queryResolver) JobStories(ctx context.Context) ([]Job, error) {
	panic("not implemented")
}
func (r *queryResolver) UpdatedItems(ctx context.Context) ([]Item, error) {
	panic("not implemented")
}
func (r *queryResolver) UpdatedProfiles(ctx context.Context) ([]User, error) {
	panic("not implemented")
}
