package hngql

import (
	"fmt"
	"github.com/louistsaitszho/hngql/rest"
	"strconv"
	"time"
)

// TODO return (*Story, error) instead
func FromStoryResponseToStory(storyRes rest.StoryResponse) Story {
	timestamp := fromUnixTimeToTimestamp(storyRes.Time)
	return Story{
		ID:           storyRes.ID,
		Score:        storyRes.Score,
		URL:          storyRes.URL,
		Title:        storyRes.Title,
		CommentCount: storyRes.Descendants,
		Time:         &timestamp,
		By: &User{
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
	return Timestamp{
		Iso8601:  fromUnixTimeToTime(unixTime),
		UnixTime: unixTime,
	}
}

func FromUserResponseToUser(userRes rest.UserResponse) User {
	timestamp := fromUnixTimeToTimestamp(userRes.Created)
	// TODO hacky solution: just assume every item is a story, so that I can let Submitted hold on to a list of ID int
	items := mapIntToItem(userRes.Submitted, func(x int) Item { return Story{ID: x} })
	return User{
		ID:        userRes.ID,
		About:     userRes.About,
		Karma:     userRes.Karma,
		CreatedAt: &timestamp,
		Submitted: items,
	}
}

func mapIntToItem(vs []int, f func(int) Item) []Item {
	vsm := make([]Item, len(vs))
	for i, v := range vs {
		vsm[i] = f(v)
	}
	return vsm
}

func FromItemResponseToItem(itemRes rest.ItemResponse) Item {
	switch itemRes.Type {
	case "story":
		fmt.Printf("look at me %+v\n", itemRes)
		storyRes, _ := itemRes.ToStoryResponse()
		return FromStoryResponseToStory(*storyRes)
	default:
		return TemporaryItem{ID: itemRes.ID}
		// panic("this type is not supported yet")
	}
}

type TemporaryItem struct {
	ID int
}

func (TemporaryItem) IsItem() {}
