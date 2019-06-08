package rest

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// TODO need to figure out how to best construct this funciton
// func getItem(id int) Item { }

func GetStory(id int) (*StoryResponse, error) {
	url := fmt.Sprintf("https://hacker-news.firebaseio.com/v0/item/%d.json", id)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	var storyRes StoryResponse
	if err := json.NewDecoder(resp.Body).Decode(&storyRes); err != nil {
		return nil, err
	}

	return &storyRes, nil
}
