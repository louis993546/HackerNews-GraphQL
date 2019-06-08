// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package hngql

import (
	"time"
)

type Item interface {
	IsItem()
}

type Comment struct {
	ID   int        `json:"id"`
	By   *User      `json:"by"`
	Time *Timestamp `json:"time"`
}

func (Comment) IsItem() {}

type Story struct {
	ID           int        `json:"id"`
	By           *User      `json:"by"`
	Score        int        `json:"score"`
	URL          string     `json:"url"`
	Title        string     `json:"title"`
	Time         *Timestamp `json:"time"`
	Comments     []*Comment `json:"comments"`
	CommentCount int        `json:"commentCount"`
}

func (Story) IsItem() {}

type Timestamp struct {
	Iso8601  time.Time `json:"iso8601"`
	UnixTime int       `json:"unixTime"`
}

type User struct {
	ID        string     `json:"id"`
	About     string     `json:"about"`
	Karma     int        `json:"karma"`
	CreatedAt *Timestamp `json:"createdAt"`
	Submitted []Item     `json:"submitted"`
}
