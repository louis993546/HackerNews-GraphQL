package hngql

// TODO return (*Story, error) instead
func fromStoryResponseToStory(storyRes storyResponse) Story {
	return Story {
		ID: storyRes.ID,
		Score: storyRes.Score,
		URL: storyRes.URL,
		Title: storyRes.Title,
		CommentCount: storyRes.Descendants,
	}
}