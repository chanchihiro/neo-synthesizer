import React from 'react';
import ReactDOM from 'react-dom';
import BufferLoader from "../bufferLoader.js";
// スライダー入れたい


let timerID = null;
let interval = 100;

self.onmessage = function(e){
  if (e.data == "start") {
	console.log("スタート");
	timerID = setInterval( function() {postMessage("tick");}, interval)
  } else if (e.data.interval) {
	console.log("setting interval");
	interval = e.data.iånterval;
	console.log("interval=" + interval);
	if (timerID) {
	  clearInterval(timerID);
	  timerID = setInterval(function() {postMessage("tick");}, interval)
	}
  } else if (e.data == "stop") {
	console.log("stopping");
	clearInterval(timerID);
	timerID = null;
  }
};


// 間隔を調整する(milliseconds, handled by javascript clock)
let SCHEDULER_TICK = 25.0;
// スケジューリング先読み（sec, handled by WebAudio clock)
let SCHEDULER_LOOK_AHEAD = 0.1;

// webkitとかの設定
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext();

// bufferの読み込み
let bufferLoader = new BufferLoader(
  audioContext,
  ['../se/haihat.mp3',
    '../se/cymbal.mp3',
    '../se/bassdrum1.mp3',
    '../se/snare.mp3'],
  ()=>console.log('audio resource loading finished.')
);
bufferLoader.load();

// 実行して、メモをスケジューリングする
var timerWorker = new Worker(self.onmessage); /////////////////////////////ここ書き換える
timerWorker.postMessage({"interval": SCHEDULER_TICK});


function Square(props) {
  return (
  	  <button className = "note" onClick = {() => props.onClick() }>
        {props.marking}
      </button>
  )
}

class Track extends React.Component {
  render() {
	return(
      <div className="track">
        <span className="track-name">{this.props.name}</span>
        {Array(16).fill().map((x,i) =>
          <Square 
            key={i}
            marking={this.props.squares[i]}
            onClick={() => this.props.handler(i)}
          />
        )}
      </div>	
	)
  }
}

class LEDLine extends React.Component {
	render(){
		return(
	        <div className="track">
	          <span className="track-name"></span>
	          {Array(16).fill().map((x,i) =>
	          <button className={
	            (this.props.isPlaying && this.props.idxCurrent16thNote == (i+1)%16)? "led  led-playing" : "led"
	            } key={i} disabled />)}
	        </div>
		)
	}
}

class Sequencer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
	      tracks: [
	        {name:"hihat-open",
	         steps: [null,null,null,null,null,null,null,null,null,null,'■',null,null,null,null,null]},
	        {name:"hihat-close",
	         steps: ['■','■','■',null,'■',null,'■',null,'■',null,null,null,'■',null,'■',null]},
	        {name:"snare",
	         steps: [null,null,null,null,'■',null,null,null,null,null,null,null,'■',null,null,'■']},
	        {name:"kick",
	         steps: ['■',null,null,null,null,null,null,'■',null,'■','■',null,null,'■',null,null]},
	       ],
	      bpm: 100,
	      isPlaying: false,
	      idxCurrent16thNote: 0,
	      startTime: 0.0,
	      nextNoteTime: 0.0,
	      swing: 0
		};
		timerworker.onmessage = function(e) {
			if(e.data == "tick") {
				this.schedule();
			}
		}.bind(this);
	};

    render() {
      return (
        <div className="sequencer">
          <div className="area-tracks">
            {Array(4).fill().map((x,i) =>
              <Track 
                key={i}
                name={this.state.tracks[i].name}
                squares={this.state.tracks[i].steps}
                handler={(idx)=>this.toggleStep(i, idx)}
              />
            )};
            <LEDLine
              isPlaying={this.state.isPlaying}
              idxCurrent16thNote={this.state.idxCurrent16thNote}
            />
          </div>
          <hr />
          <div className="area-play">
            <button className="button-play" onClick={()=>this.togglePlayButton()}>
              {this.state.isPlaying ? '■STOP' : '▶PLAY!'}
            </button>
          </div>
          <div className="area-shuffle">
            <button className="button-shuffle" onClick={()=>this.shuffleNotes()}>SHUFFLE</button>
          </div>
          <div className="area-bpm">
            <span className="label-bpm">[bpm]</span>
            <div style={{display: 'inline-block', width: '200px'}}>
              <Slider min={40} max={250} step={1}
                editable pinned value={this.state.bpm} onChange={this.handleSliderChange.bind(this, 'bpm')}/>
            </div>
          </div>
          <div className="area-swing">
            <span className="label-swing">[swing]</span>
            <div style={{display: 'inline-block', width: '200px'}}>
              <Slider min={0} max={100} step={1}
                editable pinned value={this.state.swing} onChange={this.handleSliderChange.bind(this, 'swing')}/>
            </div>
          </div>
        </div>
      );
    }


  }

export default Sequencer