package hngql

import (
	"github.com/louistsaitszho/hngql/rest"
)

// TODO return (*Story, error) instead
func FromStoryResponseToStory(storyRes rest.StoryResponse) Story {
	return Story {
		ID: storyRes.ID,
		Score: storyRes.Score,
		URL: storyRes.URL,
		Title: storyRes.Title,
		CommentCount: storyRes.Descendants,
	}
}