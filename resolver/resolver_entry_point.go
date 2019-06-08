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

func resolveUserByStory(story hngql.Story) (*hngql.User, error) {
	userRes, err := rest.GetUser(story.By.ID)
	if err != nil {
		return nil, err
	}

	user := hngql.FromUserResponseToUser(*userRes)
	return &user, nil
}