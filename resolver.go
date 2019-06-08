package hngql

import (
	"context"
) // THIS CODE IS A STARTING POINT ONLY. IT WILL NOT BE UPDATED WITH SCHEMA CHANGES.

type Resolver struct{}

func (r *Resolver) Query() QueryResolver {
	return &queryResolver{r}
}

type queryResolver struct{ *Resolver }

func (r *queryResolver) Story(ctx context.Context, id int) (*Story, error) {
	storyRes, err := getStory(id)
	if err != nil {
		return nil, err
	}

	story := fromStoryResponseToStory(*storyRes)
	return &story, nil
}
