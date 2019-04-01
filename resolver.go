package hackernewsgraphql

import (
	"context"
	"strconv"
) // THIS CODE IS A STARTING POINT ONLY. IT WILL NOT BE UPDATED WITH SCHEMA CHANGES.

type Resolver struct{}

func (r *Resolver) Query() QueryResolver {
	return &queryResolver{r}
}
func (r *Resolver) User() UserResolver {
	return &userResolver{r}
}

type queryResolver struct{ *Resolver }

func (r *queryResolver) Item(ctx context.Context, id string) (*Item, error) {
	idInt, _ := strconv.Atoi(id)
	item, err := GetItem(idInt)

	if err != nil {
		return nil, err
	}

	return &item, nil
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

type userResolver struct{ *Resolver }

func (r *userResolver) Created(ctx context.Context, obj *User) (*Timestamp, error) {
	panic("not implemented")
}
func (r *userResolver) Submitted(ctx context.Context, obj *User) ([]Item, error) {
	panic("not implemented")
}
