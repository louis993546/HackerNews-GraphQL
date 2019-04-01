package hackernewsgraphql

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// type itemID = int

// type itemResp struct {
// 	id          itemID    `json:id`
// 	by          string    `json:by`
// 	time        int       `json:time`
// 	itemType    string    `json:type`
// 	descendants *int      `json:descendants`
// 	kids        *[]itemID `json:kids`
// 	score       *int      `json:score`
// 	title       *string   `json:title`
// 	url         *string   `json:url`
// 	parent      *itemID   `json:parent`
// 	text        *string   `json:text`
// 	parts       *[]itemID `json:parts`
// 	poll        *itemID   `json:poll`
// }

func GetItem(id int) (Item, error) {
	url := "https://hacker-news.firebaseio.com/v0/item/%d.json"

	resp, _ := http.Get(fmt.Sprintf(url, id))
	defer resp.Body.Close()

	var item Item
	json.NewDecoder(resp.Body).Decode(&item)

	return item, nil
	// switch item.itemType {
	// case "story":
	// 	story := makeStory(item)
	// 	return story, nil
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
	// default:
	// 	return nil, &InvalidItemTypeError{item.itemType}
	// }
}

// type InvalidItemTypeError struct {
// 	itemType string
// }

// func (e *InvalidItemTypeError) Error() string {
// 	return fmt.Sprintf("'%s' is not a valid HackerNews Item type", e.itemType)
// }

// func makeStory(item itemResp) Story {
// 	return Story{
// 		ID:          strconv.Itoa(item.id),
// 		By:          item.by,
// 		Time:        makeTimestamp(item.time),
// 		Descendants: *item.descendants,
// 		Kids:        []Comment{}, //TODO fix me
// 		Score:       *item.score,
// 		Title:       *item.title,
// 		URL:         *item.url,
// 	}
// }

// //TODO need a new model for Comment, so that Parent can be fetch separately
// func makeComment(item Item) Comment {
// 	// return Comment{
// 	// 	ID: strconv.Itoa(item.id),
// 	// 	By: item.by,
// 	// 	Time: Timestamp{
// 	// 		Epoch: item.time,
// 	// 		Iso8601: "", //TODO fix me
// 	// 	},
// 	// 	Kids:[]Comment{},	//TODO fix me
// 	// 	// Parent: 			//TODO this can be a comment or a story. how
// 	// }
// }

// func makeAsk(item Item) Ask {
// 	return Ask{
// 		ID:          strconv.Itoa(item.id),
// 		By:          item.by,
// 		Time:        makeTimestamp(item.time),
// 		Descendants: *item.descendants,
// 		Kids:        []Comment{}, //TODO i think this needs a new model as well
// 		Score:       *item.score,
// 		Text:        *item.text,
// 		Title:       *item.title,
// 		URL:         *item.url,
// 	}
// }

// func makeJob(item itemResp) Job {
// 	return Job{
// 		ID:    strconv.Itoa(item.id),
// 		By:    item.by,
// 		Time:  makeTimestamp(item.time),
// 		Score: *item.score,
// 		Text:  *item.text,
// 		Title: *item.title,
// 		URL:   *item.url,
// 	}
// }

// func makePoll(item itemResp) Poll {
// 	return Poll{
// 		ID:          strconv.Itoa(item.id),
// 		By:          item.by,
// 		Time:        makeTimestamp(item.time),
// 		Descendants: *item.descendants,
// 		Kids:        []Comment{},
// 		Parts:       []PollOpt{},
// 		Score:       *item.score,
// 		Text:        *item.text,
// 		Title:       *item.title,
// 	}
// }

// //TODO need a new model so that I can fetch poll only when necessary
// func makePollOpt(item itemResp) PollOpt {
// 	// return PollOpt{
// 	// 	ID:    strconv.Itoa(item.id),
// 	// 	By:    item.by,
// 	// 	Time:  makeTimestamp(item.time),
// 	// 	Poll:  *Poll{},
// 	// 	Score: *item.score,
// 	// 	Text:  *item.text,
// 	// }
// }

// func makeTimestamp(epoch int) Timestamp {
// 	epochNanosecond := int64(epoch) * int64(time.Millisecond)
// 	return Timestamp{
// 		Epoch:   epoch,
// 		Iso8601: time.Unix(0, epochNanosecond).Format(time.RFC3339),
// 	}
// }
