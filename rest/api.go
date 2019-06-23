package rest

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func GetStory(id int) (*StoryResponse, error) {
	itemRes, err := GetItem(id)
	if err != nil {
		return nil, err
	}

	story, err := itemRes.ToStoryResponse()
	if err != nil {
		return nil, err
	}

	return story, nil
}

func GetUser(username string) (*UserResponse, error) {
	url := fmt.Sprintf("https://hacker-news.firebaseio.com/v0/user/%s.json", username)
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
	var userRes UserResponse
	if err := json.NewDecoder(resp.Body).Decode(&userRes); err != nil {
		return nil, err
	}

	return &userRes, nil
}

func GetItem(id int) (*ItemResponse, error) {
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
	var itemRes ItemResponse
	if err := json.NewDecoder(resp.Body).Decode(&itemRes); err != nil {
		return nil, err
	}

	//TODO: ideally some extra validation

	return &itemRes, nil
}

func (i *ItemResponse) ToStoryResponse() (*StoryResponse, error) {
	if i.Type != "story" {
		return nil, fmt.Errorf("%d is not a story, but a %s", i.ID, i.Type)
	}

	emptyListOfKids := make([]int, 0)
	kids := make([]int, 0)
	if *i.Kids == nil {
		kids = emptyListOfKids
	} else {
		kids = *i.Kids
	}

	if i.Descendants == nil {
		desc := 0
		i.Descendants = &desc
	}

	return &StoryResponse{
		By: i.By,
		Descendants: *i.Descendants,
		ID: i.ID,
		Kids: kids,
		Score: *i.Score,
		Time: i.Time,
		Title: *i.Title,
		Type: i.Type,
		URL: *i.URL,
	}, nil
}