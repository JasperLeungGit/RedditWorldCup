import React, { Component } from "react";
class HorizontalForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arraySize: 0,
    };
  }
  handleSizeChange = (e) => {
    const arraySize = e.target.value;
    console.log(arraySize);
    this.setState({ arraySize });
  };

  render() {
    return (
      <form
        id="HorizontalForm"
        style={{
          position: "absolute",
          zIndex: 300,
          top: "30%",
          left: "35%",
          backgroundColor: "#343a40",
          paddingTop: "5%",
          paddingBottom: "5%",
          paddingLeft: "10%",
          paddingRight: "10%",
          display: "none",
        }}
      >
        <fieldset className="form-group">
          <div className="row">
            <legend
              className="col-form-label col-sm-2 pt-0"
              style={{ color: "white" }}
            >
              Size
            </legend>
            <div className="col-sm-10">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  value="8"
                  checked={this.state.arraySize === "8"}
                  onChange={this.handleSizeChange}
                />
                <label
                  className="form-check-label"
                  htmlFor="gridRadios1"
                  style={{ color: "white" }}
                >
                  8
                </label>
              </div>
              <div className={"form-check"}>
                <input
                  className="form-check-input"
                  type="radio"
                  value="16"
                  disabled={this.props.disabledChecks[0]}
                  checked={this.state.arraySize === "16"}
                  onChange={this.handleSizeChange}
                />
                <label
                  className="form-check-label"
                  htmlFor="gridRadios2"
                  style={{ color: "white" }}
                >
                  16
                </label>
              </div>
              <div className={"form-check"}>
                <input
                  className="form-check-input"
                  type="radio"
                  value="32"
                  disabled={this.props.disabledChecks[1]}
                  checked={this.state.arraySize === "32"}
                  onChange={this.handleSizeChange}
                />
                <label
                  className="form-check-label"
                  htmlFor="gridRadios3"
                  style={{ color: "white" }}
                >
                  32
                </label>
              </div>
              <div className={"form-check"}>
                <input
                  className="form-check-input"
                  type="radio"
                  value="64"
                  disabled={this.props.disabledChecks[2]}
                  checked={this.state.arraySize === "64"}
                  onChange={this.handleSizeChange}
                />
                <label
                  className="form-check-label"
                  htmlFor="gridRadios4"
                  style={{ color: "white" }}
                >
                  64
                </label>
              </div>
            </div>
          </div>
        </fieldset>
        <div className="form-group row">
          <div className="col-sm-10">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                var size = parseInt(this.state.arraySize, 10);
                this.props.displayBracket(size);
              }}
            >
              Generate Bracket
            </button>
          </div>
        </div>
      </form>
    );
  }
}

export default HorizontalForm;
