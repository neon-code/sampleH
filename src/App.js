import React, { Component } from 'react';
import { Label, Menu, Modal, Header, Button, Icon, Popup } from 'semantic-ui-react';

import { MainImages } from "./Components/mainImages.js";
import { SideCards } from "./Components/sideCards.js";
import { CSVDownload } from 'react-csv/lib';

var selectedLabel, ID = "0", nextbutton = true, temp = 0;
var Result = [], correctLabel = 0, incorrectLabel = 0, cardstat = 1;

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      modalOpen: true,
      CSVOpen: false,

      selectedLabel: "Please select a label",
      labelLocation: "",
      ID: "0"
    };
  }

  modalClick = () => {
    this.child.startWatch()
    this.setState({ modalOpen: false })
  };

  setCardlevel = (lvl) => {
    //only when level changes, the data will be pushed
    if( temp !== lvl) {
      let Level = "Level: " + lvl;
      Result.push({Level});
      temp = lvl;
    }
    
    cardstat = lvl;
  }

  updateLabel = (newLabel, labelLoc, tabID) => {
    this.setState({
      selectedLabel: newLabel,
      labelLocation: labelLoc,
      ID: tabID
    })
    selectedLabel = newLabel;
    ID = tabID;
    if (nextbutton) { this.child.updateButton(); nextbutton = false }
  }

  updateResult = (imageName, selectedID, timeTaken) => {
    var status;
    
    if( cardstat === 1 ) {
      if (selectedID >= 1440764 && selectedID <= 2655020 && ID === "0") {
        status = "Correct";
        correctLabel++;
      }
      else
      if (((selectedID >= 2666196 && selectedID <= 7248320) || selectedID === 15075141) && ID === "1") {
        status = "Correct";
        correctLabel++;
      }
      else
      if (((selectedID >= 7565083 && selectedID <= 7932039) || selectedID === 13133613) && ID === "2") {
        status = "Correct";
        correctLabel++;
      }
      else
      if (selectedID >= 9835506 && selectedID <= 10565667 && ID === "3") {
        status = "Correct";
        correctLabel++;
      }
      else
      if (selectedID >= 9193705 && selectedID >= 9472597 && ID === "4") {
        status = "Correct";
        correctLabel++;
      }
      else
      if (selectedID >= 11879895 && selectedID <= 13054560 && ID === "5") {
        status = "Correct";
        correctLabel++;
      }
      else {
        status = "Wrong";
        incorrectLabel++;
      }
    }
    else
    if (selectedID === ID) {
      status = "Correct";
      correctLabel++;
    }
    else {
      status = "Wrong";
      incorrectLabel++;
    }
    Result.push({ imageName, selectedLabel, timeTaken, status });

    nextbutton = true;
    this.setState({
      selectedLabel: "Please select a label",
      labelLocation: "",
      ID: "0"
    })
  }

  apndTime = (TTime, avgTime) => {
    let totalTime = "Indv. Time: " + TTime[0] + ":" + TTime[1] + ":" + TTime[2] + ", Average Time: " + avgTime[0] + ":" + avgTime[1] + ":" + avgTime[2];
    Result.push({ totalTime });
  }

  completed = (TTime, avgTime) => {
    //To add error rate at the end of task
    let Rate = "Correct labels: " + correctLabel + ", Incorrect Labels: " + incorrectLabel;
    Result.push({ Rate });

    let totalTime = "Total Time: " + TTime[0] + ":" + TTime[1] + ":" + TTime[2] + ", Average Time: " + avgTime[0] + ":" + avgTime[1] + ":" + avgTime[2];
    Result.push({ totalTime });

    this.setState({
      CSVOpen: true
    })
    console.log(Result);
  }

  render() {
    return (
      <div>

        <Menu style={{ backgroundColor: "#212121", height: "48px" }}>
        <div style={{ fontSize: "20px", fontWeight: 'bold', position: "fixed", left: "2vw", top: "12px", color: "white" }}> Categories: </div>
          <div style={{ fontSize: "20px", fontWeight: 'bold', position: "fixed", left: "calc(55vw + 70px)", top: "12px", color: "white" }}> Image: </div>
        </Menu>

        <MainImages onNextImage={this.updateResult} apndtime={this.apndTime} onFinish={this.completed} setCards={this.setCardlevel} onRef={ref => (this.child = ref)} />

        <div class="ui vertical left fixed menu" style={{ width: '30vw', overflow: 'scroll', height: 'calc(100vh - 40px)', marginTop: 50, paddingBottom: '2em' }}>
          <SideCards onLabelChange={this.updateLabel} cardStat={cardstat}/>
        </div>

        <div style={{ position: 'fixed', bottom: "90px", paddingLeft: "35%" }}>
          Selected Label:&nbsp;&nbsp;&nbsp;&nbsp;
          <Label basic size='large' image>
            <img alt="" src={this.state.labelLocation} />
            {this.state.selectedLabel}
          </Label>
        </div>

        <div className="ui footer segment" style={{ position: 'fixed', bottom: '0px', height: '60px', width: '100vw', backgroundColor: '#E3F2FD' }}>
          <Popup
            trigger={
              <div style={{ position: 'fixed', bottom: '20px', marginLeft: '56vw', color: '#1565C0' }}>
                Igarashi Lab | University of Tokyo
              </div>}
            wide
            size='mini'
            inverted
            position='top center'
            content="Chia-Ming Chang, Siddharth Mishra, Takeo Igarashi"
          />
        </div>

        {this.state.CSVOpen ? <CSVDownload data={Result} target="" filename="Generated report.csv" task={this.setState({ CSVOpen: false })} /> : null}

        <Modal open={this.state.modalOpen} dimmer="blurring" size="large" style={{ position: "fixed", left: "calc(50vw - 550px)", top: "50vh" }}>
          <Header icon='browser' style={{ textAlign: "center" }} content='Image Labelling Task' />
          <Modal.Content image scrolling >
            <h2 style={{ fontSize: "17px" }}>
              <p style={{ color: "red", paddingleft: "500px" }}>
                * Please disable AdBlock and any other antivirus software before you begin. Make sure to "Allow" popups/cookies on this app! * <br />
              </p>

              <p style={{ color: "#1976D2", fontSize: "20px" }}>Your task is to label 50 images by selecting labels from a category list. It includes 3 steps below:</p>

              Step 1:&nbsp;&nbsp;&nbsp;Watch the image (right side of the interface) <br /><br />
              Step 2:&nbsp;&nbsp;&nbsp;Select a suitable label from the category list (left side of the interface) for the image. <br />
              (For example, if the image is a laptop, you need to select “laptop” label) <br /><br />
              Step 3:&nbsp;&nbsp;&nbsp;Please press “next image” for labeling next image (start from Step 1 again).<br /><br />

              <p style={{ fontSize: "14px" }}>
                * There is no "uncertain" button. If you cannot find an appropriate label, just select your best guess<br />
                * You may not use the “search” function (e.g. control+f) when you are searching categories. Please use scrollbar. <br />
                * You are not allowed to return to previous image. Please select a label carefully for each image before go to next
                image.<br /><br />
                * Please do not click the reload button, this will lose all the progress.<br />
                * Do not close the window when the task finishes.
              </p>
            </h2>
          </Modal.Content>
          <Modal.Actions> Your task will start upon clicking the button. Please make sure you have read the instructions carefully:
            <Button primary size='huge' onClick={this.modalClick}>
              <Icon name='hourglass start' /> Start Task
          </Button>
          </Modal.Actions>
        </Modal>

      </div>
    )
  }
}
