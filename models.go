package hackernewsgraphql

// Item includes Story, Ask, Comment, and more.
type Item interface {
	getBy() string
	getID() int
	getType() string
	getTime() int
}

// Story here implements Item, so that it can be a valid return type of GetItem
type Story struct {
	By          string `json:"by"`
	Descendants int    `json:"descendants"`
	ID          int    `json:"id"`
	Kids        []int  `json:"kids"`		//TODO: turn this into []Comment
	Score       int    `json:"score"`
	Time        int    `json:"time"`
	Title       string `json:"title"`
	URL         string `json:"url"`
}

func (s Story) getBy() string   { return s.By }
func (s Story) getID() int      { return s.ID }
func (s Story) getType() string { return "story" }
func (s Story) getTime() int    { return s.Time }

type Comment struct {
	By     string `json:"by"`
	ID     int    `json:"id"`
	Kids   []int  `json:"kids"`
	Parent int    `json:"parent"`
	Text   string `json:"text"`
	Time   int    `json:"time"`
}

func (c Comment) getBy() string   { return c.By }
func (c Comment) getID() int      { return c.ID }
func (c Comment) getType() string { return "comment" }
func (c Comment) getTime() int    { return c.Time }

type Ask struct {
	By          string `json:"by"`
	Descendants int    `json:"descendants"`
	ID          int    `json:"id"`
	Kids        []int  `json:"kids"`
	Score       int    `json:"score"`
	Text        string `json:"text"`
	Time        int    `json:"time"`
	Title       string `json:"title"`
	URL         string `json:"url"`
}

func (a Ask) getBy() string   { return a.By }
func (a Ask) getID() int      { return a.ID }
func (a Ask) getType() string { return "ask" }
func (a Ask) getTime() int    { return a.Time }

type Job struct {
	By    string `json:"by"`
	ID    int    `json:"id"`
	Score int    `json:"score"`
	Text  string `json:"text"`
	Time  int    `json:"time"`
	Title string `json:"title"`
	URL   string `json:"url"`
}

func (j Job) getBy() string   { return j.By }
func (j Job) getID() int      { return j.ID }
func (j Job) getType() string { return "job" }
func (j Job) getTime() int    { return j.Time }

type Poll struct {
	By          string `json:"by"`
	Descendants int    `json:"descendants"`
	ID          int    `json:"id"`
	Kids        []int  `json:"kids"`
	Parts       []int  `json:"parts"`
	Score       int    `json:"score"`
	Text        string `json:"text"`
	Time        int    `json:"time"`
	Title       string `json:"title"`
}

func (p Poll) getBy() string   { return p.By }
func (p Poll) getID() int      { return p.ID }
func (p Poll) getType() string { return "poll" }
func (p Poll) getTime() int    { return p.Time }

type PollOpt struct {
	By    string `json:"by"`
	ID    int    `json:"id"`
	Poll  int    `json:"poll"`
	Score int    `json:"score"`
	Text  string `json:"text"`
	Time  int    `json:"time"`
}

func (po PollOpt) getBy() string   { return po.By }
func (po PollOpt) getID() int      { return po.ID }
func (po PollOpt) getType() string { return "pollopt" }
func (po PollOpt) getTime() int    { return po.Time }

// User is exactly what it is
// type User struct {
// 	About     string `json:"about"`
// 	Created   int    `json:"created"`
// 	Delay     int    `json:"delay"`
// 	ID        string `json:"id"`
// 	Karma     int    `json:"karma"`
// 	Submitted []int  `json:"submitted"`
// }

type User struct {
	ID string `json: "id"`
}
