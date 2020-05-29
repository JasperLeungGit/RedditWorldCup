import React, { Component } from "react";
import "./App.css";
import NavBar from "./components/navbar";
import HorizontalForm from "./components/horizontalform";

const postsPerRequest = 100;
const maxPostsToFetch = 500;
const maxRequests = maxPostsToFetch / postsPerRequest;
var responses = [];
var imgPosts = [];
var nextBracket = [];

const checkWords = ["jpg", "png", "i.imgur.com"];

class App extends Component {
  state = {
    disabledChecks: [false, false, false],
    imagePosts: [],
    firstIndex: 0,
    secondIndex: 1,
    winningindex: 0,
    winnerFound: false,
    render: false,
    visible1: true,
    visible2: true,
  };

  handleSubmit = (subreddit) => {
    this.fetchPosts(subreddit);
  };

  fetchPosts = async (subreddit, afterParam) => {
    try {
      const response = await fetch(
        `https://www.reddit.com/r/${subreddit}/top/.json?limit=${postsPerRequest}&t=all${
          afterParam ? "$after=" + afterParam : ""
        }`
      );
      const responseJSON = await response.json();
      responses.push(responseJSON);
      if (responseJSON.data.after && responses.length < maxRequests) {
        this.fetchPosts(subreddit, responseJSON.data.after);
      }
      if (responses.length === maxRequests || !responseJSON.data.after)
        this.parseResults(responses);
    } catch (err) {
      document.getElementById("generating").style.display = "none";
      document.getElementById("notEnough").style.display = "block";
      responses = [];
      imgPosts = [];
    }
  };

  parseResults = (responses) => {
    const posts = [];
    responses.forEach((response) => {
      posts.push(...response.data.children);
    });

    posts.forEach(({ data: { url, title } }) => {
      url.replace("amp;s", "s");
      var type = url.substr(url.length - 3);
      if (checkWords.includes(type)) {
        if (!imgPosts.includes(url)) {
          imgPosts.push({ url, title });
        }
      }
    });

    this.display();
  };

  display = () => {
    if (imgPosts.length > 7) {
      var disabledChecks = [false, false, false];
      for (var i = 4; i < 7; i++) {
        if (imgPosts.length < 2 ** i) {
          disabledChecks[i - 4] = true;
        }
      }
      this.setState({ disabledChecks });
      document.getElementById("bgdim").style.display = "block";
      document.getElementById("HorizontalForm").style.display = "block";
    } else {
      console.log("not enough images");
      document.getElementById("generating").style.display = "none";
      document.getElementById("notEnough").style.display = "block";
      responses = [];
      imgPosts = [];
    }
    // responses = [];
    // imagePosts = [];
  };

  displayBracket = (size) => {
    console.log("displayBracket of size " + size);
    document.getElementById("bgdim").style.display = "none";
    document.getElementById("HorizontalForm").style.display = "none";
    document.getElementById("input").style.display = "none";
    document.getElementById("bracket").style.display = "block";
    var imagePosts = this.shuffle(imgPosts);
    imagePosts = imagePosts.slice(0, size);
    this.setState({ imagePosts });
  };

  handleChoice = (i) => {
    nextBracket.push(this.state.imagePosts[i]);
    if (
      this.state.secondIndex === this.state.imagePosts.length - 1 &&
      this.state.imagePosts.length !== 2
    ) {
      var firstIndex = 0;
      var secondIndex = 1;
      this.setState({ firstIndex });
      this.setState({ secondIndex });
      var imagePosts = nextBracket;
      imagePosts = this.shuffle(imagePosts);
      this.setState({ imagePosts });
      nextBracket = [];
    } else if (this.state.imagePosts.length === 2) {
      var winningIndex = i;
      var winnerFound = true;
      this.setState({ winningIndex });
      this.setState({ winnerFound });
      document.getElementById("bracket").style.display = "none";
      document.getElementById("winner").style.display = "block";
    } else {
      var firstIndex = this.state.firstIndex + 2;
      var secondIndex = this.state.secondIndex + 2;
      this.setState({ firstIndex });
      this.setState({ secondIndex });
    }
  };

  displayFirstImage = (i) => {
    if (this.state.imagePosts.length != 0) {
      return (
        <div className={this.state.visible1 ? "fadeIn" : "fadeOut"}>
          <h1 className="imageCaption">{this.state.imagePosts[i].title}</h1>
          <img
            src={this.state.imagePosts[i].url}
            style={{
              height: "50vh",
              marginLeft: "25%",
              maxWidth: "45%",
              transform: "translate(-50%, 15vh)",
              position: "absolute",
            }}
            onClick={() => {
              var visible2 = false;
              this.setState({ visible2 });
              setTimeout(() => {
                var visible1 = false;
                this.setState({ visible1 });
              }, 500);
              setTimeout(() => {
                this.handleChoice(i);
                var visible1 = true;
                var visible2 = true;
                setTimeout(() => {
                  this.setState({ visible1 });
                  this.setState({ visible2 });
                }, 500);
              }, 1000);
            }}
          />
        </div>
      );
    } else {
      return;
    }
  };

  displaySecondImage = (i) => {
    if (this.state.imagePosts.length !== 0) {
      return (
        <div className={this.state.visible2 ? "fadeIn" : "fadeOut"}>
          <h1 className="imageCaption2">{this.state.imagePosts[i].title}</h1>
          <img
            src={this.state.imagePosts[i].url}
            style={{
              height: "50vh",
              marginLeft: "75%",
              maxWidth: "45%",
              transform: "translate(-50%, 15vh)",
              position: "absolute",
            }}
            onClick={() => {
              var visible1 = false;
              this.setState({ visible1 });
              setTimeout(() => {
                var visible2 = false;
                this.setState({ visible2 });
              }, 500);
              setTimeout(() => {
                this.handleChoice(i);
                var visible1 = true;
                var visible2 = true;
                setTimeout(() => {
                  this.setState({ visible1 });
                  this.setState({ visible2 });
                }, 500);
              }, 1000);
            }}
          />
        </div>
      );
    } else {
      return;
    }
  };

  displayWinningImage = (i) => {
    if (this.state.winnerFound === true) {
      return (
        <div className="fadeIn">
          <h1 className="imageCaptionWinner">
            Winner: {this.state.imagePosts[i].title}
          </h1>
          <img
            src={this.state.imagePosts[i].url}
            style={{
              height: "50vh",
              marginLeft: "50%",
              transform: "translate(-50%, 15vh)",
              maxWidth: "45%",
              position: "absolute",
            }}
          />
        </div>
      );
    } else {
      return;
    }
  };

  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  render() {
    return (
      <React.Fragment>
        <NavBar></NavBar>
        <div id="input">
          <div className="transbox" id="bgdim"></div>
          <h1 className="mainheader">
            {" "}
            Enter a subreddit name to generate a bracket.{" "}
          </h1>
          <h1 className="secondheader">reddit.com/r/</h1>
          <input type="text" id="search" className="subsearch" />
          <button
            className="btn btn-outline-success my-2 my-sm-0"
            type="submit"
            style={{ margin: 10 }}
            onClick={() => {
              this.handleSubmit(document.getElementById("search").value);
              document.getElementById("generating").style.display = "block";
              document.getElementById("notEnough").style.display = "none";
            }}
          >
            Generate
          </button>
          <h1 id="generating" className="generating">
            {" "}
            Generating Bracket...{" "}
          </h1>
          <h1 id="notEnough" className="generating">
            {" "}
            Not enough images found/subreddit doesn't exist. Please try another
            subreddit.{" "}
          </h1>
          <HorizontalForm
            disabledChecks={this.state.disabledChecks}
            displayBracket={this.displayBracket}
          ></HorizontalForm>
        </div>
        <div
          id="bracket"
          style={{ display: "none", height: "90vh", width: "100vh" }}
        >
          <h1
            style={{
              marginLeft: "50%",
              textAlign: "center",
              color: "white",
              transform: "translate(-50%, 6vh)",
              position: "absolute",
            }}
          >
            {(this.state.secondIndex + 1) / 2}/
            {this.state.imagePosts.length / 2}
          </h1>
          {this.displayFirstImage(this.state.firstIndex)}
          {this.displaySecondImage(this.state.secondIndex)}
          <h1
            style={{
              marginLeft: "50%",
              color: "white",
              transform: "translate(-50%, 30vh)",
              position: "absolute",
            }}
          >
            vs.
          </h1>
        </div>
        <div
          id="winner"
          style={{ display: "none", height: "90vh", width: "100vh" }}
        >
          {this.displayWinningImage(this.state.winningIndex)}
          <button
            className="btn btn-outline-success my-2 my-sm-0"
            type="submit"
            style={{
              marginLeft: "50%",
              position: "absolute",
              top: "90%",
              transform: "translate(-50%,0)",
            }}
            onClick={() => {
              window.location = ".";
            }}
          >
            Go Back Home
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
