package hackernewsgraphql

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

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
