class Story {
  constructor(id, title, time, by, comments) {
    this.id = id;
    this.title = title;
    this.time = time;
    this.by = by;
    this.comments = comments;
  }
}

class Deleted {
  constructor(id, type, time) {
    this.id = id;
    this.type = type;
    this.time = time;
  }
}

class Comment {
  constructor(id, by, parent, text, time) {
    this.id = id;
    this.by = by;
    this.parent = parent;
    this.text = text;
    this.time = time;
  }
}

class User {
  constructor(id, about, karma, delay) {
    this.id = id;
    this.about = about;
    this.karma = karma;
    this.delay = delay;
  }
}

module.exports = {
  Story,
  Deleted,
  Comment,
  User,
};
