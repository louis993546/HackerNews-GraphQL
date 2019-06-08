package resolver

import (
	"context"
	"github.com/louistsaitszho/hngql"
) // THIS CODE IS A STARTING POINT ONLY. IT WILL NOT BE UPDATED WITH SCHEMA CHANGES.

type Resolver struct{}

func (r *Resolver) Query() hngql.QueryResolver {
	return &queryResolver{r}
}

type queryResolver struct{ *Resolver }

func (r *queryResolver) Story(ctx context.Context, id int) (*hngql.Story, error) {
	return resolveStoryByID(id)
}
