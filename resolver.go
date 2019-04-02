package hackernewsgraphql

import (
	"context"
	"strconv"
) // THIS CODE IS A STARTING POINT ONLY. IT WILL NOT BE UPDATED WITH SCHEMA CHANGES.

type Resolver struct{}

func (r *Resolver) Ask() AskResolver {
	return &askResolver{r}
}
func (r *Resolver) Comment() CommentResolver {
	return &commentResolver{r}
}
func (r *Resolver) Job() JobResolver {
	return &jobResolver{r}
}
func (r *Resolver) Poll() PollResolver {
	return &pollResolver{r}
}
func (r *Resolver) PollOpt() PollOptResolver {
	return &pollOptResolver{r}
}
func (r *Resolver) Query() QueryResolver {
	return &queryResolver{r}
}
func (r *Resolver) Story() StoryResolver {
	return &storyResolver{r}
}
func (r *Resolver) User() UserResolver {
	return &userResolver{r}
}

type askResolver struct{ *Resolver }

func (r *askResolver) Time(ctx context.Context, obj *Ask) (*Timestamp, error) {
	panic("not implemented")
}
func (r *askResolver) Kids(ctx context.Context, obj *Ask) ([]Comment, error) {
	panic("not implemented")
}

type commentResolver struct{ *Resolver }

func (r *commentResolver) Time(ctx context.Context, obj *Comment) (*Timestamp, error) {
	panic("not implemented")
}
func (r *commentResolver) Kids(ctx context.Context, obj *Comment) ([]Comment, error) {
	panic("not implemented")
}
func (r *commentResolver) Parent(ctx context.Context, obj *Comment) (Item, error) {
	panic("not implemented")
}

type jobResolver struct{ *Resolver }

func (r *jobResolver) Time(ctx context.Context, obj *Job) (*Timestamp, error) {
	panic("not implemented")
}

type pollResolver struct{ *Resolver }

func (r *pollResolver) Time(ctx context.Context, obj *Poll) (*Timestamp, error) {
	panic("not implemented")
}
func (r *pollResolver) Kids(ctx context.Context, obj *Poll) ([]Comment, error) {
	panic("not implemented")
}
func (r *pollResolver) Parts(ctx context.Context, obj *Poll) ([]PollOpt, error) {
	panic("not implemented")
}

type pollOptResolver struct{ *Resolver }

func (r *pollOptResolver) Time(ctx context.Context, obj *PollOpt) (*Timestamp, error) {
	panic("not implemented")
}
func (r *pollOptResolver) Poll(ctx context.Context, obj *PollOpt) (*Poll, error) {
	panic("not implemented")
}

type queryResolver struct{ *Resolver }

func (r *queryResolver) Item(ctx context.Context, id string) (Item, error) {
	idInt, _ := strconv.Atoi(id)
	item, _ := GetItem(idInt)
	return item, nil
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

type storyResolver struct{ *Resolver }

func (r *storyResolver) Time(ctx context.Context, obj *Story) (*Timestamp, error) {
	panic("not implemented")
}
func (r *storyResolver) Kids(ctx context.Context, obj *Story) ([]Comment, error) {
	panic("not implemented")
}

type userResolver struct{ *Resolver }

func (r *userResolver) Created(ctx context.Context, obj *User) (*Timestamp, error) {
	panic("not implemented")
}
func (r *userResolver) Submitted(ctx context.Context, obj *User) ([]Item, error) {
	panic("not implemented")
}
