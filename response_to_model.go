package hngql

import (
	"github.com/louistsaitszho/hngql/rest"
	"time"
	"strconv"
)

// TODO return (*Story, error) instead
func FromStoryResponseToStory(storyRes rest.StoryResponse) Story {
	timestamp := fromUnixTimeToTimestamp(storyRes.Time)
	return Story {
		ID: storyRes.ID,
		Score: storyRes.Score,
		URL: storyRes.URL,
		Title: storyRes.Title,
		CommentCount: storyRes.Descendants,
		Time: &timestamp,
		By: &User {
			ID: storyRes.By,
		},
	}
}

//TODO return (*time.Time, error) instead
func fromUnixTimeToTime(unixTime int) time.Time {
	i, _ := strconv.ParseInt(strconv.Itoa(unixTime), 10, 64)
    return time.Unix(i, 0)
}

func fromUnixTimeToTimestamp(unixTime int) Timestamp {
	return Timestamp {
		Iso8601: fromUnixTimeToTime(unixTime),
		UnixTime: unixTime,
	}
}

func FromUserResponseToUser(userRes rest.UserResponse) User {
	timestamp := fromUnixTimeToTimestamp(userRes.Created)
	return User {
		ID: userRes.ID,
		About: userRes.About,
		Karma: userRes.Karma,
		CreatedAt: &timestamp,
	}
}