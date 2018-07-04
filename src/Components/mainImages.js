import React from 'react';
import '../CSS/primary.css';
import { Button, Image, Icon, Label, Header, Modal } from 'semantic-ui-react';

var fileDir = {
    1:[
        { fileName: './images/n02007558_149.JPEG', id: "n02007558" },
        { fileName: './images/n07693725_287.JPEG', id: "n07693725" },
        { fileName: './images/n09193705_100.JPEG', id: "n09193705" },
    ],

    2:[
        { fileName: './images/n01443537_288.JPEG', id: "0" },
        { fileName: './images/n01797886_154.JPEG', id: "1" },
        { fileName: './images/n02488291_60.JPEG', id: "6" },
    ],

    3:[
        { fileName: './images/n03447447_79.JPEG', id: "n03447447" },
        { fileName: './images/n03594945_256.JPEG', id: "n03594945" },
        { fileName: './images/n03670208_521.JPEG', id: "n03670208" },
    ]
}

var activeIndex = Math.floor(Math.random() * 3), usedImages = [activeIndex], taskDone = 1, flag;
var timeTaken = { minutes: 0, seconds: 0, milsec: 0 }, indvTime = [0, 0, 0], addTime = [0, 0, 0], avgTime = [], Interval;
var level = 1, fileName = fileDir[level][activeIndex].fileName, levelFlag = [ true, true ];
const LevelLimit = [3, 6, 9];

export class MainImages extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isopen: false,
            activeNext: false,
            buttonText: "Next Image"
        };
    }

    componentDidMount() {
        //The componentDidMount() is a React method which is triggered when the app starts.
        alert("* Please disable AdBlock and any other antivirus software before you begin!\n Make sure to \"Allow\" popups/cookies on this app! *");

        this.props.onRef(this);
        this.props.setCards(level);
    }

    updateButton() {
        //A simple condition statement to enable/disable the NEXT button
        this.state.activeNext ? this.setState({ activeNext: false }) : this.setState({ activeNext: true })
    }

    OnFinish(x) {
        if ( x === 1 ) {
            //To find the Average total time
            let td = taskDone - 1;
            avgTime[0] = addTime[0] / td;
            avgTime[1] = addTime[1] / td;
            avgTime[2] = addTime[2] / td;

            avgTime[1] += (avgTime[0] * 60) % 60;
            avgTime[2] += (avgTime[1] * 100) % 100;

            avgTime[0] = Math.floor(avgTime[0]);
            avgTime[1] = Math.floor(avgTime[1]);
            avgTime[2] = Math.floor(avgTime[2]);

            //this onFinish is in App.js as an html prop in <MainImages>
            this.props.onFinish(addTime, avgTime);
        }
        else {
            //To find the Average indv time
            let td = LevelLimit[0];
            avgTime[0] = indvTime[0] / td;
            avgTime[1] = indvTime[1] / td;
            avgTime[2] = indvTime[2] / td;

            avgTime[1] += (avgTime[0] * 60) % 60;
            avgTime[2] += (avgTime[1] * 100) % 100;

            avgTime[0] = Math.floor(avgTime[0]);
            avgTime[1] = Math.floor(avgTime[1]);
            avgTime[2] = Math.floor(avgTime[2]);

            this.props.apndtime(indvTime, avgTime);
        }
    }

    startTimer() {
        timeTaken.milsec++;

        if (timeTaken.milsec > 99) {
            timeTaken.seconds++;
            timeTaken.milsec = 0;
        }

        if (timeTaken.seconds > 59) {
            timeTaken.minutes++;
            timeTaken.seconds = 0;
        }
    }

    startWatch() {
        Interval = setInterval(this.startTimer, 10);
    }

    changeImage() {
        //Pause the StopWatch
        clearInterval(Interval);
        this.updateButton();

        //To pass values to Parent (App.js);
        let t = timeTaken.minutes + ":" + timeTaken.seconds + ":" + timeTaken.milsec;

        if( level === 2 || level === 3 ) 
            this.props.onNextImage(fileDir[level][activeIndex].fileName, fileDir[level][activeIndex].id, t);
        else 
            this.props.onNextImage(fileDir[level][activeIndex].fileName, parseInt(fileDir[level][activeIndex].id.slice(1), 10), t);
        
        //Add the time to find total time take
        addTime[2] += timeTaken.milsec;
        if (addTime[2] > 99) {
            addTime[1] += Math.floor(addTime[2] / 100);
            addTime[2] %= 100;
        }
        addTime[1] += timeTaken.seconds;
        if (addTime[1] > 59) {
            addTime[0] += Math.floor(addTime[1] / 60);
            addTime[1] %= 60;
        }
        addTime[0] += timeTaken.minutes;

        //For individual Level time
        indvTime[2] += timeTaken.milsec;
        if (indvTime[2] > 99) {
            indvTime[1] += Math.floor(indvTime[2] / 100);
            indvTime[2] %= 100;
        }
        indvTime[1] += timeTaken.seconds;
        if (indvTime[1] > 59) {
            indvTime[0] += Math.floor(indvTime[1] / 60);
            indvTime[1] %= 60;
        }
        indvTime[0] += timeTaken.minutes;
        
        //Clear the StopWatch
        timeTaken.milsec = timeTaken.seconds = timeTaken.minutes = 0;

        //Load next image
        taskDone++;
        //Change of Level happens here
        if (taskDone > LevelLimit[0] && taskDone < LevelLimit[1] && levelFlag[0] === true) {

            //to indicate a Level has finished labeling
            this.OnFinish(0);

            //sets the heirarchy level
            level = 2;

            //To flush out the indices and store new values
            usedImages = usedImages.slice(0, 0);

            //Reset indv Timer
            indvTime[0] = indvTime[1] = indvTime[2] = 0;

            //to prevent re-entering this if statement
            levelFlag[0] = false;
        }
        else
        if (taskDone > LevelLimit[1] && taskDone < LevelLimit[2] && levelFlag[1] === true) {
            this.OnFinish(0);
            level = 3;
            usedImages = usedImages.slice(0, 0);
            indvTime[0] = indvTime[1] = indvTime[2] = 0;
            levelFlag[1] = false;
        }
        else
        if( taskDone === LevelLimit[2] )
            this.setState({ buttonText: "Finish!" })
        
        if (taskDone > LevelLimit[2] ) {
            this.OnFinish(0);
            indvTime[0] = indvTime[1] = indvTime[2] = 0;

            //indicated that the task has finished
            this.setState({
                isopen: true
            })
        }
        else {
            //Here we check if a randomly selected image has been selected before or not
            do {
                flag = true;
                activeIndex = Math.floor(Math.random() * 3);
                console.log("Change level");
                //We store the array index of FileDir in an array and use it compare
                for (var i = 0; i < usedImages.length; i++)
                    if (usedImages[i] === activeIndex)
                        flag = false;

                //only if a new, unique value is selected, it will display
                if (flag === true) {
                    usedImages.push(activeIndex);
                    fileName= fileDir[level][activeIndex].fileName;
                }
            } while (flag !== true);
        }

        this.props.setCards(level);

        //Start the Watch
        this.startWatch();
    }

    render() {
        return (
            <div>
                <Image className="imageStyling" src={fileName} />

                <Label style={{ zIndex: "1", position: "fixed", top: "10px", right: '4vw' }} color="teal">
                    {taskDone}/9
                </Label>

                <div className="NextButton" style={{ width: '180px' }} >
                    {this.state.activeNext ?
                        <Button primary animated size='huge' onClick={this.changeImage.bind(this)}>
                            <Button.Content visible> {this.state.buttonText} </Button.Content>
                            <Button.Content hidden>
                                <Icon name='right arrow' />
                            </Button.Content>
                        </Button>
                        :
                        <Button disabled size='huge'>{this.state.buttonText}</Button>
                    }
                </div>

                <Modal open={this.state.isopen} basic dimmer="blurring" style={{ position: "fixed", width: "auto", marginTop: "30vh", marginLeft: "38vw" }}>
                    <Header icon='check square outline' style={{ textAlign: "center" }} content='Task Completed!' />
                    <Modal.Content>
                        <h2> Thank you for your participation! <br />
                            Please download the result. </h2>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='blue' inverted onClick={this.OnFinish.bind(this, 1)}>
                            <Icon name='download icon' /> Download Result
                        </Button>
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }
}