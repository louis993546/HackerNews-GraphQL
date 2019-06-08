package hngql

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// TODO need to figure out how to best construct this funciton
// func getItem(id int) Item { }

type storyResponse struct {
	By          string `json:"by"`
	Descendants int    `json:"descendants"`
	ID          int    `json:"id"`
	Kids        []int  `json:"kids"`
	Score       int    `json:"score"`
	Time        int    `json:"time"`
	Title       string `json:"title"`
	Type        string `json:"type"`
	URL         string `json:"url"`
}

func getStory(id int) (*storyResponse, error) {
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
	var storyRes storyResponse
	if err := json.NewDecoder(resp.Body).Decode(&storyRes); err != nil {
		return nil, err
	}

	return &storyRes, nil
}
