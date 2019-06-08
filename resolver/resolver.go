package resolver

import (
	"context"

	"github.com/louistsaitszho/hngql"
)

// THIS CODE IS A STARTING POINT ONLY. IT WILL NOT BE UPDATED WITH SCHEMA CHANGES.

type Resolver struct{}

func (r *Resolver) Query() hngql.QueryResolver {
	return &queryResolver{r}
}
func (r *Resolver) Story() hngql.StoryResolver {
	return &storyResolver{r}
}

type queryResolver struct{ *Resolver }

func (r *queryResolver) Story(ctx context.Context, id int) (*hngql.Story, error) {
	return resolveStoryByID(id)
}

type storyResolver struct{ *Resolver }

func (r *storyResolver) By(ctx context.Context, obj *hngql.Story) (*hngql.User, error) {
	return resolveUserByStory(*obj)
}
