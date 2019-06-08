package resolver

import (
	"github.com/louistsaitszho/hngql"
	"github.com/louistsaitszho/hngql/rest"
)

func resolveStoryByID(id int) (*hngql.Story, error) {
	storyRes, err := rest.GetStory(id)
	if err != nil {
		return nil, err
	}

	story := hngql.FromStoryResponseToStory(*storyRes)
	return &story, nil
}