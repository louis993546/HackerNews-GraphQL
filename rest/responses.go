package rest

type StoryResponse struct {
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

type UserResponse struct {
	About     string `json:"about"`
	Created   int    `json:"created"`
	Delay     int    `json:"delay"`
	ID        string `json:"id"`
	Karma     int    `json:"karma"`
	Submitted []int  `json:"submitted"`
}

type ItemResponse struct {
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