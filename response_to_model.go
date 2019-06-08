package hngql

import (
	"github.com/louistsaitszho/hngql/rest"
	"time"
	"strconv"
)

// TODO return (*Story, error) instead
func FromStoryResponseToStory(storyRes rest.StoryResponse) Story {
	return Story {
		ID: storyRes.ID,
		Score: storyRes.Score,
		URL: storyRes.URL,
		Title: storyRes.Title,
		CommentCount: storyRes.Descendants,
		Time: &Timestamp {
			Iso8601: fromUnixTimeToTime(storyRes.Time),
			UnixTime: storyRes.Time,
		},
	}
}

//TODO return (*time.Time, error) instead
func fromUnixTimeToTime(unixTime int) time.Time {
	i, _ := strconv.ParseInt(strconv.Itoa(unixTime), 10, 64)
    return time.Unix(i, 0)
}