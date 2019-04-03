package hackernewsgraphql

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

// AllItems is essentially a wrapper struct to handle the json parsing. Note
// that this does NOT implement Item on purpose, because it forces the adapters
// to make sure it can return a valid types of items with all the field with
// value. i.e. If the type is story, you can be 100% sure it has title, url,
// descendants, etc., or an error all-together.
type AllItems struct {
	By          string  `json:"by"`
	ID          int     `json:"id"`
	Type        string  `json:"type"`
	Time        int     `json:"time"`
	Descendants *int    `json:"descendants"`
	Kids        *[]int  `json:"kids"`
	Score       *int    `json:"score"`
	Title       *string `json:"title"`
	URL         *string `json:"url"`
	Parent      *int    `json:"parent"`
	Text        *string `json:"text"`
	Parts       *[]int  `json:"parts"`
	Poll        *int    `json:"poll"`
}

// GetItem calls the GET /item API
func GetItem(id int) (Item, error) {
	url := "https://hacker-news.firebaseio.com/v0/item/%d.json"

	resp, err := http.Get(fmt.Sprintf(url, id))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var item AllItems
	json.NewDecoder(resp.Body).Decode(&item)

	switch item.Type {
	case "story":
		story := makeStory(item)
		return story, nil
	// case "comment":
	// 	comment := makeComment(item)
	// 	return comment, nil
	// case "ask":
	// 	ask := makeAsk(item)
	// 	return ask, nil
	// case "job":
	// 	job := makeJob(item)
	// 	return job, nil
	// case "poll":
	// 	poll := makePoll(item)
	// 	return poll, nil
	// case "pollopt":
	// 	pollOpt := makePollOpt(item)
	// 	return pollOpt, nil
	default:
		return nil, &InvalidItemTypeError{item.Type}
	}
}

// InvalidItemTypeError signals a new type of HackerNews item exists
type InvalidItemTypeError struct {
	itemType string
}

func (e *InvalidItemTypeError) Error() string {
	return fmt.Sprintf("'%s' is not a valid HackerNews Item type", e.itemType)
}

func makeStory(item AllItems) Story {
	return Story{
		By:          item.By,
		Descendants: *item.Descendants,
		ID:          item.ID,
		Kids:        *item.Kids,
		Score:       *item.Score,
		Time:        item.Time,
		Title:       *item.Title,
		URL:         *item.URL,
	}
}

func makeTimestamp(epoch int) Timestamp {
	return Timestamp{
		Epoch:   epoch,
		Iso8601: time.Unix(int64(epoch), 0).Format(time.RFC3339),
	}
}

func GetTopStories() ([]Story, error) {
	url := "https://hacker-news.firebaseio.com/v0/topstories.json"
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	res := make([]int, 0)
	json.Unmarshal([]byte(resp.Body), &res)

	//TODO: use goroutine to make all the API requests together
	something := make(chan Item)
}
