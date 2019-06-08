package resolver

import (
	"context"
	"github.com/louistsaitszho/hngql"
	"github.com/louistsaitszho/hngql/rest"
) // THIS CODE IS A STARTING POINT ONLY. IT WILL NOT BE UPDATED WITH SCHEMA CHANGES.

type Resolver struct{}

func (r *Resolver) Query() hngql.QueryResolver {
	return &queryResolver{r}
}

type queryResolver struct{ *Resolver }

func (r *queryResolver) Story(ctx context.Context, id int) (*hngql.Story, error) {
	storyRes, err := rest.GetStory(id)
	if err != nil {
		return nil, err
	}

	story := hngql.FromStoryResponseToStory(*storyRes)
	return &story, nil
}
