package hackernewsgraphql

// Item has all the fields for any types of Item, so that they can be
// converted back afterwards
type Item struct {
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

// User
type User struct {
	About     string `json:"about"`
	Created   int    `json:"created"`
	Delay     int    `json:"delay"`
	ID        string `json:"id"`
	Karma     int    `json:"karma"`
	Submitted []int  `json:"submitted"`
}
